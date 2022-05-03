import {Router} from "express";

export function MoviesApi(mongoDatabase){

    const router = new Router();
    router.get("/", async (req, res) => {
        const movies = await mongoDatabase.collection("movies").find().toArray();
        res.json( movies );
    });

    router.post("/new", (req, res) => {
        const title = req.body;
        mongoDatabase.collection("movies").insertOne({
            title
        });
        res.sendStatus(500);
    });

    return router;
}