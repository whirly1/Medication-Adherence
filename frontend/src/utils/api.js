const fetchResponse = async (userInput, recipientEmail) => {

  const prompt = `**User Prompt for Medication Adherence o1-preview model:**

---

**Instructions:**

You are an AI assistant tasked with evaluating a conversation transcript between a patient and an AI assistant regarding the patient's medication. Your goal is to compare the AI assistant's responses in the transcript against the provided set context, which includes the patient's details and medication orders. Use your chain-of-thought reasoning to generate **feedback points** that highlight any discrepancies, confirmations, or omissions between the AI assistant's responses and the set context.  You must highlight urgent issues (e.g., potential adverse interactions, severe symptoms, or medication errors) and distinguish them clearly from non-urgent points (e.g., minor discrepancies or confirmations).
    

**Please provide your output in the following structure:**

1. **Urgent Issues:**

    - Place a giant header in caps "ATTENTION NEEDED!" for immediate issues that require urgent attention like adverse medication side effects. Place separate subheadings after the "ATTENTION NEEDED!". Provide a clear and concise explanation of the issue and its potential impact on the patient's health.  Make clear indications that monitoring of patient condition is needed.

2. **Patient Details:**

   - Summarize the patient's key details based on the set context. 

3. **Medication:**

   - Summarize the medication orders from the set context.

4. **Transcript:**

   - Include the conversation transcript between the patient and the AI assistant.

5. **Feedback:**

   - Provide detailed feedback points comparing the AI assistant's responses with the set context. Use clear and concise language to explain each point. Separate positive feedback and negative feedback with their individual subheadings.

---

**Input:**

\`\`\`json
${userInput}
\`\`\`

---

**Set Context:**

\`\`\`json
(Add JSON of patient profile, including particulars, medication etc.)
\`\`\`

---

**Note:** Use the information provided in the set context to accurately evaluate the AI assistant's responses in the transcript. Your feedback in "Urgent Issues" should help improve the accuracy and quality of the AI assistant's future interactions.`;

  try {
    const response = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, recipientEmail }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return 'Error occurred. Please try again.';
  }
};

export default fetchResponse;
