import { db } from "../database/db.js";

export async function  authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if(!token){
        return res.status(401).send("Unauthorized");
    }

    try{
        const { rows } = await db.query(
            `
            SELECT * FROM sessions WHERE token = $1`,
            [token]
        );

        const session = rows[0];
        
        if(!session){
            return res.status(401).send("Unauthorized");
        }

        const { rows: userRows } = await db.query(
            `
            SELECT * FROM users WHERE id = $1`,
            [session.userId]
        );

        const user = userRows[0];

        if(!user){
            return res.status(401).send("Unauthorized");
        }

        res.locals.user = user;

        next();
    }
    catch(err){
        res.status(500).send(err.message);
    }
}