import jwt from "jsonwebtoken";
import "dotenv/config";

let secretKey = process.env.SECRET_KEY;

function verifyToken(req, res, next) {
    if (req.headers.authorization !== undefined) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secretKey, (err, data) => {
            if (!err) {
                next()
            } else {
                res.status(403).send({message: "Invalid token!"})
            }
        })

    } else {
        res.send({message: "Please send a token"})
    }
}

export {verifyToken}