const fs = require("fs");
const path = require("path");
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = {
    init: (app, db) => {
        app.post("/v2/CreateOrUpdate", db.requireAuth2, async (req, res) => {
            const apikey = req.query.apiKey;
            if (apiKey != db.getSiteConfig().PRIVATE.PRIVATE_API_KEY) {
                if (req.user){
                    res.status(404).render("404", await db.getRenderObject(req.user));
                }else{
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const GameSessions = req.body.GameSessions;
            const placeId = parseInt(req.query.placeId);
            const gameID = req.query.gameID;
            const port = parseInt(req.query.port);
            
            const game = await db.getGame(placeId);
            if (game == null) {
                res.status(400).send()
                return;
            }
            if (game.lastHeartBeat != 0){
                await db.setGameProperty(placeId, "port", port);
            }
            res.send();
        });

        app.post("/v1/Close", db.requireAuth2, async (req, res) => {
            const id0 = req.query.apiKey.split("|");
            const apikey = (id0.length > 0 ? id0[0] : "");
            if (apiKey != db.getSiteConfig().PRIVATE.PRIVATE_API_KEY) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const placeId = parseInt(req.query.placeId) || (id0.length > 1 ? parseInt(id0[1]) : null);
            const gameID = req.query.gameID || (id0.length > 2 ? id0[2] : "");

            const game = await db.getGame(placeId);
            if (game == null) {
                res.status(400).send()
                return;
            }
            await db.setGameProperty(placeId, "port", 0);
            const script = `
`
            const signature = db.sign(script);
            res.send(`--rbxsig%${signature}%` + script);
        });
    }
}