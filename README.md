# Medication Adherence

The Medication Adherence application is a helpful artificial intelligence assistant powered by OpenAI's Realtime-API. Designed to assist the elderly, this chatbot not only reminds users to take their medication at the time needed, but also answers any questions that they may have about their prescriptions. After a conversation, it will use OpenAI's o1 reasoning model to provide feedback and urgent matters to a doctor based on the conversation transcript.

This project was created during the [GovTech x OpenAI Hackathon 2024](https://www.tech.gov.sg/media/events/govtech-openai-hackathon-2024/) and won 3rd place.

## Starting the console

This is a React project created using `create-react-app` that is bundled via Webpack.
Install it by extracting the contents of this package and using:

```shell
cd frontend
npm i
cd ../backend
npm i
```

Rename the extension for server.md in backend folder to server.js

Add in Recepient email in empty string in ./frontend/src/pages/Chat.js

```shell
const result = await fetchResponse(JSON.stringify(messages), "");
```

Add in JSON patient profile in ./frontend/utils/api.js, ./frontend/utils/conversation_config.js and ./frontend/static/patientprofile.js

```shell
Include patient information like name, age, medications and medication information.
```

Make sure to have 2 terminals open for both the frontend and the backend:

First terminal (./Medication-Adherence/backend)

```shell
node server.js
```

Second terminal (./Medication-Adherence/frontend)

```shell
npm run dev
```

It should be available via `localhost:3000`.

## How it works?

The console requires an OpenAI API key that has access to the Realtime API.
You will have to insert your API key in both `frontend/src/Chat.js` and `backend/server.js`

To start a session you'll need to **connect**. This will require microphone access.
There is only VAD mode, which means it is a hands-free conversation.

The actual system instruction used in this demo are available in `src/utils/api.js` and `src/utils/conversation_config.js`. Due to confidentiality, you would be required to fill in your own patient profile.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgement

This project is built by the Digital Learning Team of the Lee Kong Chian School of Medicine during the GovTech x OpenAI Hackathon 2024.

- [openai-realtime-console](https://github.com/openai/openai-realtime-console)
- Dr Ng Kian Bee
- Ng Wee Herng / [LinkedIn](https://www.linkedin.com/in/ng-wee-herng-0b8888272/)
- Bryan Tan Wen Tao / [LinkedIn](https://www.linkedin.com/in/bryan-tan-wen-tao-843b27272/)
- Thu Htet San / [LinkedIn](https://www.linkedin.com/in/thu-htet-san-733607169/)
- Lai Kai Wen, Calvin / [LinkedIn](https://www.linkedin.com/in/calvin-lai-1865b9279/) / [Mystichunterz on Github](https://github.com/Mystichunterz)
