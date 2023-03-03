import { db } from '../database/db.js';
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
    const { name, email, password } = req.body;

    try{
        const userExists = await db.query(
            `
            SELECT * FROM users WHERE email = $1`, 
            [email]
        );

        if(userExists.rowCount > 0){
            return res.status(409).send("User already exists");
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        await db.query(
            `
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, passwordHash]
        );

        res.sendStatus(201);

    } catch(err){
        res.status(500).send(err.message);
    }

}

export async function getUserById(req, res) {
    const { user } = res.locals;
    try{
        const visit = await db.query(
            `
            SELECT SUM("visitCount")
            FROM short s
            WHERE s."userId" = $1`,
            [user.id]
        );

        const [ visitCount ] = visit.rows;

        const  urlResult = await db.query(
            `
            SELECT * FROM short s
            WHERE s."userId" = $1`,
            [user.id]
        );

        res.send({
            id: user.id,
            name: user.name,
            visitCount: visitCount.sum || 0,
            shortenedUrls: urlResult.rows
        })


    } catch(err){
        res.status(500).send(err.message);
    }
}

export async function ranking(req, res) {
    try{
        const { rows } = await db.query(`
            SELECT 
                u.id,
                u.name,
                COUNT (s.id) AS "linksCount",
                COALESCE(SUM(s."visitCount"), 0) AS "visitCount"
            FROM users u
            LEFT JOIN short s ON s."userId" = u.id
            GROUP BY u.id
            ORDER BY "visitCount" DESC
            LIMIT 10
        `);

        res.send(rows);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}