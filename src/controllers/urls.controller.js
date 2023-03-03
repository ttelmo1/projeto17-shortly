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

export async function getShortUrlById(req, res){
    const { id } = req.params;

    try{
        const { rows } = await db.query(
            `
            SELECT * FROM short WHERE id = $1`,
            [id]
        );

        if(rows.length === 0){
            return res.status(404).send("Short URL not found");
        }

        const [ url ] = rows;

        res.send(url);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}
