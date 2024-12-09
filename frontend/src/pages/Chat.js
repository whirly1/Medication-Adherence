import { useEffect, useRef, useCallback, useState } from 'react';
import ChatPanel from '../components/ChatPanel';
import Sidebar from '../components/Sidebar';
import Button from '../components/button/Button';
import patients from '../static/patientprofile';
// import conversation from '../static/conversation';
import dates from '../static/dates';
import { X, Zap } from 'react-feather';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { instructions } from '../utils/conversation_config.js';
import { WavRenderer } from '../utils/wav_renderer.ts';

import fetchResponse from '../utils/api.js';

const Chat = () => {
    const patient = patients[0];
    const [collapsed, setCollapsed] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const clientCanvasRef = useRef(null);
    const serverCanvasRef = useRef(null);
    const [selectedVoice, setSelectedVoice] = useState("default");
    const [items, setItems] = useState([]);

    // configuration and setting of consts
    const apiKey = ""
    const wavRecorderRef = useRef(new WavRecorder({ sampleRate: 24000 }));
    const wavStreamPlayerRef = useRef(new WavStreamPlayer({ sampleRate: 24000 }));
    const clientRef = useRef(
        new RealtimeClient({
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
        })
    );

    const startTimeRef = useRef(new Date().toISOString());

    const [messages, setMessages] = useState([])
    const [realtimeEvents, setRealtimeEvents] = useState([]);

    // connects conversation
    const connectConversation = useCallback(async () => {
        const client = clientRef.current;
        const wavRecorder = wavRecorderRef.current;
        const wavStreamPlayer = wavStreamPlayerRef.current;

        startTimeRef.current = new Date().toISOString();
        setIsConnected(true);
        setRealtimeEvents([]);
        setItems(client.conversation.getItems());

        await wavRecorder.begin();
        await wavStreamPlayer.connect();
        await client.connect();

        client.updateSession({
            turn_detection: { type: 'server_vad', silence_duration_ms: 1000 },
        });

        // sends text input automatically to start conversation
        client.sendUserMessageContent([
            {
                type: `input_text`,
                text: `Hello`,
            },
        ]);

        if (client.getTurnDetectionType() === 'server_vad') {
            await wavRecorder.record((data) => client.appendInputAudio(data.mono));
        }
    }, []);

    // disconnects conversation and sends messages to o1 reasoning model
    const disconnectConversation = useCallback(async () => {
        console.log(messages)

        setIsConnected(false);
        setRealtimeEvents([]);
        setItems([]);

        const client = clientRef.current;
        client.disconnect();

        const wavRecorder = wavRecorderRef.current;
        await wavRecorder.end();

        const wavStreamPlayer = wavStreamPlayerRef.current;
        await wavStreamPlayer.interrupt();

        console.log("Using fetchResponse with following messages: ", JSON.stringify(messages))
        const result = await fetchResponse(JSON.stringify(messages), "");
        console.log(result);
    }, [messages]);

    // formats conversation to a proper format for messages constant
    useEffect(() => {
        if (items.length > 0) {
            const formattedConversation = items.map((item) => {
                const extendedItem = {
                    ...item,
                    textBuffer: item.textBuffer || '',
                    finalMessage: item.finalMessage || '',
                    isFinal: item.isFinal || false,
                };

                const role = extendedItem.role === 'user' ? 'Amos Chen' : 'Assistant';
                const content = `${role}: ${extendedItem.isFinal && extendedItem.finalMessage
                    ? extendedItem.finalMessage
                    : extendedItem.formatted?.text ||
                    extendedItem.formatted?.transcript ||
                    '(function calling)'
                    }`;

                return { content, role: extendedItem.role };
            });

            setMessages(formattedConversation);
            // console.log(messages)
        }
    }, [items, messages]);

    // canvas for voice detection
    useEffect(() => {
        let isLoaded = true;

        const wavRecorder = wavRecorderRef.current;
        const clientCanvas = clientCanvasRef.current;
        let clientCtx = null;

        const wavStreamPlayer = wavStreamPlayerRef.current;
        const serverCanvas = serverCanvasRef.current;
        let serverCtx = null;

        const render = () => {
            if (isLoaded) {
                if (clientCanvas) {
                    if (!clientCanvas.width || !clientCanvas.height) {
                        clientCanvas.width = clientCanvas.offsetWidth;
                        clientCanvas.height = clientCanvas.offsetHeight;
                    }
                    clientCtx = clientCtx || clientCanvas.getContext('2d');
                    if (clientCtx) {
                        clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
                        const result = wavRecorder.recording
                            ? wavRecorder.getFrequencies('voice')
                            : { values: new Float32Array([0]) };
                        WavRenderer.drawBars(
                            clientCanvas,
                            clientCtx,
                            result.values,
                            '#ff0000',
                            10,
                            0,
                            8
                        );
                    }
                }
                if (serverCanvas) {
                    if (!serverCanvas.width || !serverCanvas.height) {
                        serverCanvas.width = serverCanvas.offsetWidth;
                        serverCanvas.height = serverCanvas.offsetHeight;
                    }
                    serverCtx = serverCtx || serverCanvas.getContext('2d');
                    if (serverCtx) {
                        serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
                        const result = wavStreamPlayer.analyser
                            ? wavStreamPlayer.getFrequencies('voice')
                            : { values: new Float32Array([0]) };
                        WavRenderer.drawBars(
                            serverCanvas,
                            serverCtx,
                            result.values,
                            '#000000',
                            10,
                            0,
                            8
                        );
                    }
                }
                window.requestAnimationFrame(render);
            }
        };
        render();

        return () => {
            isLoaded = false;
        };
    }, []);

    //
    useEffect(() => {
        const wavStreamPlayer = wavStreamPlayerRef.current;
        const client = clientRef.current;

        // updates voice and specific instructions
        client.updateSession({ voice: "ash" });
        client.updateSession({ instructions: instructions });
        client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

        // adds function call for weather
        client.addTool(
            {
                name: 'get_weather',
                description:
                    'Retrieves the weather for a given lat, lng coordinate pair. Specify a label for the location.',
                parameters: {
                    type: 'object',
                    properties: {
                        lat: {
                            type: 'number',
                            description: 'Latitude',
                        },
                        lng: {
                            type: 'number',
                            description: 'Longitude',
                        },
                        location: {
                            type: 'string',
                            description: 'Name of the location',
                        },
                    },
                    required: ['lat', 'lng', 'location'],
                },
            },
            async ({ lat, lng, location }) => {
                // Fetch weather data from Open Meteo API
                const result = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`
                );
                const json = await result.json();

                // Process and return weather data
                const temperature = {
                    value: json.current.temperature_2m,
                    units: json.current_units.temperature_2m,
                };
                const wind_speed = {
                    value: json.current.wind_speed_10m,
                    units: json.current_units.wind_speed_10m,
                };

                return json;
            }
        );

        client.on('realtime.event', (realtimeEvent) => {
            setRealtimeEvents((realtimeEvents) => {
                const lastEvent = realtimeEvents[realtimeEvents.length - 1];
                if (lastEvent?.event.type === realtimeEvent.event.type) {
                    lastEvent.count = (lastEvent.count || 0) + 1;
                    return realtimeEvents.slice(0, -1).concat(lastEvent);
                } else {
                    return realtimeEvents.concat(realtimeEvent);
                }
            });
        });

        client.on('error', (event) => console.error(event));
        client.on('conversation.interrupted', async () => {
            const trackSampleOffset = await wavStreamPlayer.interrupt();
            if (trackSampleOffset?.trackId) {
                const { trackId, offset } = trackSampleOffset;
                await client.cancelResponse(trackId, offset);
            }
        });

        // modified conversation update to keep transcription of the conversation even when it is interrupted
        client.on('conversation.updated', async ({ item, delta }) => {
            // Reference original array directly
            const items = client.conversation.getItems();

            const existingItem = items.find((itm) => itm.id === item.id);

            if (existingItem) {
                // Initialize the textBuffer if it doesn't exist
                if (!existingItem.textBuffer) {
                    existingItem.textBuffer = '';
                }

                // Append the new text or transcript
                if (delta?.text || delta?.transcript) {
                    existingItem.textBuffer += delta.text || delta.transcript;
                }

                // Add audio data if available
                if (delta?.audio) {
                    wavStreamPlayer.add16BitPCM(delta.audio, item.id);
                }

                // If completed or interrupted, finalize the message
                if (item.status === 'completed' || item.interrupted) {
                    existingItem.finalMessage = existingItem.textBuffer;
                    existingItem.isFinal = true;
                }

                setItems([...items]); // Create a shallow copy to trigger re-render
            }
        });

        return () => {
            client.reset();
        };
    }, [selectedVoice]);

    return (
        <div className="flex h-screen">
            <Sidebar chatDays={dates} collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className={`flex-grow h-lvh flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
                <div className="flex flex-col flex-grow border-2">
                    {/* Chat Panel */}
                    <div className="flex-grow overflow-y-auto">
                        <ChatPanel conversations={items} patientName={patient.name} />
                    </div>

                    {/* Bottom Section */}
                    <div className="p-4 border-t-2 bg-gray-100">
                        <div className="flex justify-center items-center gap-5">
                            <Button
                                label={isConnected ? 'disconnect' : 'connect'}
                                iconPosition={isConnected ? 'end' : 'start'}
                                icon={isConnected ? X : Zap}
                                buttonStyle={isConnected ? 'regular' : 'action'}
                                onClick={isConnected ? disconnectConversation : connectConversation}
                            />
                            <div className="flex">
                                <canvas ref={clientCanvasRef} className="w-[100px] h-16 bg-gray-100" />
                                <canvas ref={serverCanvasRef} className="w-[100px] h-16 bg-gray-100" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-5">
                            <label htmlFor="voice-select">Voice:</label>
                            <select
                                id="voice-select"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ash">Male</option>
                                <option value="sage">Female</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;