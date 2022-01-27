import * as sgMail from "@sendgrid/mail";

export async function sendEmailToUser(OtherUserEmail, userEmail, petName, newLocation, numeroDelUsuario) {

    await sgMail.setApiKey(process.env.API_KEY_SENDGRIND);
    const msg = {
        to: OtherUserEmail,
        from: userEmail,
        subject: `Informacion reportada sobre ${petName}`,
        text: `este es el numero de la persona que lo vió: ${numeroDelUsuario}`,
        html: `<strong> Tu mascota fue vista en ${newLocation},
        este es el numero de la persona que lo vió: ${numeroDelUsuario} </strong>`,
    }
    const enviarMail = await sgMail.send(msg)
    .then(() => {
        console.log("Email enviado! :D");
    });
}