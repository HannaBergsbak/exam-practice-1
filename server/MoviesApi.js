import {Router} from "express";

export function MoviesApi(mongoDatabase){

    const router = new Router();
    router.get("/", async (req, res) => {
        const movies = await mongoDatabase
            .collection("movies")
            .find({})
            .map(({title, plot, year}) => ({
                title,
                plot,
                year
            }))
            .toArray();
        res.json( movies );
    });

    router.post("/new", async (req, res) => {
        const { title, year, plot } = req.body;
        await mongoDatabase
            .collection("movies")
            .insertOne({ title, year, plot });
        res.sendStatus(204);
    });
    return router;
}