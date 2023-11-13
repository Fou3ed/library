import nodemailer from 'nodemailer';
import axios from 'axios';
import enText from '../lang/email_registration_en.json' assert {type: 'json'};
import frText from '../lang/email_registration_fr.json' assert {type: 'json'};

export default async function sendVerificationEmail(recipientEmail,socket,applicationName,language) {
  try {
    console.log("language",language)
    const response = await axios.post(`${process.env.API_PATH}/tools/2fa/generate`, {
      receiver: recipientEmail,
    }, {
      headers: {
        key: process.env.API_KEY, 
      },
    });
    if (response.data.success) {
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: process.env.MAILER_PORT,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD,
        },
      });

      const languageText = language.substring(0, 2).toLowerCase() === 'en' ? enText : frText;
      
      const htmlTemplate = `<p>${languageText.code.description}  ${response.data.generated_code}</p>`;

      const mailOptions = {
        from: {name:applicationName,
           address :process.env.USER_EMAIL},
        to: recipientEmail,
        subject: languageText.code.subject ,
        html: htmlTemplate,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log(mailOptions)
      console.log("response",response.data)
      console.log('Verification email sent successfully:', info.response);
    } else {
        socket.emit("SendingMailFail",response.data.error_type)
      console.log('Verification code sent fail:', response.data.error_type);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
