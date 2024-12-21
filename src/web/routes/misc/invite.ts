import type { Client } from "../../../structures/DiscordClient";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";

export default function (client: Client) {
    const router = express.Router()

    router.get('/invite', (req: Request, res: Response, next: NextFunction) => {
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${client.user?.id}`)
    })

    return router;
}