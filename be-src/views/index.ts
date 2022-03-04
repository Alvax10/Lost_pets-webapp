import * as path from "path";
import * as cors from "cors";
import * as express from "express";
import { User } from "../models/user-mascot";
import { Mascot } from "../models/user-mascot";
import { sendEmailToUser } from "../lib/sendgrid";
import { checkBody } from "../middleware/checkBody";
import { verifyAuth } from "../middleware/verifyAuth";
import { createUser, authenticateUser, verifyIfUserExists, completeUserData, updateUserData } from "../controllers/auth-controller";
import { reportLostPet, allReportedPetsByAUser, mascotsCloseFrom, updateProfile, eliminateMascot } from "../controllers/mascot-controller";
const fileupload = require('express-fileupload'); 

const app = express();
const port = process.env.PORT || 3011;

app.use(express.json({ limit: "75mb" }));
app.use(cors());
app.use(fileupload({useTempFiles: true}))


//Eliminate mascot
app.delete("/eliminate-mascot", verifyAuth, checkBody, async(req, res) => {
    const { mascotId, objectID } = req.body;

    await eliminateMascot(mascotId, objectID)
    .then((resp) => {
        res.status(200).json("Mascota Eliminada");
        return resp;
    });
    res.json(true);
});

// Update mascot info
app.patch("/update-mascot-info", verifyAuth, checkBody, async(req, res) => {
    const { userId, mascotId, objectID, petName, ImageDataURL, mascotLocation } = req.body;

    const dataUpdated = await updateProfile(userId, mascotId, objectID, petName, ImageDataURL, mascotLocation)
    .catch((err) => {
        console.log(err);
    });
    res.json(dataUpdated);
});


// Send an email to other user
app.post("/send-email-to-user", verifyAuth, checkBody, async(req, res) => {
    const { userEmail, petName, newLocation, numeroDelUsuario } = req.body;

    try {
        await sendEmailToUser(userEmail, petName, newLocation, numeroDelUsuario)
    } catch(err) {
        console.log("Este es el error de send email: ", err);
    }
});

// Get pet around the raidus
app.get("/mascots-close-from", checkBody, async(req, res) => {
    const { lat, lng } = req.query;

    const hits = await mascotsCloseFrom(lat, lng)
    // .catch((err) => {
    //     console.log("Este es el error de mascots close from: ", err);
    // });

    res.json(hits);
    return hits;
});

// All reported pets by a user
app.get("/user/reported-mascots", verifyAuth, checkBody, async(req, res) => {
    const { email } = req.query;

    const allReportedPets = await allReportedPetsByAUser(email);
    await res.json(allReportedPets);
    return allReportedPets;
});

// Report mascot
app.post("/report/mascot", verifyAuth, checkBody, async(req, res) => {
    const { petName, _geoloc, ImageDataURL, email } = req.body;

    const reportedPet = await reportLostPet(petName, _geoloc, ImageDataURL, email);
    await res.json(reportedPet);
});

// Update user data
app.patch("/user/data", checkBody, async(req, res) => {
    const { email, newPassword } = req.body;

    await updateUserData(email, newPassword);
    await res.json({ message: 'updated succesfully' });
})

// Complete user Info
app.post("/complete/user/info", verifyAuth, checkBody, async(req, res) => {
    const { email, phone_number, username } = req.body;

    await completeUserData(email, phone_number, username);
    await res.json({ message: 'info updated'});
});

// Verify if user exists
app.post("/verify/user", checkBody, async(req, res) => {
    const { email } = req.body;

    const response = await verifyIfUserExists(email);
    await res.json( response );
});

// Sign In
app.post("/auth/token", checkBody, async(req, res) => {
    const { email, password } = req.body;

    const response = await authenticateUser(email, password);
    await res.json(response);
})

// Sign Up
app.post("/auth", checkBody, async (req, res) => {
    const { email, password } = req.body;

    const response = await createUser(email, password);
    await res.json( response );
});

// Finds all users
app.get("/users", async(req, res) => {

    const users = await User.findAll();
    await res.json({ users });
});

// Finds a user
app.get("/user", checkBody, async(req, res) => {
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
app.get("/me", checkBody, cors(), verifyAuth , async (req, res) => {

    const data = req._user;
    const userData = await User.findByPk(data['id']);
    await res.json({
        id: userData['id'],
        email: userData['email'],
    });
});

const relativeRoute = path.resolve(__dirname + "../../../dist");
app.use(express.static(relativeRoute));

app.get("*", (req, res) => {
    res.sendFile(relativeRoute + "/index.html");
});

app.listen(port, async ()=> {
    await console.log("Iniciado en el puerto:", port);
});