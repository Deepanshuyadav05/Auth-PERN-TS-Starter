import 'dotenv/config'
import { Resend } from "resend";


type SendEmailOptions = {
    from: string;
    to: string;
    subject: string;
    html: string;
};
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ from, to, subject, html }: SendEmailOptions) {

    const { error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
    });

    if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
    console.log("email send successfully");

}