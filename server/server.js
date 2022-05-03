import express from "express";
import * as path from "path";
import {MoviesApi} from "./MoviesApi.js";
import {MongoClient} from "mongodb";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.post("/api/login", (req, res) => {
    const { access_token } = req.body;
    res.cookie("access_token", access_token, {signed: true});
    res.sendStatus(200);
});

const mongoClient = new MongoClient(process.env.MONGODB_URL);
mongoClient.connect().then(async () => {
    console.log("Connected to mongoDB");
    app.use("/api/movies", MoviesApi(mongoClient.db(process.env.MONGODB_DATABASE || "exam-practice")));
    //const databases = await mongoClient.db().admin().listDatabases();
    //console.log(databases);
});

app.use(express.static("../client/dist/"));

app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")){
        res.sendFile(path.resolve("../client/dist/index.html"));
    } else {
        next();
    }
});

const server = app.listen(process.env.PORT || 3000,() => {
    console.log(`Started on http://localhost:${server.address().port}`);
});

