import { updateProfile, getProfile } from "../controller/user-controller";
import { sequelize } from "../models/database";
import * as express from "express";
import * as cors from "cors";
import * as path from "path";

const app = express();
const port = process.env.PORT || 3000;
const relativeRoute = path.resolve(__dirname,"../../fe-src");

app.use(express.json({ limit: "50mb" }));
app.use(express.static(relativeRoute));
app.use(cors());

app.get("/profile", async (req, res) => {

    const profileData = await getProfile(4);
    res.json(profileData);
})

app.post("/profile", async (req, res) => {

    if (!req.body) {
        res.status(400).json({

            "message": "me faltan datos en el body",
        });
    }
    console.log(req.body);
    const updatedData = await updateProfile(1, req.body);
    res.json(updatedData);
})

app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"../../fe-src"));
});  
        
app.listen(port, async ()=> {
    await console.log("Iniciado en el puerto:", port);
});
