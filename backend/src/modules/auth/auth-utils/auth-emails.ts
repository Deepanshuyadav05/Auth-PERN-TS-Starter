import { sendEmail } from "../../../utils/send-email.js";

//explanation why we use escape html is in obsidian notes
const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export async function sendVerificationEmail(to: string, name: string, token: string) {

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const from:string = 'verify@mail.iamdeepanshu.dev'
    //build the html string (a greeting with the name + an <a href> with the link)

    const htmlSnippit = `<html>
    <head>
    
    </head>
    <body>
        <div class="container">
            <h2>Email Validation mail</h2>
            <p>Hello ${escapeHtml(name)}</p>
            <p>
                please verify your email before proceeding further
                here is the link: <a href="${verificationLink}" target="_blank" >Click here</a>
            </p>
            
        </div>
    </body>
    </html>`

    //call sendEmail({ to, subject: "...", html })
    await sendEmail({from, to, subject:"Email verification", html:htmlSnippit })
}

export async function sendResetPasswordEmail(to: string, name: string, token: string) {

    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const from:string = 'noreply@mail.iamdeepanshu.dev'
    //build the html string (a greeting with the name + an <a href> with the link)

    const htmlSnippit = `<html>
    <head>
    
    </head>
    <body>
        <div class="container">
            <h2>Password reset mail</h2>
            <p>Hello ${escapeHtml(name)}</p>
            <p>
                Reset your password by clicking the link below
                here is the link: <a href="${resetPasswordLink}" target="_blank" >Click here</a>
            </p>
            
        </div>
    </body>
    </html>`

    //call sendEmail({ to, subject: "...", html })
    await sendEmail({from, to, subject:"Password reset", html:htmlSnippit })
}