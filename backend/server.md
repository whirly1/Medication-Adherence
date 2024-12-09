const { OpenAI } = require('openai');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI API key
const openai = new OpenAI({
    apiKey: "",
  });

// Nodemailer
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "medicationadherence2@gmail.com",
      pass: "",
    },
  });

  app.post('/api/generate', async (req, res) => {
    const { prompt, recipientEmail } = req.body;
    console.log(prompt)
    try {
      const response = await openai.chat.completions.create({
        model: 'o1-preview',
        messages: [{ role: 'user', content: prompt }],
      });
  
      const aiResponse = response.choices[0].message.content;
  
      // Send the response via email
      const mailOptions = {
        from: "medicationadherence2@gmail.com",
        to: recipientEmail,
        subject: 'Medication Adherence AI Assistant Feedback (Amos Chen)',
        text:`Dear Dr Ng,

Thank you for using our Medication Adherence AI Assistant. Below is the feedback based on your patient's interaction:

${aiResponse}

If you have any further questions or need additional assistance, please do not hesitate to contact us.

Best regards,
Medication Adherence AI Assistant Team`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email sent:', info.response);
        res.json({ response: aiResponse, emailInfo: info.response });
      });
  
  
      console.log(response.choices[0].message.content)
      res.json({ response: response.choices[0].message.content });
    } catch (error) {
  
      console.error('Error details:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  const PORT = 5000; 
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  