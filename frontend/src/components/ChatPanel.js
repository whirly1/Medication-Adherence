import React, { useRef, useEffect } from 'react';

const ChatPanel = ({ conversations, patientName }) => {
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations]);

    return (
        <div className="chat-box flex-1 overflow-y-scroll p-5 bg-gray-100">
            {conversations.slice(1).map((conversationItem, index) => (
                <div key={conversationItem.id}>
                    <div>
                        {!conversationItem.formatted.tool &&
                            conversationItem.role === 'user' && (
                                <div className=" text-red-500 whitespace-pre-wrap mb-5">
                                    <strong>{patientName}: </strong>
                                    {conversationItem.formatted.transcript ||
                                        (conversationItem.formatted.audio?.length
                                            ? '(awaiting transcript)'
                                            : conversationItem.formatted.text ||
                                            '(item sent)')}
                                </div>
                            )}
                        {!conversationItem.formatted.tool &&
                            conversationItem.role === 'assistant' && (
                                <div className="whitespace-pre-wrap mb-5">
                                    <strong>Assistant: </strong>
                                    {conversationItem.isFinal
                                        ? conversationItem.finalMessage  // Show final message once completed
                                        : conversationItem.textBuffer || '(streaming...)'}
                                </div>
                            )}
                    </div>
                </div>
            )
            )}
            <div ref={messageEndRef}></div>
        </div>
    );
};

export default ChatPanel;
