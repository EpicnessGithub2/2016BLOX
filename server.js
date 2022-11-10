const fs = require("fs");
const path = require("path");
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
const querystring = require('querystring');
const template = require("./template");
const express = require("express");
const db = require("./db");
const get_ip = require('ipware')().get_ip;
const crypto = require('crypto');
const AdmZip = require('adm-zip');

// db.createGame("Testing Place", "A testing game.", 1, "https://static.roblox.com/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png", "https://static.roblox.com/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png");
// db.createCatalogItem("Test Item", "DEBUG TESTING ITEM", 0, "https://static.roblox.com/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png", 41, 1);
// db.createGamepass(1, 3, "Test Gamepass", "A testing gamepass.", 0, "https://static.roblox.com/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png");

if (!fs.existsSync("./logs/admin.log")) {
    fs.writeFileSync("./logs/admin.log", "");
}

template.app.use(async (req, res, next) => {
    let newPath = req.path;
    if (newPath.startsWith("//")) {
        while (newPath.startsWith("//")) {
            newPath = newPath.substring(1);
        }
        return res.redirect(307, newPath);
    }
    next();
});

// Site shutdown handler :o
template.app.use(db.requireAuth2, async (req, res, next) => {
    const ip = get_ip(req).clientIp;
    const config = await db.getConfig();
    if (req.path == "/shut/realtime") {
        return res.json({
            ready: config.shutdownTimestamp && config.shutdownTimestamp - db.getUnixTimestamp() < 280
        });
    }
    if (config.shutdownTimestamp && config.shutdownTimestamp - db.getUnixTimestamp() < 280 && !req.path.startsWith("/shut/")) {
        if (config.shutdownTimestamp - db.getUnixTimestamp() < 0) {
            if (req.path == "/shutdown") {
                return res.status(503).render("shutdown_info", {
                    timestamp: config.shutdownTimestamp,
                    reason: config.shutdownReason || "because it couldn't be kept up and there was too much work to do. I'm sorry. - Malte0621"
                });
            }
        }
        if (req.path != "/") {
            res.redirect("/");
            return;
        }
        res.status(503).render("shutdown", {
            timestamp: config.shutdownTimestamp
        });
    } else {
        if (config.shutdownTimestamp && (config.shutdownTimestamp - db.getUnixTimestamp() > 280 || config.shutdownTimestamp - db.getUnixTimestamp() < 0) && req.path.startsWith("/shut/") && !req.path == "/shut/ready.mp3") {
            return res.status(404).render("404", await db.getBlankRenderObject());
        }
        next();
    }
});

template.app.use(db.requireAuth2, async (req, res, next) => {
    const ip = get_ip(req).clientIp;
    if ((req.user && req.user.isAdmin) || db.getMaintenanceModeWhitelistedIps().includes(ip)) {
        next();
        return;
    }
    if (db.getSiteConfig().backend.canBypassMaintenanceScreen == true && req.url == "/Login/FulfillConstraint.aspx?" && req.method == "POST") {
        next();
        return;
    }
    const config = await db.getConfig();
    if (config.maintenance && !db.getSiteConfig().backend.allowedMaintenanceResources.includes(req.url)) {
        if (req.url != "/Login/FulfillConstraint.aspx") {
            res.redirect("/Login/FulfillConstraint.aspx");
            return;
        }
        if (config.maintenance_finishtime == 0) {
            res.status(503).render("maintenance", {
                finishTime: ""
            });
        } else {
            res.status(503).render("maintenance", {
                finishTime: db.unixToDate(config.maintenance_finishtime).toUTCString()
            });
        }
    } else {
        next();
    }
});

template.app.get("/Login/FulfillConstraint.aspx", (req, res) => {
    res.redirect("/");
});

template.app.get("/internal/:apiKey/RCCService.wsdl", db.requireAuth2, async (req, res) => {
    const apiKey = req.params.apiKey;
    if (apiKey == db.getSiteConfig().PRIVATE.PRIVATE_API_KEY) {
        res.sendFile(__dirname + "/internal/RCCService.wsdl");
    } else {
        if (req.user) {
            res.status(404).render("404", await db.getRenderObject(req.user));
        } else {
            res.status(404).render("404", await db.getBlankRenderObject());
        }
    }
});

template.app.use("/", express.static(__dirname + "/public"));
template.app.use("/", express.static(__dirname + "/public/css"));
template.app.use("/", express.static(__dirname + "/public/img"));
template.app.use("/", express.static(__dirname + "/public/js"));
template.app.use("/", express.static(__dirname + "/public/setup"));

const whitelistedUrls = ["/moderation/filtertext/", "/v1/authentication-ticket/"]
template.app.use((req, res, next) => {
    if (req.path.substr(-1) === '/' && req.path.length > 1 && !whitelistedUrls.includes(req.path)) {
        const query = req.url.slice(req.path.length)
        const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
        res.redirect(301, safepath + query)
    } else {
        next()
    }
});

template.app.use(async (req, res, next) => {
    if (db.getSiteConfig().shared.pages.disabledRoutes.includes(req.url)) {
        return;
    }
    if (db.getSiteConfig().shared.CLIENT_DOWNLOAD_AVAIlABLE == false && (req.url.startsWith("/version-") || req.url.startsWith("/Roblox.apk") || req.url.startsWith("/RobloxPlayerLauncher.exe") || req.url.startsWith("/RobloxStudioLauncherBeta.exe") || req.url.startsWith("/mac") || req.url.startsWith("/Roblox.dmb"))) {
        res.status(403).send("Forbidden");
        return;
    }
    next();
});

template.app.use(db.requireAuth2, async (req, res, next) => {
    if (!req.user) {
        next();
        return;
    }
    if (req.user.inviteKey != "", !req.user.banned && db.getSiteConfig().backend.presenceEnabled == true) {
        await db.setUserProperty(req.user.userid, "lastOnline", db.getUnixTimestamp());
        if (db.getSiteConfig().backend.tix.enabled == true && db.getUnixTimestamp() - req.user.lastTix >= db.getSiteConfig().backend.tix.tixEverySeconds) {
            await db.setUserProperty(req.user.userid, "lastTix", db.getUnixTimestamp());
            await db.setUserProperty(req.user.userid, "tix", req.user.tix + 10);
        }
        if (req.method == "GET" && (!req.url.startsWith("/v1/") && req.url.startsWith("/v1.1/") && !req.url.startsWith("/v2/") && req.url.startsWith("/v3/") && req.url.startsWith("/api/"))) {
            await db.generateUserCsrfToken(req.user.userid);
        }
    }
    next();
});

const subdomain = require('express-subdomain');

const merged = ["assetgame", "admin"];

const files = fs.readdirSync(__dirname + "/controllers/");
for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.endsWith(".js")) {
        const name = file.replace(".js", "");
        if (db.getSiteConfig().backend.disabledApis.includes(name)) {
            continue;
        }
        const router = express.Router();
        const controller = require("./controllers/" + file);
        controller.init(router, db);
        if (name == "MAIN") {
            try {
                template.app.use(router);
            } catch (e) { // Don't let errors crash the server
                console.error(e);
            }
            continue;
        }
        if (!merged.includes(name)) {
            if (router.stack.filter(layer => layer.route && layer.route.path === "/").length == 0) {
                router.get("/", (req, res) => {
                    res.json({
                        "message": "OK"
                    });
                });
            }
            router.get("*", (req, res) => {
                res.status(404).json({
                    "errors": [{
                        "code": 0,
                        "message": "Something went wrong with the request, see response status code."
                    }]
                });
            });
        }
        try {
            template.app.use(subdomain(name, router));
        } catch (e) { // Don't let errors crash the server
            console.error(e);
        }
        if (merged.includes(name)) {
            try {
                template.app.use(router);
            } catch (e) { // Don't let errors crash the server
                console.error(e);
            }
        }
    }
}

template.app.get("*", db.requireAuth2, async (req, res) => {
    console.warn("404 - " + req.method + ": " + req.get("HOST") + req.url)
    if (req.user) {
        res.status(404).render("404", await db.getRenderObject(req.user));
    } else {
        res.status(404).render("404", await db.getBlankRenderObject());
    }
});

template.app.post("*", db.requireAuth2, async (req, res) => {
    console.warn("404 - " + req.method + ": " + req.get("HOST") + req.url)
    if (req.user) {
        res.status(404).render("404", await db.getRenderObject(req.user));
    } else {
        res.status(404).render("404", await db.getBlankRenderObject());
    }
});

template.app.patch("*", db.requireAuth2, async (req, res) => {
    console.warn("404 - " + req.method + ": " + req.get("HOST") + req.url)
    if (req.user) {
        res.status(404).render("404", await db.getRenderObject(req.user));
    } else {
        res.status(404).render("404", await db.getBlankRenderObject());
    }
});

template.app.delete("*", db.requireAuth2, async (req, res) => {
    console.warn("404 - " + req.method + ": " + req.get("HOST") + req.url)
    if (req.user) {
        res.status(404).render("404", await db.getRenderObject(req.user));
    } else {
        res.status(404).render("404", await db.getBlankRenderObject());
    }
});

template.start("0.0.0.0", db.getSiteConfig().shared.httpPort, db.getSiteConfig().shared.httpsEnabled, db.getSiteConfig().shared.httpsPort);