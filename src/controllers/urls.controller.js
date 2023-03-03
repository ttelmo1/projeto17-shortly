import { nanoid } from "nanoid";
import { db } from "../database/db.js";

export async function shortenUrl(req, res){
    const { id } = res.locals.user;
    const { url } = req.body;

    const shortURL = nanoid(8);

    try{
        await db.query(
            `
            INSERT INTO short (url, "shortURL", "userId") VALUES ($1, $2, $3)`,
            [url, shortURL, id]
        );

        res.status(201).send({shortURL});
    }
    catch(err){
        res.status(500).send(err.message);
    }
}