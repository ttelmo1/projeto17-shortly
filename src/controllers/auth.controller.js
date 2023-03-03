import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "../database/db.js";

export async function signin(req, res) {
    const { email, password } = req.body;

    try{
        const { rows } = await db.query(
            `
            SELECT * FROM users WHERE email = $1`,
            [email]
        );

        const user = rows[0];

        if(!user){
            return res.status(401).send("Invalid credentials");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if(!isPasswordValid){
            return res.status(401).send("Invalid credentials");
        }

        const token = uuidv4();

        await db.query(
            `
            INSERT INTO sessions (token, "userId") VALUES ($1, $2)`,
            [token, user.id]
        );

        res.send({token});
        
    }
    catch(err){
        res.status(500).send(err.message);
    }   
}