import nodemailer from 'nodemailer'
import { configDotenv } from 'dotenv';

configDotenv()

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.TRANSPORT_MAILER_USER,         
    pass: process.env.TRANSPORT_MAILER_PASSWORD
  }
});
