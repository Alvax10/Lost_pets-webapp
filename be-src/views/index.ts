import { User } from "../models/user-mascot"
import { Mascot } from "../models/user-mascot"
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { findOrCreateUser, verifyAuth, authenticateUser, verifyIfUserExists, completeUserData, updateUserData } from "../controllers/auth-controller";
import { reportLostPet, allReportedPetsByAUser, mascotsCloseFrom } from "../controllers/mascot-controller";
const sgMail = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 3010;

app.use(express.json({ limit: "100mb" }));
app.use(cors());

// Send an email to other user
app.post("/send-email-to-user", async(req, res) => {
    const { OtherUserEmail, userEmail, petName, newLocation, numeroDelUsuario} = req.body;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: OtherUserEmail,
        from: userEmail,
        subject: `Informacion reportada sobre ${petName}`,
        text: `Tu mascota fue vista en ${newLocation}`,
        html: `<strong> Este es el numero de la persona que lo vió: ${numeroDelUsuario} </strong>`,
    }
    sgMail.send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    });
    res.json(msg);
    return msg;
});

// Get pet around the raidus
app.get("/mascots-close-from", async (req, res) => {
    const { lat, lng } = req.query;

    if (lat && lng) {

        const hits = await mascotsCloseFrom(lat, lng);
        res.json(hits);
        return hits;

    } else {
        console.error("Faltan datos en el query!");
    }
});

// All reported pets by a user
app.get("/user/reported-mascots", async(req, res) => {
    const { email } = req.query;

    if (email) {
        const allReportedPets = await allReportedPetsByAUser(email)
        .catch((err) => {
            console.error("Este es el error: ", err);
        });

        await res.json(allReportedPets);
        return allReportedPets;

    } else {
        res.status(400).json({ message: 'Falta el userId o no existe'});
    }
});

// Report mascot
app.post("/report/mascot", async(req, res) => {
    const { petName, _geoloc, imageDataURL, email } = req.body;

    if ( petName && _geoloc && imageDataURL && email) {
        const reportedPet = await reportLostPet(petName, _geoloc, imageDataURL, email);
        await res.json( reportedPet );

        return reportedPet;

    } else {
        res.status(400).json({ message: 'Faltan datos en el body o el userId no existe'});
    }
});

// Update user data
app.patch("/user/data", async(req, res) => {
    const { password } = req.body;

    if (password) {
        await updateUserData(password);
        await res.json({ message: 'updated succesfully' });

    } else {
        res.status(400).json({ message: 'Falta contraseña'});
    }
})

// Complete user Info
app.post("/update/user/info", async(req, res) => {
    const { email, phone_number, username } = req.body;

    if (email && phone_number && username) {

        await completeUserData(email, phone_number, username);
        await res.json({ message: 'info updated'});

    } else {
        res.status(400).json({ message: 'faltan datos en el body o el email no existe'});
    }
});

// Verify if user exists
app.post("/verify/user", async(req, res) => {
    const { email } = req.body;

    if (email) {
        const response = await verifyIfUserExists(email);
        await res.json( response );

    } else {
        res.status(404).json({ message:'falta el email' });
    }
});

// Sign In
app.post("/auth/token", async(req, res) => {
    const { email, password } = req.body;

    if (req.body) {

        await authenticateUser(email, password);
        await res.json({ message: 'User loged in' });

    } else {
        res.status(404).json({ message: 'falta el email o la contraseña' });
    }
})

// Sign Up
app.post("/auth", async (req, res) => {
    
    const { email, password } = req.body;
    
    if (req.body) {
        await findOrCreateUser(email, password);
        await res.json({ message: 'User created' });

    } else {
        res.json({ message: 'el body tiene que tener email y password'});
    }
})

// Finds all users
app.get("/users", async(req, res) => {

    const users = await User.findAll();
    await res.json({ users });
});

// Finds a user
app.get("/user", async(req, res) => {
    const { user_id } = req.body;

    const user = await User.findByPk(user_id);
    await res.json({ user });
});

// Finds all mascots
app.get("/mascots", async(req, res) => {

    const mascots = await Mascot.findAll();
    await res.json(mascots);
});

// Shows the info of a user
app.get("/me", verifyAuth , async (req, res) => {
    
    if (req) {

        const data = req._user;
        const userData = await User.findByPk(data['id']);
        await res.json({
            id: userData['id'],
            email: userData['email'],
            user_name: userData['user_name']
        });
    } else {
        res.status(404).json({
            message: 'Faltan datos o los datos no coinciden',
        });
    }
});

app.post("/test", async(req, res) => {

    await res.json({
        message: 'todo ok',
    });
});

const relativeRoute = path.resolve(__dirname + "../../../dist");
app.get("*", app.use(express.static(relativeRoute)));

app.get("*", (req, res) => {
    res.sendFile(relativeRoute + "/index.html");
});

app.listen(port, async ()=> {
    await console.log("Iniciado en el puerto:", port);
});