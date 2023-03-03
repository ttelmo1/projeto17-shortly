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