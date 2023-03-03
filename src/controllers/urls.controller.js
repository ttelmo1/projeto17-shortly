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

        const shortUrl = {
            id: url.id,
            shortURL: url.shortURL,
            url: url.url,
        };

        res.send(shortUrl);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}


export async function openShortUrl(req, res){
    const { shortURL } = req.params;

    try{
        const { rows } = await db.query(
            `
            SELECT * FROM short WHERE "shortURL" = $1`,
            [shortURL]
        );

        if(rows.length === 0){
            return res.status(404).send("Short URL not found");
        }
    
        const [ url ] = rows;

        await db.query(`
            UPDATE short SET views = views + 1 WHERE id = $1`,
            [url.id]
        );


        res.redirect(url.url);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}

export async function deleteShortUrl(req, res){
    const { id } = req.params;
    const { user } = res.locals.user;

    try{
        const result = await db.query(
            `
            SELECT * FROM short WHERE id = $1`,
            [id]
        );

        if(result.rowCount === 0){
            return res.status(404).send("Short URL not found");
        }

        const [ url ] = result.rows;

        if(url.userId !== user.id){
            return res.status(401).send("Unauthorized");
        }

        await db.query(
            `
            DELETE FROM short WHERE id = $1`,
            [id]
        );

        res.sendStatus(204);

    }
    catch(err){
        res.status(500).send(err.message);
    }
}


