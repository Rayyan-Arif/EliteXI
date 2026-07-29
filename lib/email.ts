import nodemailer from "nodemailer";
import { catchAsync } from "./helper";

export const sendEmail = async(to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT!,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        from: "rayyanarif114@gmail.com",
        to,
        subject,
        html
    });
};