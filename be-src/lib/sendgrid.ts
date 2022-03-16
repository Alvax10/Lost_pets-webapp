import * as sgMail from "@sendgrid/mail";

export async function sendEmailToUser(userEmail, petName, newLocation, numeroDelUsuario) {

    await sgMail.setApiKey(process.env.API_KEY_SENDGRIND);
    const msg = {
        to: userEmail,
        from: "alvaro695547@gmail.com",
        subject: `Informacion reportada sobre ${petName}`,
        text: `este es el numero de la persona que lo vió: ${numeroDelUsuario}`,
        html: `<strong> Tu mascota fue vista en ${newLocation},
        este es el numero de la persona que lo vió: ${numeroDelUsuario} </strong>`,
    }
    const enviarMail = await sgMail.send(msg)
    .then(() => {
        console.log("Email enviado! :D");
        return true;
    });
}