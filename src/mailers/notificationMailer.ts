import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { Log } from '../models/log';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: config.senderEmail,
      pass: config.senderPass,
    },
  });

export const sendMail = async (email: string, subject: string, text: string) => {
    try{
          const info = await transporter.sendMail({
            from: config.senderEmail,
            to: email,
            subject,
            text,
          });
          const logMessage = `Email sent to ${email} with message id: ${info.messageId}`;
          const logInstance = Log.create({ message: logMessage.slice(0, 255) });
          await Log.save(logInstance);
    }
    catch(err){
        const errorMessage = `Error sending email to ${email}: ${err.message}`;
        const errorLogInstance = Log.create({ message: errorMessage.slice(0, 255) });
        await Log.save(errorLogInstance);
    }


};
 
