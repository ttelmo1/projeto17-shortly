import { nanoid } from "nanoid";
import { db } from "../database/db.js";

export async function shortenUrl(req, res){
    const { id } = res.locals.user;
    const { url } = req.body;

    const shortUrl = nanoid(8);

    try{
        await db.query(
            `
            INSERT INTO short (url, "shortUrl", "userId") VALUES ($1, $2, $3)`,
            [url, shortUrl, id]
        );

        res.status(201).send({id, shortUrl});
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
            shortUrl: url.shortUrl,
            url: url.url,
        };

        res.send(shortUrl);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}


export async function openShortUrl(req, res){
    const { shortUrl } = req.params;

    try{
        const { rows } = await db.query(
            `
            SELECT * FROM short WHERE "shortUrl" = $1`,
            [shortUrl]
        );

        if(rows.length === 0){
            return res.status(404).send("Short URL not found");
        }
    
        const [ url ] = rows;

        await db.query(`
            UPDATE short SET "visitCount" = "visitCount" + 1 WHERE id = $1`,
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
    const { user } = res.locals;

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


