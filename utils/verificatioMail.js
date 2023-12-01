import nodemailer from 'nodemailer';
import axios from 'axios';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const enText = require("../lang/email_verification_en.json");
const frText = require("../lang/email_verification_fr.json");

export default async function sendVerificationEmail(data,socket,applicationName,language) {
  try {
    const response = await axios.post(`${process.env.API_PATH}/tools/2fa/generate`, {
      receiver: data.email,
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
        const htmlTemplate=`
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="Generator" content="Microsoft Word 15 (filtered medium)"/> <style>@font-face{font-family: Helvetica; panose-1: 2 11 6 4 2 2 2 2 2 4;}@font-face{font-family: "Cambria Math"; panose-1: 2 4 5 3 5 4 6 3 2 4;}@font-face{font-family: Calibri; panose-1: 2 15 5 2 2 2 4 3 2 4;}@font-face{font-family: "Arial Narrow"; panose-1: 2 11 6 6 2 2 2 3 2 4;}@font-face{font-family: "Segoe UI"; panose-1: 2 11 5 2 4 2 4 2 2 3;}p.MsoNormal, li.MsoNormal, div.MsoNormal{margin: 0cm; font-size: 11pt; font-family: "Calibri", sans-serif;}a:link, span.MsoHyperlink{mso-style-priority: 99; color: blue; text-decoration: underline;}span.st-delink{mso-style-name: st-delink;}span.st-button-internal{mso-style-name: st-button-internal;}span.EmailStyle20{mso-style-type: personal-reply; font-family: "Arial Narrow", sans-serif; color: windowtext; font-weight: normal; font-style: normal; text-decoration: none none;}.MsoChpDefault{mso-style-type: export-only; font-size: 10pt; mso-ligatures: none;}</style></head><body bgcolor="#F6F9FC" lang="FR" link="blue" vlink="purple" style="word-wrap: break-word;"> <div class="WordSection1"> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%; background: #f6f9fc;"> <tr style="height: 48pt;"> <td style="padding: 0cm 0cm 0cm 0cm; height: 48pt;"> <div> <p class="MsoNormal"> <span style="color: black;">&nbsp;</span> <o:p></o:p> </p></div></td></tr><tr> <td style="padding: 0cm 0cm 0cm 0cm;"> <div align="center"> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="600" style="width: 450pt; background: white; border-top-left-radius: 16px; border-top-right-radius: 16px; min-width: 600px;"> <tr> <td style="padding: 0cm 0cm 0cm 0cm; max-height: 0; overflow: hidden;"> <p class="MsoNormal"> <span style="display: none;"> <o:p>&nbsp;</o:p> </span> </p><table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="600" style="width: 450pt; min-width: 600px;"> <tr style="height: 21.75pt;"></tr></table> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="600" style="width: 450pt; min-width: 600px;"> <tr style="height: 18pt;"> <td colspan="3" style="padding: 0cm 0cm 0cm 0cm; height: 18pt;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;">&nbsp;<o:p></o:p></span> </p></div></td></tr><tr> <td width="48" style="width: 36pt; padding: 0cm 0cm 0cm 0cm;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;">&nbsp;<o:p></o:p></span> </p></div></td><td style="padding: 0cm 0cm 0cm 0cm;"> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%; border-radius: 8px;"> <tr> <td style="padding: 0cm 0cm 0cm 0cm;"> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%;"> <tr style="height: 9pt;"> <td colspan="3" style="padding: 0cm 0cm 0cm 0cm; height: 9pt;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td></tr><tr> <td width="16" style="width: 12pt; padding: 0cm 0cm 0cm 0cm;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td><td style="padding: 0cm 0cm 0cm 0cm;"> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%;"> <tbody> <tr style="height: 3pt;"> <td style="padding: 0cm 0cm 0cm 0cm; height: 3pt; max-height: 1px;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td></tr></tbody> </table> <p class="MsoNormal" style="line-height: 18pt;"> <span style="font-size: 12pt; font-family: Helvetica, sans-serif; color: #414552; display: none;"> <o:p>&nbsp;</o:p> </span> </p><p class="MsoNormal" style="line-height: 18pt;"> <span style="font-size: 12pt; font-family: Helvetica, sans-serif; color: #414552; display: none;"> <o:p>&nbsp;</o:p> </span> </p><p class="MsoNormal"> <span class="st-delink"> <span style="font-size: 12pt;font-family: Helvetica, sans-serif;color: #414552;border: none windowtext 1pt;padding: 0cm;">${languageText.content.header}, </span> </b> </span> <b> <span style="font-size: 21pt; font-family: Helvetica, sans-serif; color: #414552;"> <o:p></o:p> </span> </p><table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%;"> <tbody> <tr> <td style="padding: 0cm 0cm 0cm 0cm;"> <p class="MsoNormal" style="line-height: 18pt;"> <span class="st-delink"> <span style="font-size: 12pt; font-family: Helvetica, sans-serif; color: #414552; border: none windowtext 1pt; padding: 0cm;">${languageText.content.body}</span> </span> </p></td></tr></tbody> </table> <p class="MsoNormal" style="line-height: 18pt;"> <span style="font-size: 12pt; font-family: Helvetica, sans-serif; color: #414552; display: none;"> <o:p>&nbsp;</o:p> </span> </p><p class="MsoNormal" style="height: 20pt;"> <span style="font-size: 12pt; font-family: Helvetica, sans-serif; color: #414552; display: none;"> <o:p>&nbsp;</o:p> </span> </p><table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%; background: #f9f9f9; border-radius: 7px;"> <tbody style=""> <tr style="height: 10pt;"> <td></td></tr><tr style=""> <td style="width: 10pt;"></td><td style="padding: 0cm 0cm 0cm 0cm;"> <div> <span style="color: #181c32; font-size: 30px; font-weight: 600; font-family: Arial, Helvetica, sans-serif;">${response.data.generated_code}</span> </div></td></tr><tr style="height: 10pt;"> <td></td></tr></tbody> </table> </td><td width="16" style="width: 12pt; padding: 0cm 0cm 0cm 0cm;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td></tr><tr style="height: 8.25pt;"> <td colspan="3" style="padding: 0cm 0cm 0cm 0cm; height: 8.25pt;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td></tr><tr style="height: 0.75pt;"> <td colspan="3" style="border: solid white 1pt; padding: 0cm 0cm 0cm 0cm; height: 0.75pt; max-height: 1px;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td></tr></table> </td></tr><tr> <td style="padding: 0cm 0cm 0cm 0cm;"> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%;"> <tr style="height: 9pt;"> <td colspan="3" style="padding: 0cm 0cm 0cm 0cm; height: 9pt;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td></tr><tr> <td width="16" style="width: 12pt; padding: 0cm 0cm 0cm 0cm;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td><td style="padding: 0cm 0cm 0cm 0cm;"> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%;"> <tr> <td style="padding: 0cm 0cm 0cm 0cm;"> <p class="MsoNormal" style="line-height: 18pt;"> <span style="font-size: 10pt; font-family: Helvetica, sans-serif; color: #414552;">${languageText.content.footer.greeting}<o:p></o:p> </span> </p></td></tr></table> <p class="MsoNormal" style="line-height: 18pt;"> <span style="font-size: 12pt; font-family: Helvetica, sans-serif; color: #414552; display: none;"> <o:p>&nbsp;</o:p> </span> </p><table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%;"> <tr> <td style="padding: 0cm 0cm 0cm 0cm;"> <p class="MsoNormal" style="line-height: 18pt;"> <span style="font-size: 10pt; font-family: Helvetica, sans-serif; color: #414552;">${languageText.content.footer.brand} ${languageText.content.footer.team}<o:p> </o:p> </span> </p></td></tr></table> </td><td width="16" style="width: 12pt; padding: 0cm 0cm 0cm 0cm;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;"> &nbsp; <o:p></o:p> </span> </p></div></td></tr></table> </td></tr></table> </td><td width="48" style="width: 36pt; padding: 0cm 0cm 0cm 0cm;"> <div> <p class="MsoNormal" style="line-height: 0.75pt; mso-line-height-rule: exactly;"> <span style="font-size: 1pt;">&nbsp;<o:p></o:p></span> </p></div></td></tr></table> <div> <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="600" style="width: 450pt; background: white; min-width: 600px; border-bottom-right-radius: 16px; border-bottom-left-radius: 16px;"> <tr style="height: 30pt;"> <td style="padding: 0cm 0cm 0cm 0cm; height: 30pt;"> <div> <p class="MsoNormal"> <span style="color: black;">&nbsp;</span> <o:p></o:p> </p></div></td></tr></table> </div></td></tr></table> </div></td></tr></table> </div></body></html>
        `
      const mailOptions = {
        from: {name:applicationName,
           address :process.env.USER_EMAIL},
        to: data.email,
        subject: languageText.subject ,
        html: htmlTemplate,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("response",response.data)
      console.log('Verification email sent successfully:', info.response);
      socket.emit("emailSent",data)
    } else {
        socket.emit("SendingMailFail",response.data.error_type)
      console.log('Verification code sent fail:', response.data.error_type);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
