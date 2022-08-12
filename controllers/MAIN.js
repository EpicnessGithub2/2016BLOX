const fs = require("fs");
const path = require("path");
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
const querystring = require('querystring');
const get_ip = require('ipware')().get_ip;
const mm = require('music-metadata');
let exec = require('child_process').exec;
const bcrypt = require("bcryptjs");

module.exports = {
    init: (app, db) => {
        app.get("/", db.requireNonAuth, async (req, res) => {
            let years = ``;
            const year = new Date().getFullYear();
            for (let i = year; i >= year - 99; i--) {
                years += `<option value="${i}">${i}</option>
                `;
            }
            res.render("index", {
                ...await db.getBlankRenderObject(),
                years: years,
                signupEnabled: await db.getSiteConfig().shared.allowSignup,
            });
        });

        app.get("/currency/balance", db.requireAuth2, async (req, res) => {
            let user = req.user;
            if (!user) {
                let sessionid = req.get("roblox-session-id");
                if (sessionid) {
                    sessionid = sessionid.split("|")
                    if (sessionid.length >= 3) {
                        const cookie = sessionid[sessionid.length - 3].replaceAll("Â§", "|");
                        user = await db.findUserByCookie(cookie);
                    }
                }
            }
            if (!user) {
                res.json({
                    "robux": 0,
                    "tix": 0
                });
                return;
            }
            res.json({
                "robux": user.robux,
                "tix": user.tix
            });
        });

        app.get("/ide/welcome", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                res.redirect("/My/Places.aspx&showlogin=True");
                return;
            }
            res.render("idewelcome", await db.getRenderObject(req.user));
        });

        app.get("/account/signupredir", (req, res) => {
            res.redirect("/");
        })

        app.get("/info/roblox-badges", db.requireAuth, async (req, res) => {
            res.render("robloxbadges", await db.getRenderObject(req.user))
        });

        app.get("/users/friends", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(400).render("404", await db.getRenderObject(req.user));
                return;
            }
            res.render("friends", {
                ...await db.getRenderObject(req.user),
                auserid: req.user.userid,
            });
        });

        app.get("/users/:userid/friends", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(400).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userId = parseInt(req.params.userid);
            const user = await db.getUser(userId);
            if (!user) {
                res.status(404).render("404", await dbgetRenderObject(req.user));
                return;
            }
            res.render("friends", {
                ...await db.getRenderObject(req.user),
                auserid: user.userid,
            });
        });

        app.get("/search/users", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canSearchUsers == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            res.render("searchusers", await db.getRenderObject(req.user));
        });

        app.get("/search/users/metadata", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canSearchUsers == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            const keyword = req.query.keyword;
            res.json({
                "Keyword": keyword,
                "MaxRows": 12,
                "IsPhone": false,
                "IsTablet": false,
                "IsGuest": false,
                "FriendshipStatusValues": ["NoFriendship", "PendingOnOtherUser", "PendingOnCurrentUser", "Friends"],
                "CurrentUserId": req.user.userid,
                "InApp": false,
                "InAndroidApp": false,
                "IniOSApp": false,
                "KeywordMinLength": 3,
                "IsChatDisabledByPrivacySetting": false
            });
        });

        app.get("/my/messages", db.requireAuth, async (req, res) => {
            res.render("messages", await db.getRenderObject(req.user));
        });

        app.get("/authentication/is-logged-in", (req, res) => {
            res.send();
        })

        app.get("/crossdevicelogin/ConfirmCode", db.requireAuth, async (req, res) => {
            res.render("quicklogin", await db.getRenderObject(req.user));
        });

        app.get("/my/groups", db.requireAuth, async (req, res) => {
            res.render("groups", await db.getRenderObject(req.user));
        });

        app.get("/groups/create", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.groups.canCreateGroups == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            res.render("creategroup", await db.getRenderObject(req.user));
        });

        app.get("/search/groups", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.groups.groupsEnabled == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            res.render("groups", await db.getRenderObject(req.user));
        });

        app.get("/upgrades/robux", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.pages.robuxPurchasesVisible == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            res.render("robux", await db.getRenderObject(req.user));
        });

        app.get("/Upgrades/Robux.aspx", (req, res) => {
            res.redirect("/upgrades/robux");
        });

        app.get("/transactions", db.requireAuth, async (req, res) => {
            res.render("transactions", await db.getRenderObject(req.user));
        });

        app.get("/gamecards/redeem", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.giftcardsEnabled == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            res.render("redeem", await db.getRenderObject(req.user));
        });

        app.get("/giftcards-us", async (req, res) => {
            res.redirect("/giftcards?location=us")
        });

        app.get("/giftcards", async (req, res) => {
            if (db.getSiteConfig().shared.giftcardsEnabled == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            res.render("giftcards", await db.getBlankRenderObject());
        });

        app.get("/trades", db.requireAuth, async (req, res) => {
            res.render("trades", await db.getRenderObject(req.user));
        });

        app.get("/premium/membership", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.pages.premiumPurchasesVisible == false) {
                res.status(400).render("404", await db.getBlankRenderObject());
                return;
            }
            res.render("premium", await db.getRenderObject(req.user));
        });

        app.post("/games/shutdown-all-instances", db.requireAuth, async (req, res) => {
            const placeId = parseInt(req.body.placeId);
            const replaceInstances = req.body.replaceInstances;
            const game = await db.getGame(placeId);
            if (!game) {
                res.status(400).render("400", await db.getRenderObject(req.user));
                return;
            }
            if (req.user.userid != game.creatorid) {
                res.status(403).render("403", await db.getRenderObject(req.user));
                return;
            }
            const games = await db.getJobsByGameId(placeId);
            for (let i = 0; i < games.length; i++) {
                const job = await db.getJob(games[i]);
                await job.stop();
            }
        });

        app.get("/search/users/results", async (req, res) => {
            const presenceEnabled = db.getSiteConfig().backend.presenceEnabled;
            const keyword = req.query.keyword;
            const maxRows = parseInt(req.query.maxRows);
            const startIndex = parseInt(req.query.startIndex);

            const users = await db.findUsers(keyword);
            let results = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.bannned)
                    continue;
                results.push({
                    "UserId": user.userid,
                    "Name": user.username,
                    "DisplayName": user.username,
                    "Blurb": user.description,
                    "PreviousUserNamesCsv": "",
                    "IsOnline": presenceEnabled ? (user.lastOnline || 0) > (db.getUnixTimestamp() - 60) : null,
                    "LastLocation": null,
                    "UserProfilePageUrl": "/users/" + user.userid.toString() + "/profile",
                    "LastSeenDate": presenceEnabled ? db.unixToDate((user.lastOnline || 0)).toISOString() : null,
                    "PrimaryGroup": null,
                    "PrimaryGroupUrl": null
                });
            }

            res.json({
                "Keyword": keyword,
                "StartIndex": startIndex,
                "MaxRows": maxRows,
                "TotalResults": results.length,
                "UserSearchResults": results.splice(startIndex, maxRows)
            });
        });

        app.get("/users/profile/robloxcollections-json", (req, res) => {
            res.json({
                "CollectionsItems": [
                    /*
                                    {
                                        "Id": 1,
                                        "AssetSeoUrl": "https://www.rbx2016.tk/catalog/1/",
                                        "Thumbnail": {
                                            "Final": true,
                                            "Url": "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png",
                                            "RetryUrl": null,
                                            "UserId": 0,
                                            "EndpointType": "Avatar"
                                        },
                                        "Name": "BASEPLATE",
                                        "FormatName": null,
                                        "Description": "The one and only. Available for a limited time only.",
                                        "AssetRestrictionIcon": {
                                            "TooltipText": null,
                                            "CssTag": null,
                                            "LoadAssetRestrictionIconCss": false,
                                            "HasTooltip": false
                                        },
                                        "HasPremiumBenefit": false
                                    }
                                */
                ]
            });
        });

        app.post("/api/friends/sendfriendrequest", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userid = parseInt(req.body.targetUserID);
            if (req.user.userid == userid) {
                res.status(400).json({
                    "success": false,
                    "error": "You can't friend yourself"
                });
                return;
            }
            const added = await db.addFriends(req.user.userid, userid);
            if (added) {
                res.json({
                    "success": true
                });
            } else {
                res.status(500).json({
                    "success": false,
                    "error": "Something went wrong"
                });
            }
        });

        app.post("/api/friends/declinefriendrequest", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userid = parseInt(req.body.targetUserID);
            const denied = await db.denyFriend(userid, req.user.userid);
            if (denied) {
                res.json({
                    "success": true,
                    "message": null
                });
            } else {
                res.status(500).json({
                    "success": false,
                    "message": "Something went wrong"
                });
            }
        });

        app.post("/api/friends/declineallfriendrequests", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const denied = await db.denyAllFriends(req.user.userid);
            if (denied) {
                res.json({
                    "success": true,
                    "message": null
                });
            } else {
                res.status(500).json({
                    "success": false,
                    "message": "Something went wrong"
                });
            }
        });

        app.post("/api/friends/acceptfriendrequest", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userid = parseInt(req.body.targetUserID);
            const denied = await db.addFriends(req.user.userid, userid);
            if (denied) {
                res.json({
                    "success": true,
                    "message": null
                });
            } else {
                res.status(500).json({
                    "success": false,
                    "message": "Something went wrong"
                });
            }
        });

        app.post("/api/friends/removefriend", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userid = parseInt(req.body.targetUserID);
            if (req.user.userid == userid) {
                res.status(400).json({
                    "success": false,
                    "error": "You can't unfriend yourself"
                });
                return;
            }
            const unfriended = await db.unfriend(req.user.userid, userid);
            if (unfriended) {
                res.json({
                    "success": true
                });
            } else {
                res.status(500).json({
                    "success": false,
                    "error": "Something went wrong"
                });
            }
        });

        async function getGamesT3(userid) {
            let out = ``;
            const games = await db.getGamesByCreatorId(userid);
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                if (!game.showOnProfile) continue;
                const gamename2 = db.filterText2(game.gamename).replaceAll(" ", "-");
                const created = db.unixToDate(game.created);
                const updated = db.unixToDate(game.updated);
                const creator = await db.getUser(game.creatorid);
                out += `<li class="list-item game-card">
                <div class="game-card-container">
                    <a href="https://www.rbx2016.tk/games/${game.gameid}"
                        class="game-card-link">
                        <div class="game-card-thumb-container">
                            <img class="game-card-thumb"
                                src="https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png"
                                thumbnail="{&quot;Final&quot;:true,&quot;Url&quot;:&quot;https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png&quot;,&quot;RetryUrl&quot;:null}"
                                image-retry />
                        </div>
                        <div class="text-overflow game-card-name"
                            title="${game.gamename}" ng-non-bindable>
                            ${game.gamename}
                        </div>
                        <div class="game-card-name-secondary">
                            ${game.playing} Playing
                        </div>
                        <div class="game-card-vote">
                            <div class="vote-bar">
                                <div class="vote-thumbs-up">
                                    <span class="icon-thumbs-up"></span>
                                </div>
                                <div class="vote-container" data-upvotes="${game.likes.length}"
                                    data-downvotes="${game.dislikes.length}"
                                    data-voting-processed="false">
                                    <div class="vote-background "></div>
                                    <div class="vote-percentage"></div>
                                    <div class="vote-mask">
                                        <div class="segment seg-1"></div>
                                        <div class="segment seg-2"></div>
                                        <div class="segment seg-3"></div>
                                        <div class="segment seg-4"></div>
                                    </div>
                                </div>
                                <div class="vote-thumbs-down">
                                    <span class="icon-thumbs-down"></span>
                                </div>
                            </div>
                            <div class="vote-counts">
                                <div class="vote-down-count">${game.dislikes.length}</div>
                                <div class="vote-up-count">${game.likes.length}</div>
                            </div>
                        </div>
                    </a>
                    <span class="game-card-footer">
                        <span class="text-label xsmall">By </span>
                        <a class="text-link xsmall text-overflow"
                            href="https://www.rbx2016.tk/users/${creator.userid}/profile">${creator.username}</a>
                    </span>
                </div>
            </li>`;
            }
            return out;
        }

        async function getGamesT4(userid) {
            let out = ``;
            const games = await db.getGamesByCreatorId(userid);
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                if (!game.showOnProfile) continue;
                const gamename2 = db.filterText2(game.gamename).replaceAll(" ", "-");
                const created = db.unixToDate(game.created);
                const updated = db.unixToDate(game.updated);
                const creator = await db.getUser(game.creatorid);
                const activeString = i == 0 ? "active" : "";
                out += `<li class="switcher-item slide-item-container ${activeString}"
                ng-class="{'active': switcher.games.currPage == ${i}}" data-index="0">
                <div class="col-sm-6 slide-item-container-left">
                    <div class="slide-item-emblem-container">
                        <a href="https://www.rbx2016.tk/games/${game.gameid}">
                            <img class="slide-item-image"
                                src="https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png"
                                data-src="https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png"
                                data-emblem-id="${game.gameid}"
                                thumbnail='{"Final":true,"Url":"https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png","RetryUrl":null}'
                                image-retry />

                        </a>
                    </div>
                </div>
                <div class="col-sm-6 slide-item-container-right games">
                    <div class="slide-item-info">
                        <h2 class="text-overflow slide-item-name games" ng-non-bindable>
                        ${game.gamename}</h2>
                        <p class="text-description para-overflow slide-item-description games"
                            ng-non-bindable>${game.description}</p>
                    </div>
                    <div class="slide-item-stats">
                        <ul class="hlist">
                            <li class="list-item">
                                <div class="text-label slide-item-stat-title">Playing
                                </div>
                                <div class="text-lead slide-item-members-count">0</div>
                            </li>
                            <li class="list-item">
                                <div class="text-label slide-item-stat-title">Visits
                                </div>
                                <div
                                    class="text-lead text-overflow slide-item-my-rank games">
                                    0</div>
                            </li>`;
            }
            return out;
        }

        app.post("/users/:userid/profile", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canViewUsers == false) {
                res.status(404).json({
                    "success": false
                });
                return;
            }
            const userid = parseInt(req.params.userid);
            if (req.user.userid != userid) {
                res.status(403).json({
                    "success": false
                });
                return;
            }
            if (!req.user || req.user.banned || req.user.inviteKey == "") {
                res.status(404).json({
                    "success": false
                });
                return;
            }

            const status = req.body.status;
            if (status.length > 254) {
                res.status(400).json({
                    "success": false
                })
                return;
            }

            await db.setUserProperty(req.user.userid, "statusdescription", status);

            res.json({
                "success": true
            })
        });

        app.post("/home/updatestatus", db.requireAuth, async (req, res) => {
            if (!req.user || req.user.banned || req.user.inviteKey == "") {
                res.status(404).json({
                    "success": false
                });
                return;
            }

            const status = req.body.status;
            if (status.length > 254) {
                res.status(400).json({
                    "success": false
                })
                return;
            }

            await db.setUserProperty(req.user.userid, "statusdescription", status);

            res.json({
                "success": true
            })
        });

        app.get("/users/:userid/profile", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canViewUsers == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userid = parseInt(req.params.userid);
            const user = await db.getUser(userid);
            if (!user || user.banned || user.inviteKey == "") {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const blocked = await db.areBlocked(req.user.userid, user.userid, true);

            const presenceType = (user.lastStudio || 0) > (db.getUnixTimestamp() - 30) ? 3 : (user.lastOnline || 0) > (db.getUnixTimestamp() - 60) ? ((user.lastOnline || 0) > (db.getUnixTimestamp() - 60) && user.playing != 0 && user.playing != null) ? 2 : 1 : 0;

            res.render("profile", {
                ...(await db.getRenderObject(req.user)),
                auserid: user.userid,
                ausername: user.username,
                auserdesc: user.description,
                aUserIsPremium: user.isPremium,

                auserfriends: (await db.getFriends(user.userid)).length,
                auserfollowing: 0, // TODO
                auserfollowers: 0, // TODO
                auserstatusdescription: user.statusdescription,
                auserdescription: user.description,
                arefriends: db.toString(await db.areFriends(req.user.userid, user.userid)),
                incommingfriendrequestpending: db.toString(await db.areFriendsPending(user.userid, req.user.userid)),
                maysendfriendinvation: db.toString(user.userid != req.user.userid && !blocked && !(await db.areFriends(req.user.userid, user.userid)) && !(await db.areFriendsPending(req.user.userid, user.userid))),
                friendrequestpending: db.toString(await db.areFriendsPending(req.user.userid, user.userid)),
                canfollow: db.toString(user.userid != req.user.userid && !blocked), // TODO
                canmessage: db.toString(user.userid != req.user.userid && !blocked), // TODO
                isfollowing: db.toString(false), // TODO
                canfollow: db.toString(false && !blocked), // TODO
                messagesdisabled: db.toString(false), // TODO
                canbefollowed: db.toString(false && !blocked), // TODO
                cantrade: db.toString(false && user.userid != req.user.userid && !blocked), // TODO
                blockvisible: db.toString(user.userid != req.user.userid), // TODO
                ismorevisible: db.toString(true), // TODO
                isviewblocked: db.toString(await db.areBlocked(req.user.userid, user.userid)), // TODO
                mayimpersonate: db.toString(user.userid == req.user.userid), // TODO
                mayupdatestatus: db.toString(user.userid == req.user.userid), // TODO

                placeVisits: user.placeVisits,

                playing: presenceType == 2,
                online: presenceType == 1,
                studio: presenceType == 3,
                icon: presenceType == 3 ? "studio" : presenceType == 2 ? "game" : presenceType == 1 ? "online" : "offline",
                icontitle: presenceType == 3 ? "In Studio" : presenceType == 2 ? "Playing" : presenceType == 1 ? "Online" : "Offline",

                games: await getGamesT3(user.userid),
                games2: await getGamesT4(user.userid),

                // Temporary
                gameid: 0,
                gamename: "",
                gamedesc: ""
            });
        });

        app.post("/userblock/blockuser", db.requireAuth2, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            let user = req.user;
            if (!user) {
                let sessionid = req.get("roblox-session-id");
                if (sessionid) {
                    sessionid = sessionid.split("|")
                    if (sessionid.length >= 3) {
                        const cookie = sessionid[sessionid.length - 3].replaceAll("Â§", "|");
                        user = await db.findUserByCookie(cookie);
                    }
                }
            }
            const blockeeId = parseInt(req.body.blockeeId);
            const blocked = await db.block(user.userid, blockeeId);
            if (blocked) {
                res.json({
                    "success": true,
                    "message": null
                });
            } else {
                res.status(500).json({
                    "success": false,
                    "message": "Something went wrong"
                });
            }
        });

        app.post("/userblock/unblockuser", db.requireAuth2, async (req, res) => {
            if (db.getSiteConfig().shared.users.canHaveFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            let user = req.user;
            if (!user) {
                let sessionid = req.get("roblox-session-id");
                if (sessionid) {
                    sessionid = sessionid.split("|")
                    if (sessionid.length >= 3) {
                        const cookie = sessionid[sessionid.length - 3].replaceAll("Â§", "|");
                        user = await db.findUserByCookie(cookie);
                    }
                }
            }
            const blockeeId = parseInt(req.body.blockeeId);
            const unblocked = await db.unblock(user.userid, blockeeId);
            if (unblocked) {
                res.json({
                    "success": true,
                    "message": null
                });
            } else {
                res.status(500).json({
                    "success": false,
                    "message": "Something went wrong"
                });
            }
        });

        app.get("/user-sponsorship/empty", async (req, res) => {
            res.send();
            return;
        });

        app.get("/user-sponsorship/1", async (req, res) => {
            if (db.getSiteConfig().shared.adsEnabled == false) {
                res.send();
                return;
            }
            res.render("userads/userad1", {
                ...(await db.getBlankRenderObject()),
                adimg: "https://images.rbx2016.tk/ab60e8d4d6a69816eec62a561416850f.jpg",
                adurl: "https://www.rbx2016.tk/premium/membership",
                adtitle: "Get Builders Club and Be Rich on ROBLOX"
            });
        });

        app.get("/user-sponsorship/2", async (req, res) => {
            if (db.getSiteConfig().shared.adsEnabled == false) {
                res.send();
                return;
            }
            res.render("userads/userad2", {
                ...(await db.getBlankRenderObject()),
                adimg: "https://images.rbx2016.tk/f6873fd4b192df10f0cb0f41f6a344e7.jpg",
                adurl: "https://www.rbx2016.tk/premium/membership",
                adtitle: "Get Builders Club and Be Rich on ROBLOX"
            });
        });
        app.get("/user-sponsorship/3", async (req, res) => {
            if (db.getSiteConfig().shared.adsEnabled == false) {
                res.send();
                return;
            }
            res.render("userads/userad3", {
                ...(await db.getBlankRenderObject()),
                adimg: "https://images.rbx2016.tk/3361ecd3b9294a517ddf1f304819baac.jpg",
                adurl: "https://www.rbx2016.tk/premium/membership",
                adtitle: "Get Builders Club and Be Rich on ROBLOX"
            });
        });

        app.get("/userads/empty", async (req, res) => {
            res.send();
            return;
        });

        app.get("/userads/1", async (req, res) => {
            if (db.getSiteConfig().shared.adsEnabled == false) {
                res.send();
                return;
            }
            res.render("userads/userad1", {
                ...(await db.getBlankRenderObject()),
                adimg: "https://images.rbx2016.tk/ab60e8d4d6a69816eec62a561416850f.jpg",
                adurl: "https://www.rbx2016.tk/premium/membership",
                adtitle: "Get Builders Club and Be Rich on ROBLOX"
            });
        });

        app.get("/userads/2", async (req, res) => {
            if (db.getSiteConfig().shared.adsEnabled == false) {
                res.send();
                return;
            }
            res.render("userads/userad2", {
                ...(await db.getBlankRenderObject()),
                adimg: "https://images.rbx2016.tk/f6873fd4b192df10f0cb0f41f6a344e7.jpg",
                adurl: "https://www.rbx2016.tk/premium/membership",
                adtitle: "Get Builders Club and Be Rich on ROBLOX"
            });
        });
        app.get("/userads/3", async (req, res) => {
            if (db.getSiteConfig().shared.adsEnabled == false) {
                res.send();
                return;
            }
            res.render("userads/userad3", {
                ...(await db.getBlankRenderObject()),
                adimg: "https://images.rbx2016.tk/3361ecd3b9294a517ddf1f304819baac.jpg",
                adurl: "https://www.rbx2016.tk/premium/membership",
                adtitle: "Get Builders Club and Be Rich on ROBLOX"
            });
        });

        app.get("/v1/settings/application", (req, res) => {
            const applicationName = req.cookies.applicationName;
            res.json({
                "applicationSettings": {}
            });
        });

        app.get("/download", async (req, res) => {
            if (db.getSiteConfig().shared.CLIENT_DOWNLOAD_AVAIlABLE == false) {
                res.status(403).send("Forbidden");
                return;
            }
            res.render("download", await db.getBlankRenderObject());
        });

        app.get("/download/client", (req, res) => {
            res.redirect("/RobloxPlayerLauncher.exe");
        });

        app.post("/Login/Negotiate.ashx", async (req, res) => {
            if (typeof req.query.suggest === "undefined") {
                return res.status(400).send();
            }
            const user = await db.findUserByToken(req.query.suggest);
            if (!user || user.banned || user.inviteKey == "") {
                return res.status(401).send();
            }
            res.cookie('.ROBLOSECURITY', "delete", {
                maxAge: -1,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });
            res.cookie('.ROBLOSECURITY', user.cookie, {
                maxAge: 50 * 365 * 24 * 60 * 60 * 1000,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });
            res.send();
        });

        app.get("/Login/Negotiate.ashx", async (req, res) => {
            if (typeof req.query.suggest === "undefined") {
                return res.status(400).send();
            }
            const user = await db.findUserByToken(req.query.suggest);
            if (!user || user.banned || user.inviteKey == "") {
                return res.status(401).send();
            }
            res.cookie('.ROBLOSECURITY', "delete", {
                maxAge: -1,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });
            res.cookie('.ROBLOSECURITY', user.cookie, {
                maxAge: 50 * 365 * 24 * 60 * 60 * 1000,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });
            res.send();
        });

        app.get("/v1/autolocalization/games/:gameid", (req, res) => {
            const gameid = parseInt(req.params.gameid);
            res.send();
        });

        app.get("/playfab-universes-service/v1/rcc/playfab-title", async (req, res) => {
            const universeId = parseInt(req.query.universeId);
            const game = await db.getGame(universeId);
            if (!game) {
                res.status(404).json({
                    "error": "Game not found"
                });
                return;
            }
            const creator = await db.getUser(game.creatorid);
            if (!creator || creator.banned || game.deleted || creator.inviteKey == "") {
                res.status(404).json({});
                return;
            }
            res.json({
                "JobSignature": "abc",
                "PlaceId": game.gameid,
                "GameId": game.gameid,
                "GameCode": game.gameid,
                "UniverseId": game.gameid,
                // "vipOwnerId": 1,
                "DatacenterId": 1,
                "PlaceFetchUrl": "http://www.rbx2016.tk/v1/asset?id=1",
                "assetdelivery": "http://www.rbx2016.tk/",
                "BaseUrl": "http://www.rbx2016.tk/",
                "MatchmakingContextId": 1,
                "MachineAddress": "127.0.0.1",
                "CreatorId": game.creatorid,
                "CreatorType": "User",
                "PlaceVersion": 1,
                "GsmInterval": 10000,
                "MaxPlayers": 12,
                "MaxGameInstances": 1,
                // "ApiKey": db.getSiteConfig().PRIVATE.PRIVATE_API_KEY,
                "PreferredPlayerCapacity": 12,
                "Metadata": {
                    "MachineAddress": "127.0.0.1",
                    "GsmInterval": 60,
                    "MaxPlayers": 12,
                    "placeInformation": {
                        "placeId": game.gameid,
                        "placeVersionNumber": 1,
                        "gameInstanceId": "aaaa"
                    }
                }
            });
            res.send();
        });

        app.get("/newlogin", db.requireNonAuth, async (req, res) => {
            res.render("login", {
                ...await db.getBlankRenderObject(),
                error: ""
            });
        });

        app.get("/My/Places.aspx", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                res.redirect("/My/Places.aspx&showlogin=True");
                return;
            }
            res.render("idewelcome", await db.getRenderObject(req.user));
        });

        app.get("/My/Places.aspx&showlogin=True", db.requireNonAuth, async (req, res) => {
            res.render("studiologin", {
                ...await db.getBlankRenderObject(),
                error: ""
            });
        });

        const badUsernames = db.getSiteConfig().backend.badUsernames;
        app.get("/UserCheck/checkifinvalidusernameforsignup", async (req, res) => {
            const username = req.query.username;
            if (await db.userExists(username)) {
                res.json({
                    "data": 1
                });
                return;
            }
            const isBadUsername = badUsernames.includes(username.toLowerCase());
            if (isBadUsername) {
                res.json({
                    "data": 2
                });
                return;
            }
            res.json({
                "data": 0
            });
        });

        app.post("/authentication/logout", db.requireAuth2, async (req, res) => {
            if (req.user) {
                if ((await db.getConfig()).maintenance && db.getSiteConfig().backend.disableLogoutOnMaintenance) {
                    res.status(503).send("Maintenance");
                    return;
                }
                res.cookie('.ROBLOSECURITY', "delete", {
                    maxAge: -1,
                    path: "/",
                    domain: "rbx2016.tk",
                    httpOnly: true
                });
                if (typeof req.headers["x-csrf-token"] !== "undefined") {
                    if (req.headers["x-csrf-token"].length == 128) {
                        const user = await db.getUserByCsrfToken(req.headers["x-csrf-token"]);
                        if (user) {
                            await db.setUserProperty(user.userid, "cookie", "");
                        }
                    }
                }
                res.redirect("/");
            }
        });

        function getAssetHTML(name, id) {
            return `<span ondragstart="dragRBX(${id})" style="margin-left: 5px; margin-top: 5px; color: #fff; text-decoration: none; text-align: center; border: 1px solid #000; background-color: #cccccc; width: 80px; height: 80px;">
            <a href="javascript:insertContent(${id})">${name}</a>
            </span>`
        }

        app.get("/IDE/ClientToolbox.aspx", async (req, res) => {
            const assets = "";
            res.render("ClientToolbox", {
                ...await db.getBlankRenderObject(),
                assets: assets
            });
        });

        app.get("/authentication/invitekey", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                res.status(400).render("400", await db.getBlankRenderObject());
                return;
            }
            if (req.user.inviteKey != "") {
                res.redirect("/games");
                return;
            }
            res.render("invitekey", await db.getBlankRenderObject());
        });

        app.get("/chat/data", (req, res) => {
            res.json({});
        });

        app.post("/login/resetpasswordbyusername", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                res.status(400).json({
                    "success": false,
                    "message": "You are not logged in"
                });
                return;
            }
            const username = req.body.username; // Invite key
            const valid = await db.activateInviteKey(req.user.userid, username);
            if (!valid) {
                return res.json({
                    "success": false,
                    "message": "Sorry, you have inserted a invalid invite key. Make sure you have typed it correctly and remember that keys are case sensitive!"
                });
            }
            res.json({
                "success": true,
                "message": ""
            });
        });

        app.post("/signup/v1", async (req, res) => {
            const isEligibleForHideAdsAbTest = req.body.isEligibleForHideAdsAbTest;
            if (db.getSiteConfig().shared.allowSignup == false) {
                res.status(401).render("401", await db.getBlankTemplateData());
                return;
            }
            const data = req.body;
            try {
                const birthday = new Date(data.birthday);
            } catch {
                res.status(400).send("Invalid birthday");
                return;
            }
            const birthday = new Date(Date.parse(data.birthday));
            const context = req.body.context; // RollerCoasterSignupForm
            const gender = db.getSiteConfig().shared.users.gendersEnabled ? parseInt(data.gender) : 1; // 1 = none, 2 = Boy, 3 = Girl
            if (gender < 1 || gender > 3) {
                res.status(400).send("Invalid gender");
                return;
            }
            const password = data.password;
            const referralData = data.referralData;
            const username = data.username;

            const isBadUsername = badUsernames.includes(username.toLowerCase());
            if (isBadUsername) {
                res.status(400).send("Bad username.");
                return;
            }
            if (await db.userExists(username)) {
                res.status(400).send("Username already taken.");
                return;
            }

            if (db.getSiteConfig().shared.users.canBeUnder13 == false && new Date() - birthday < 13 * 365 * 24 * 60 * 60 * 1000) {
                res.status(400).send("You must be 13 years or older to create an account.");
                return;
            }

            const ip = get_ip(req).clientIp;
            if (ip != "127.0.0.1" && ip != "::1" && await db.accountsByIP(ip).length >= db.getSiteConfig().backend.maxAccountsPerIP) {
                res.status(401).send("Too many accounts.");
                return;
            }
            if (typeof username != "string") {
                return res.status(400).send();
            }
            if (username.length > 50) {
                return res.status(400).send();
            }
            const ROBLOSECURITY_COOKIES = await db.createUser(username, password, birthday, gender, ip);
            res.cookie('.ROBLOSECURITY', "delete", {
                maxAge: -1,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });
            res.cookie('.ROBLOSECURITY', ROBLOSECURITY_COOKIES, {
                maxAge: 50 * 365 * 24 * 60 * 60 * 1000,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });
            res.send();
        });

        app.get("/reference/styleguide", async (req, res) => {
            res.render("styleguide", await db.getBlankRenderObject());
        });

        app.get("/Game/LoadPlaceInfo.ashx", async (req, res) => {
            const PlaceId = parseInt(req.query.PlaceId);
            const game = await db.getGame(PlaceId);
            if (!game) {
                res.status(404).send("Game not found");
                return;
            }
            const script = `-- Loaded by StartGameSharedScript --
            pcall(function() game:SetCreatorID(${game.creatorid}, Enum.CreatorType.User) end)
            
            pcall(function() game:GetService("SocialService"):SetFriendUrl("http://www.rbx2016.tk/Game/LuaWebService/HandleSocialRequest.ashx?method=IsFriendsWith&playerid=%d&userid=%d") end)
            pcall(function() game:GetService("SocialService"):SetBestFriendUrl("http://www.rbx2016.tk/Game/LuaWebService/HandleSocialRequest.ashx?method=IsBestFriendsWith&playerid=%d&userid=%d") end)
            pcall(function() game:GetService("SocialService"):SetGroupUrl("http://www.rbx2016.tk/Game/LuaWebService/HandleSocialRequest.ashx?method=IsInGroup&playerid=%d&groupid=%d") end)
            pcall(function() game:GetService("SocialService"):SetGroupRankUrl("http://www.rbx2016.tk/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=%d&groupid=%d") end)
            pcall(function() game:GetService("SocialService"):SetGroupRoleUrl("http://www.rbx2016.tk/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRole&playerid=%d&groupid=%d") end)
            pcall(function() game:GetService("GamePassService"):SetPlayerHasPassUrl("http://www.rbx2016.tk/Game/GamePass/GamePassHandler.ashx?Action=HasPass&UserID=%d&PassID=%d") end)
            `;
            const rbxsig = db.sign(script);
            res.send(`%${rbxsig}%${script}`);
        });

        app.get("/universes/get-info", (req, res) => {
            const placeId = parseInt(req.query.placeId);
            res.json({
                "Name": null,
                "Description": null,
                "RootPlace": null,
                "StudioAccessToApisAllowed": false,
                "CurrentUserHasEditPermissions": false,
                "UniverseAvatarType": "MorphToR6"
            })
        })

        app.get("/Game/LuaWebService/HandleSocialRequest.ashx", async (req, res) => {
            const method = req.query.method;
            if (method == "IsInGroup") {
                const groupid = parseInt(req.query.groupid);
                const playerid = parseInt(req.query.playerid);
                const user = await db.getUser(playerid);
                if (user && groupid == 1200769) {
                    res.send("<Value Type=\"boolean\">" + db.toString(user.isAdmin) + "</Value>");
                } else {
                    res.send("<Value Type=\"boolean\">false</Value>");
                }
            } else if (method == "GetGroupRank") {
                const groupid = parseInt(req.query.groupid);
                const playerid = parseInt(req.query.playerid);
                const user = await db.getUser(playerid);
                if (groupid == 1200769 && (user && user.isAdmin)) {
                    res.send("<Value Type=\"integer\">100</Value>");
                } else {
                    res.send("<Value Type=\"integer\">0</Value>");
                }
            } else if (method == "IsFriendsWith") {
                const playerid = parseInt(req.query.playerid);
                const userid = parseInt(req.query.userid);
                const user = await db.getUser(playerid);
                if (!user || playerid == userid) {
                    res.send("<Value Type=\"boolean\">false</Value>");
                    return;
                }
                res.send("<Value Type=\"boolean\">" + db.toString(await db.areFriends(playerid, userid)) + "</Value>");
            } else {
                res.send("<Value Type=\"boolean\">false</Value>");
            }
        });

        app.post("/newlogin", async (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            const submitLogin = req.body.submitLogin;
            let ReturnUrl = req.body.ReturnUrl;
            if (typeof ReturnUrl == "object") {
                ReturnUrl = ReturnUrl[0]
            }
            const isClient = req.get('User-Agent').toLowerCase().includes("roblox");
            if (typeof username == "undefined") {
                res.status(400).send();
                return;
            }
            const user = await db.loginUser(username, password, isClient);
            if (user == false) {
                res.render("login", {
                    ...await db.getBlankRenderObject(),
                    error: `<div class="validation-summary-errors" data-valmsg-summary="true">
                    <ul>
                        <li>Incorrect username or password.</li>
                    </ul>
                </div>`
                });
                return;
            }
            res.cookie('.ROBLOSECURITY', "delete", {
                maxAge: -1,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });
            res.cookie('.ROBLOSECURITY', user.cookie, {
                maxAge: 50 * 365 * 24 * 60 * 60 * 1000,
                path: "/",
                domain: "rbx2016.tk",
                httpOnly: true
            });

            if (isClient) {
                res.send("Logged In!");
                return;
            }

            if (ReturnUrl != "") {
                return res.redirect(ReturnUrl);
            } else {
                return res.redirect("/home");
            }
        });

        app.get("/places/version-history", db.requireAuth, async (req, res) => {
            const assetid = req.query.assetID;
            const page = req.query.page;
            res.render("versionhistory", await db.getBlankRenderObject());
        });

        app.post("/places/developerproducts/add", db.requireAuth, async (req, res) => {
            const universeId = parseInt(req.body.universeId);
            const name = req.body.name;
            const developerProductId = parseInt(req.body.developerProductId);
            const priceInRobux = parseInt(req.body.priceInRobux);
            const description = req.body.description;
            const imageAssetId = parseInt(req.body.imageAssetId);

            const game = await db.getGame(universeId);
            if (!game) {
                res.status(404).json({});
                return;
            }
            if (game.creatorid != req.user.userid) {
                res.status(401).json({});
                return;
            }
            if ((await db.getDevProductByGameAndName(game.gameid, name)) != null) {
                res.status(400).json({});
                return;
            }
            if (db.getSiteConfig().backend.devProducuts.enabled == false) {
                res.status(403).send("Developer products are disabled");
                return;
            }
            if (db.getSiteConfig().backend.devProducuts.isAdminOnly == false && !req.user.isAdmin) {
                res.status(403).send("Developer products are disabled");
                return;
            }
            if ((await db.getDevProducts(game.gameid)).length >= (req.user.isAdmin ? db.getSiteConfig().backend.devProducuts.maxPerPlace.admin : db.getSiteConfig().backend.devProducuts.maxPerPlace.user)) {
                res.status(401).send("Developer products limit reached");
                return;
            }
            const id = await db.createDevProduct(game.creatorid, game.gameid, name, description, priceInRobux);

            let developerProducts = "";
            const developerProducts0 = await db.getDevProducts(game.gameid);
            for (let i = 0; i < developerProducts0.length; i++) {
                const product = developerProducts0[i];
                developerProducts += `<tr>
                <td>${product.id}
                </td>
                <td class="itemName nameColumn">
                    <span>${product.name}</span>
                </td>
                <td>${product.price}
                </td>
                <td class="edit">
                    <a class="text-link edit" data-url="/places/edit-developerproduct?developerProductId=${product.id}&amp;universeId=${game.gameid}">
                        Edit</a>
                </td>
            </tr>`;
            }

            let html = `



            <div id="DevProducts" class="developerProductsContainer">
                <div id="DeveloperProductsLoading">
                    <img class="developerProductsLoadingImage" src='https://images.rbx2016.tk/ec4e85b0c4396cf753a06fade0a8d8af.gif' />
                </div>
                <div id="DeveloperProductsError" >
                    An error occurred while fetching the developer products.  Please try again later.
                </div>
                <div id="DeveloperProductsInnerContainer">
                        <div class="headline">
                            <h2>
                                Developer Products
                            </h2>
                            <span id="createButtonRow" class="createNewButtonSection">
                                <a  data-url="/places/create-developerproduct?universeId=2448305152" class="btn-small btn-neutral" id="createNewButton">Create new</a>
                            </span>
                        </div>
                        <div id="DeveloperProductStatus" class="status-confirm developerProductUpdateStatus" >Product ${id} successfully created</div>
                
                        <div id="DeveloperProductsList" class="developerProductsTableContainer">
                            <table id="DeveloperProductsTable" class="table"  cellpadding="0" cellspacing="0" border="0">
                                <tr class="table-header">
                                    <th class="first">
                                        ID
                                    </th>
                                    <th class="nameColumn">
                                        Name
                                    </th>
                                    <th>
                                        Price In Robux
                                    </th>
                                    <th>
                                        Edit
                                    </th>
                                </tr>
                                    ${developerProducts}
                            </table>
                        </div>
                        </div>
            
            </div>
            `;
            if (id) {
                res.send(html);
            } else {
                res.status(500).json({});
            }
        });

        app.get("/places/check-developerproduct-name", async (req, res) => {
            const universeId = parseInt(req.query.universeId);
            const developerProductId = parseInt(req.query.developerProductId);
            const developerProductName = req.query.developerProductName;
            const game = await db.getGame(universeId);
            if (!game) {
                res.status(404).json({
                    "Success": false,
                    "Message": "Invalid game"
                });
                return;
            }
            if (game.creatorid != req.user.userid) {
                res.status(401).json({
                    "Success": false,
                    "Message": "You do not have permission to edit this developer product."
                });
                return;
            }
            const result = await db.getDevProductByGameAndName(game.gameid, developerProductName) == null;
            res.json({
                "Success": result,
                "Message": (!result) ? "Name available" : "Name unavailable"
            });
        });

        app.post("/places/developerproducts/update", db.requireAuth, async (req, res) => {
            const universeId = parseInt(req.body.universeId);
            const name = req.body.name;
            const developerProductId = parseInt(req.body.developerProductId);
            const priceInRobux = parseInt(req.body.priceInRobux);
            const description = req.body.description;
            const imageAssetId = parseInt(req.body.imageAssetId);

            const game = await db.getGame(universeId);
            if (!game) {
                res.status(404).json({});
                return;
            }
            if (game.creatorid != req.user.userid) {
                res.status(401).json({});
                return;
            }
            const product = await db.getDevProduct(developerProductId);
            if (product.creatorid != req.user.userid) {
                res.status(401).json({});
                return;
            }
            if ((await db.getDevProductByGameAndName(game.gameid, name)) != null && product.name != name) {
                res.status(400).json({});
                return;
            }
            const id = await db.editDevProduct(developerProductId, game.creatorid, game.gameid, name, description, priceInRobux);

            let developerProducts = "";
            const developerProducts0 = await db.getDevProducts(game.gameid);
            for (let i = 0; i < developerProducts0.length; i++) {
                const product = developerProducts0[i];
                developerProducts += `<tr>
                <td>${product.id}
                </td>
                <td class="itemName nameColumn">
                    <span>${product.name}</span>
                </td>
                <td>${product.price}
                </td>
                <td class="edit">
                    <a class="text-link edit" data-url="/places/edit-developerproduct?developerProductId=${product.id}&amp;universeId=${game.gameid}">
                        Edit</a>
                </td>
            </tr>`;
            }

            let html = `



            <div id="DevProducts" class="developerProductsContainer">
                <div id="DeveloperProductsLoading">
                    <img class="developerProductsLoadingImage" src='https://images.rbx2016.tk/ec4e85b0c4396cf753a06fade0a8d8af.gif' />
                </div>
                <div id="DeveloperProductsError" >
                    An error occurred while fetching the developer products.  Please try again later.
                </div>
                <div id="DeveloperProductsInnerContainer">
                        <div class="headline">
                            <h2>
                                Developer Products
                            </h2>
                            <span id="createButtonRow" class="createNewButtonSection">
                                <a  data-url="/places/create-developerproduct?universeId=2448305152" class="btn-small btn-neutral" id="createNewButton">Create new</a>
                            </span>
                        </div>
                        <div id="DeveloperProductStatus" class="status-confirm developerProductUpdateStatus" >Product ${developerProductId} successfully updated</div>
                
                        <div id="DeveloperProductsList" class="developerProductsTableContainer">
                            <table id="DeveloperProductsTable" class="table"  cellpadding="0" cellspacing="0" border="0">
                                <tr class="table-header">
                                    <th class="first">
                                        ID
                                    </th>
                                    <th class="nameColumn">
                                        Name
                                    </th>
                                    <th>
                                        Price In Robux
                                    </th>
                                    <th>
                                        Edit
                                    </th>
                                </tr>
                                    ${developerProducts}
                            </table>
                        </div>
                        </div>
            
            </div>
            `;
            if (id) {
                res.send(html);
            } else {
                res.status(500).json({});
            }
        });

        app.get("/places/create-developerproduct", async (req, res) => {
            const gameid = parseInt(req.query.universeId);
            res.render("createdeveloperproduct", {
                ...(await db.getRenderObject(req.user)),
                gameid: gameid
            });
        });

        app.get("/places/edit-developerproduct", db.requireAuth, async (req, res) => {
            const gameid = parseInt(req.query.universeId);
            const developerProductId = parseInt(req.query.developerProductId);
            const product = await db.getDevProduct(developerProductId);
            if (!product) {
                res.status(404).json({});
                return;
            }
            if (product.gameid != gameid) {
                res.status(401).json({});
                return;
            }
            if (product.creatorid != req.user.userid) {
                res.status(401).json({});
                return;
            }
            res.render("editdeveloperproduct", {
                ...(await db.getRenderObject(req.user)),
                gameid: gameid,
                id: product.id,
                name: product.name,
                desc: product.description,
                price: product.price
            });
        });

        app.get("/places/:placeid/update", db.requireAuth, async (req, res) => {
            const placeid = parseInt(req.params.placeid);
            const game = await db.getGame(placeid);
            if (game) {
                if (game.creatorid != req.user.userid) {
                    if (req.user) {
                        res.status(403).render("403", await db.getRenderObject(req.user));
                    } else {
                        res.status(403).render("403", await db.getBlankRenderObject());
                    }
                    return;
                }
                const creator = await db.getUser(game.creatorid);
                res.render("updateplace", {
                    ...(await db.getRenderObject(req.user)),
                    gameid: game.gameid,
                    gamename: game.gamename,
                    gamedesc: game.description,
                    creatorid: game.creatorid,
                    creatorname: creator.username,
                    gamegenre: game.genre,
                    maxPlayers: game.maxplayers,
                    everyonearg: game.access == "Everyone" ? "selected=\"selected\"" : "",
                    friendsarg: game.access == "Friends" ? "selected=\"selected\"" : "",
                    copiable: game.copiable ? "checked=\"checked\"" : "",
                    chattype: game.chattype
                });
            }
        });

        app.post("/places/:placeid/update", db.requireAuth, async (req, res) => {
            const placeid = parseInt(req.params.placeid);
            const game = await db.getGame(placeid);
            if (!game) {
                res.status(404).send();
                return;
            }
            if (game.creatorid != req.user.userid) {
                if (req.user) {
                    res.status(403).render("403", await db.getRenderObject(req.user));
                } else {
                    res.status(403).render("403", await db.getBlankRenderObject());
                }
                return;
            }
            const name = req.body.Name;
            const desc = req.body.Description;
            let genre = req.body.Genre;
            if (genre == "") genre = "All";
            const maxplayers = parseInt(req.body.NumberOfPlayersMax);
            if (maxplayers > 15) {
                if (req.user) {
                    res.status(400).render("400", await db.getRenderObject(req.user));
                } else {
                    res.status(400).render("400", await db.getBlankRenderObject());
                }
                return;
            }
            const access = req.body.Access;
            if (access != "Everyone" && access != "Friends") {
                if (req.user) {
                    res.status(400).render("400", await db.getRenderObject(req.user));
                } else {
                    res.status(400).render("400", await db.getBlankRenderObject());
                }
                return;
            }
            const isCopyingAlowed = req.body.IsCopyingAllowed == "true";
            const chattype = req.body.ChatType;
            if (chattype != "Classic" && chattype != "Bubble" && chattype != "Both") {
                if (req.user) {
                    res.status(400).render("400", await db.getRenderObject(req.user));
                } else {
                    res.status(400).render("400", await db.getBlankRenderObject());
                }
                return;
            }
            const allowplacetobecopiedingame = req.body.AllowPlaceToBeCopiedInGame == "true";
            const allowplacetobeupdatedingame = req.body.AllowPlaceToBeUpdatedInGame == "true";
            db.updatePlace(placeid, name, desc, genre, maxplayers, access, isCopyingAlowed, chattype)
            res.redirect(`/games/${placeid}`);
        });

        app.post("/universes/doconfigure", db.requireAuth2, async (req, res) => {
            const __RequestVerificationToken = req.body.__RequestVerificationToken;
            let user = await db.getUserByCsrfToken(__RequestVerificationToken);
            if (!user) {
                user = req.user;
            }
            const gameid = parseInt(req.body.Id);
            if (typeof gameid == "undefined") {
                res.status(400).send();
                return;
            }
            if (!user) {
                res.redirect(`/universes/configure?id=${gameid}&isUpdateSuccess=False`);
                return;
            }
            const name = req.body.Name;
            const ispublic = req.body.PublicLevel == "0" // req.body.IsPublic == "True";
            const allowstudioaccesstoapis = req.body.AllowStudioAccessToApis == "True";
            const game = await db.getGame(gameid);
            if (game == null) {
                res.redirect(`/universes/configure?id=${gameid}&isUpdateSuccess=False`);
                return;
            }
            if (game.creatorid != user.userid) {
                res.redirect(`/universes/configure?id=${gameid}&isUpdateSuccess=False`);
                return;
            }
            await db.updateGame(gameid, name, allowstudioaccesstoapis, ispublic);
            res.redirect(`/universes/configure?id=${gameid}&isUpdateSuccess=True`);
        });

        app.get("/universes/configure", db.requireAuth, async (req, res) => {
            const gameid = parseInt(req.query.id);
            const game = await db.getGame(gameid);
            if (game === null) {
                res.redirect("/");
                return;
            }
            if (game.creatorid != req.user.userid) {
                if (req.user) {
                    res.status(403).render("403", await db.getRenderObject(req.user));
                } else {
                    res.status(403).render("403", await db.getBlankRenderObject());
                }
                return;
            }

            let developerProducts = "";
            const developerProducts0 = await db.getDevProducts(game.gameid);
            for (let i = 0; i < developerProducts0.length; i++) {
                const product = developerProducts0[i];
                developerProducts += `<tr>
                <td>${product.id}
                </td>
                <td class="itemName nameColumn">
                    <span>${product.name}</span>
                </td>
                <td>${product.price}
                </td>
                <td class="edit">
                    <a class="text-link edit" data-url="/places/edit-developerproduct?developerProductId=${product.id}&amp;universeId=${game.gameid}">
                        Edit</a>
                </td>
            </tr>`;
            }

            res.render("universeconfigure", {
                ...(await db.getRenderObject(req.user)),
                gameid: gameid,
                gamename: game.gamename,
                gamename2: db.filterText2(game.gamename).replaceAll(" ", "-"),
                publicarg: game.isPublic ? "checked=\"checked\"" : "",
                privatearg: game.isPublic ? "" : "checked=\"checked\"",
                studioapiacessarg: game.allowstudioaccesstoapis ? "checked=\"checked\"" : "",
                developerProducts: developerProducts,
            });
        });

        app.post("/voting/vote", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.votingServiceEnabled == false) {
                return res.json({
                    "Success": false,
                    "Message": "Voting is currently disabled.",
                    "ModalType": "UnknownProblem",
                    "Model": {
                        "ShowVotes": true,
                        "UpVotes": game.likes.length,
                        "DownVotes": game.dislikes.length,
                        "CanVote": false,
                        "UserVote": likeStatus,
                        "HasVoted": false,
                        "ReasonForNotVoteable": "UnknownProblem"
                    }
                });
            }
            const assetid = parseInt(req.query.assetId);
            const vote = req.query.vote;
            // {"Success":false,"Message":null,"ModalType":"FloodCheckThresholdMet","Model":{"ShowVotes":true,"UpVotes":0,"DownVotes":0,"CanVote":false,"UserVote":true,"HasVoted":true,"ReasonForNotVoteable":"FloodCheckThresholdMet"}}
            const voted = await db.setLike(req.user.userid, assetid, vote == "true" ? "like" : vote == "false" ? "dislike" : "none");
            const likeStatus0 = await db.userLikeStatus(req.user.userid, assetid);
            const likeStatus = likeStatus0 == "Liked" ? true : likeStatus0 == "Disliked" ? false : null;
            if (voted) {
                const game = await db.getGame(assetid);
                if (game) {
                    res.json({
                        "Success": true,
                        "Message": null,
                        "ModalType": "",
                        "Model": {
                            "ShowVotes": true,
                            "UpVotes": game.likes.length,
                            "DownVotes": game.dislikes.length,
                            "CanVote": true,
                            "UserVote": likeStatus,
                            "HasVoted": true,
                            "ReasonForNotVoteable": ""
                        }
                    });
                } else {
                    res.json({
                        "Success": true,
                        "Message": null,
                        "ModalType": "",
                        "Model": {
                            "ShowVotes": false,
                            "UpVotes": 0,
                            "DownVotes": 0,
                            "CanVote": true,
                            "UserVote": likeStatus,
                            "HasVoted": true,
                            "ReasonForNotVoteable": ""
                        }
                    });
                }
            } else {
                const game = await db.getGame(assetid);
                if (game) {
                    if (db.isUserRatingRateLimited(req.user.userid)) {
                        res.json({
                            "Success": false,
                            "Message": null,
                            "ModalType": "FloodCheckThresholdMet",
                            "Model": {
                                "ShowVotes": true,
                                "UpVotes": game.likes.length,
                                "DownVotes": game.dislikes.length,
                                "CanVote": false,
                                "UserVote": likeStatus,
                                "HasVoted": true,
                                "ReasonForNotVoteable": "FloodCheckThresholdMet"
                            }
                        });
                        return;
                    }
                    if (!await db.userHasPlayedGame(req.user.userid, assetid) && db.getSiteConfig().shared.needsToPlayBeforeLikeGame) {
                        res.json({
                            "Success": false,
                            "Message": null,
                            "ModalType": "PlayGame",
                            "Model": {
                                "ShowVotes": true,
                                "UpVotes": game.likes.length,
                                "DownVotes": game.dislikes.length,
                                "CanVote": false,
                                "UserVote": likeStatus,
                                "HasVoted": true,
                                "ReasonForNotVoteable": "PlayGame"
                            }
                        });
                        return;
                    }
                } else {
                    if (db.isUserRatingRateLimited(req.user.userid)) {
                        res.json({
                            "Success": false,
                            "Message": null,
                            "ModalType": "FloodCheckThresholdMet",
                            "Model": {
                                "ShowVotes": false,
                                "UpVotes": 0,
                                "DownVotes": 0,
                                "CanVote": false,
                                "UserVote": likeStatus,
                                "HasVoted": true,
                                "ReasonForNotVoteable": "FloodCheckThresholdMet"
                            }
                        });
                        return;
                    }
                }
                res.json({
                    "Success": false,
                    "Message": null,
                    "ModalType": "UnknownProblem",
                    "Model": {
                        "ShowVotes": true,
                        "UpVotes": game.likes.length,
                        "DownVotes": game.dislikes.length,
                        "CanVote": false,
                        "UserVote": likeStatus,
                        "HasVoted": false,
                        "ReasonForNotVoteable": "UnknownProblem"
                    }
                });
            }
        });

        app.post("/v2/favorite/toggle", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.votingServiceEnabled == false) {
                return res.json({
                    "success": false,
                    "message": "Voting is currently disabled.",
                });
            }
            const assetId = parseInt(req.body.assetID);
            const favorited = await db.toggleFavorite(req.user.userid, assetId);
            if (favorited) {
                res.json({
                    "success": true,
                    "message": "",
                });
            } else {
                res.json({
                    "success": false,
                    "message": "Failed to favorite asset, please try again later.",
                });
            }
        });

        app.post("/favorite/toggle", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.votingServiceEnabled == false) {
                return res.json({
                    "success": false,
                    "message": "Voting is currently disabled.",
                });
            }
            const assetId = parseInt(req.body.assetID);
            const favorited = await db.toggleFavorite(req.user.userid, assetId);
            if (favorited) {
                res.json({
                    "success": true,
                    "message": "",
                });
            } else {
                res.json({
                    "success": false,
                    "message": "Failed to favorite asset, please try again later.",
                });
            }
        });

        app.get("/install/download.aspx", (req, res) => {
            res.redirect("/download");
        })

        app.get("/game-auth/getauthticket", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                return res.status(401).send();
            }
            res.send(await db.generateUserTokenByCookie(req.user.cookie));
        });

        app.get("/game/getauthticket", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                return res.status(401).send();
            }
            res.send(await db.generateUserTokenByCookie(req.user.cookie));
        });

        app.get("/games/votingservice/:gameid", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.votingServiceEnabled == false) {
                res.status(400).json({})
                return;
            }
            const gameid = parseInt(req.params.gameid);
            const game = await db.getGame(gameid);
            if (game) {
                res.render("votingservice", {
                    gameid: game.gameid,
                    likes: game.likes.length,
                    dislikes: game.dislikes.length
                });
            }
        });

        app.get("/build/game-passes", async (req, res) => {
            const assetTypeId = parseInt(req.query.assetTypeId);
            const targetPlaceId = parseInt(req.query.targetPlaceId);
            const startId = parseInt(req.query.startId);
            const game = await db.getGame(targetPlaceId);
            if (!game) {
                res.sendStatus(404);
                return;
            }
            if (assetTypeId == 34) {
                let gamepassesHtml = "";
                if (db.getSiteConfig().shared.gamepassesEnabled == true) {
                    const gamepasses = await db.getGamepasses(game.gameid);
                    for (let i = 0; i < gamepasses.length; i++) {
                        if (startId && i < startId) {
                            continue;
                        }
                        const gamepass = gamepasses[i];
                        const created = db.unixToDate(gamepass.created);
                        const updated = db.unixToDate(gamepass.updated);
                        gamepassesHtml += `<table class="item-table" data-item-id="${gamepass.id}"
                        data-type="image" style="">
                        <tbody>
                            <tr>
                                <td class="image-col">
                                    <a href="https://www.rbx2016.tk/game-pass/${gamepass.id}"
                                        class="item-image"><img class=""
                                            src="${gamepass.thumbnailurl}"></a>
                                </td>
                                <td class="name-col">
                                    <a class="title"
                                        href="https://www.rbx2016.tk/game-pass/${gamepass.id}">${gamepass.name}</a>
                                    <table class="details-table">
                                        <tbody>
                                            <tr>
                                                <td class="item-date">
                                                    <span>Updated</span>${`${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td class="stats-col">
                                    <div class="totals-label">Total Sales:
                                        <span>${gamepass.sold}</span></div>
                                    <div class="totals-label">Last 7 days:
                                        <span>?</span></div>
                                </td>
                                <td class="menu-col">
                                    <div class="gear-button-wrapper">
                                        <a href="#" class="gear-button"></a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="separator" style=""></div>`;
                    }
                }
                res.send(gamepassesHtml);
            } else {
                res.sendStatus(400);
            }
        });

        app.get("/develop", db.requireAuth, async (req, res) => {
            const View = req.query.View;
            let Page = req.query.Page;
            if (Page) {
                Page = Page.toLowerCase();
            }
            if ((Page != null && Page != "universes" && Page != "game-passes" && Page != "decals" && Page != "audios" && Page != "meshes" && Page != "shirts") || View != null) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            let games = await db.getGamesByCreatorId(req.user.userid);
            games = games.reverse();
            const game_template = fs.readFileSync(__dirname + "/../views/template_mygame.ejs").toString();
            let games_html = "";
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                games_html += game_template.toString().replaceAll("<%= gameid %>", game.gameid).replaceAll("<%= gamename %>", game.gamename).replaceAll("<%= gamename2 %>", db.filterText2(game.gamename).replaceAll(" ", "-")).replaceAll("<%= gameiconthumbnail %>", game.iconthumbnail).replaceAll("<%= placeActive %>", game.isPublic ? "place-active" : "place-inactive").replaceAll("<%= pubtext %>", game.isPublic ? "Public" : "Private");
            }

            let game = null;

            let publicPlacesHtml = "";
            const publicPlaces = await db.getGamesByCreatorId(req.user.userid, true);
            if (publicPlaces && publicPlaces.length > 0) {
                game = publicPlaces[0];
            }
            for (let i = 0; i < publicPlaces.length; i++) {
                const game = publicPlaces[i];
                publicPlacesHtml += `<option value="${game.gameid}"
                data-universe-id="${game.gameid}">
                ${game.gamename}</option>`;
            }


            let gamepassesHtml = "";
            if (game && db.getSiteConfig().shared.gamepassesEnabled == true && Page == "game-passes") {
                let gamepasses = await db.getGamepasses(game.gameid);
                gamepasses = gamepasses.reverse();
                for (let i = 0; i < gamepasses.length; i++) {
                    const gamepass = gamepasses[i];
                    const created = db.unixToDate(gamepass.created);
                    const updated = db.unixToDate(gamepass.updated);
                    gamepassesHtml += `<table class="item-table" data-item-id="${gamepass.id}"
                    data-type="image" style="">
                    <tbody>
                        <tr>
                            <td class="image-col">
                                <a href="https://www.rbx2016.tk/game-pass/${gamepass.id}"
                                    class="item-image"><img class=""
                                        src="${gamepass.thumbnailurl}"></a>
                            </td>
                            <td class="name-col">
                                <a class="title"
                                    href="https://www.rbx2016.tk/game-pass/${gamepass.id}">${gamepass.name}</a>
                                <table class="details-table">
                                    <tbody>
                                        <tr>
                                            <td class="item-date">
                                                <span>Updated</span>${`${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td class="stats-col">
                                <div class="totals-label">Total Sales:
                                    <span>${gamepass.sold}</span></div>
                                <div class="totals-label">Last 7 days:
                                    <span>?</span></div>
                            </td>
                            <td class="menu-col">
                                <div class="gear-button-wrapper">
                                    <a href="#" class="gear-button"></a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="separator" style=""></div>`;
                }
            }

            let decalsHtml = "";
            if (db.getSiteConfig().shared.assetsEnabled == true && Page == "decals") {
                let assets = await db.getAssets(req.user.userid, "Decal");
                assets = assets.reverse();
                for (let i = 0; i < assets.length; i++) {
                    const asset = assets[i];
                    // if (asset.deleted) continue;
                    const created = db.unixToDate(asset.created);
                    const updated = db.unixToDate(asset.updated);
                    decalsHtml += `<table class="item-table" data-item-id="${asset.id}"
                    data-type="image" style="">
                    <tbody>
                        <tr>
                            <td class="image-col">
                                <a href="https://www.rbx2016.tk/library/${asset.id}"
                                    class="item-image"><img class=""
                                        src="${asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : `https://www.rbx2016.tk/asset?id=${asset.id}`}"></a>
                            </td>
                            <td class="name-col">
                                <a class="title"
                                    href="https://www.rbx2016.tk/library/${asset.id}">${asset.name}</a>
                                <table class="details-table">
                                    <tbody>
                                        <tr>
                                            <td class="item-date">
                                                <span>Updated</span>${`${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td class="stats-col">
                                <div class="totals-label">Total Sales:
                                    <span>${asset.sold}</span></div>
                                <div class="totals-label">Last 7 days:
                                    <span>?</span></div>
                            </td>
                            <td class="menu-col">
                                <div class="gear-button-wrapper">
                                    <a href="#" class="gear-button"></a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="separator" style=""></div>`;
                }
            }

            let audiosHtml = "";
            if (db.getSiteConfig().shared.assetsEnabled == true && Page == "audios") {
                let assets = await db.getAssets(req.user.userid, "Audio");
                assets = assets.reverse();
                for (let i = 0; i < assets.length; i++) {
                    const asset = assets[i];
                    // if (asset.deleted) continue;
                    const created = db.unixToDate(asset.created);
                    const updated = db.unixToDate(asset.updated);
                    audiosHtml += `<table class="item-table" data-item-id="${asset.id}"
                    data-type="image" style="">
                    <tbody>
                        <tr>
                            <td class="image-col">
                                <a href="https://www.rbx2016.tk/library/${asset.id}"
                                    class="item-image"><img class=""
                                        src="${asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : "https://static.rbx2016.tk/eadc8982548a4aa4c158ba1dad61ff14.png"}"></a>
                            </td>
                            <td class="name-col">
                                <a class="title"
                                    href="https://www.rbx2016.tk/library/${asset.id}">${asset.name}</a>
                                <table class="details-table">
                                    <tbody>
                                        <tr>
                                            <td class="item-date">
                                                <span>Updated</span>${`${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td class="stats-col">
                                <div class="totals-label">Total Sales:
                                    <span>${asset.sold}</span></div>
                                <div class="totals-label">Last 7 days:
                                    <span>?</span></div>
                            </td>
                            <td class="menu-col">
                                <div class="gear-button-wrapper">
                                    <a href="#" class="gear-button"></a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="separator" style=""></div>`;
                }
            }

            let meshesHtml = "";
            if (db.getSiteConfig().shared.assetsEnabled == true && Page == "meshes") {
                let assets = await db.getAssets(req.user.userid, "Mesh");
                assets = assets.reverse();
                for (let i = 0; i < assets.length; i++) {
                    const asset = assets[i];
                    // if (asset.deleted) continue;
                    const created = db.unixToDate(asset.created);
                    const updated = db.unixToDate(asset.updated);
                    meshesHtml += `<table class="item-table" data-item-id="${asset.id}"
                    data-type="image" style="">
                    <tbody>
                        <tr>
                            <td class="image-col">
                                <a href="https://www.rbx2016.tk/library/${asset.id}"
                                    class="item-image"><img class=""
                                        src="${asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : "https://static.rbx2016.tk/643d0aa8abe0b6f253c59ef6bbd0b30a.jpg"}"></a>
                            </td>
                            <td class="name-col">
                                <a class="title"
                                    href="https://www.rbx2016.tk/library/${asset.id}">${asset.name}</a>
                                <table class="details-table">
                                    <tbody>
                                        <tr>
                                            <td class="item-date">
                                                <span>Updated</span>${`${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td class="stats-col">
                                <div class="totals-label">Total Sales:
                                    <span>${asset.sold}</span></div>
                                <div class="totals-label">Last 7 days:
                                    <span>?</span></div>
                            </td>
                            <td class="menu-col">
                                <div class="gear-button-wrapper">
                                    <a href="#" class="gear-button"></a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="separator" style=""></div>`;
                }
            }

            let shirtsHtml = "";
            if (db.getSiteConfig().shared.assetsEnabled == true && Page == "shirts") {
                let assets = await db.getCatalogItemsFromCreatorId(req.user.userid, "Shirt");
                assets = assets.reverse();
                for (let i = 0; i < assets.length; i++) {
                    const asset = assets[i];
                    // if (asset.deleted) continue;
                    const created = db.unixToDate(asset.created);
                    const updated = db.unixToDate(asset.updated);
                    shirtsHtml += `<table class="item-table" data-item-id="${asset.itemid}"
                    data-type="image" style="">
                    <tbody>
                        <tr>
                            <td class="image-col">
                                <a href="https://www.rbx2016.tk/library/${asset.itemid}"
                                    class="item-image"><img class=""
                                        src="${asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : `https://www.rbx2016.tk/asset?id=${asset.itemdecalid}`}"></a>
                            </td>
                            <td class="name-col">
                                <a class="title"
                                    href="https://www.rbx2016.tk/catalog/${asset.itemid}">${asset.itemname}</a>
                                <table class="details-table">
                                    <tbody>
                                        <tr>
                                            <td class="item-date">
                                                <span>Updated</span>${`${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td class="stats-col">
                                <div class="totals-label">Total Sales:
                                    <span>${asset.itemowners.length}</span></div>
                                <div class="totals-label">Last 7 days:
                                    <span>?</span></div>
                            </td>
                            <td class="menu-col">
                                <div class="gear-button-wrapper">
                                    <a href="#" class="gear-button"></a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="separator" style=""></div>`;
                }
            }

            res.render("develop", {
                ...(await db.getRenderObject(req.user)),
                games: games_html,
                publicPlaces: publicPlacesHtml,
                gamepasses: gamepassesHtml,
                decals: decalsHtml,
                audios: audiosHtml,
                meshes: meshesHtml,
                shirts: shirtsHtml,
                tab: Page,
                assetTypeId: Page == "game-passes" ? 34 : Page == "decals" ? 13 : Page == "audios" ? 3 : Page == "meshes" ? 4 : null,
                gameid: Page == "game-passes" ? game != null ? game.gameid : null : null
            });
        });

        app.post("/build/verifyupload", db.requireAuth, async (req, res) => {
            const name = req.body.name;
            const targetPlaceId = parseInt(req.body.targetPlaceId);
            let game = null;
            if (targetPlaceId) {
                game = await db.getGame(targetPlaceId);
            }
            if (game) {
                if (game.creatorid != req.user.userid) {
                    res.status(401).send("You are not the creator of this game");
                    return;
                }
            }
            res.render("buildverifyupload", {
                ...(await db.getRenderObject(req.user)),
                name: req.body.name,
                desc: req.body.description,
                assetTypeId: parseInt(req.body.assetTypeId),
                gameid: game != null ? game.gameid : null,
                gamename: game != null ? game.gamename : null
            });
        });

        app.post("/build/doverifiedupload", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.assetsEnabled == false) {
                res.status(401).send("Assets are disabled");
                return;
            }
            const assetTypeId = parseInt(req.body.assetTypeId);
            let url = `/build/upload?assetTypeId=${assetTypeId}`;
            const targetPlaceId = parseInt(req.body.targetPlaceId)
            if (targetPlaceId) {
                url += `&targetPlaceId=${targetPlaceId}`;
            }
            const game = await db.getGame(targetPlaceId);
            if (game && req.user.userid != game.creatorid) {
                res.status(401).send();
                return;
            }
            const name = req.body.name;
            const desc = req.body.description || "";

            if (name.length < 3) {
                res.status(400).send("Too short name.");
                return;
            }else if (name.length > 50) {
                res.status(400).send("Too long name.");
                return;
            }

            let id = 0;
            if (assetTypeId == 34) {
                if ((await db.getGamepasses(game.gameid)).length >= (req.user.isAdmin ? db.getSiteConfig().shared.maxGamepassesPerGame.admin : db.getSiteConfig().shared.maxGamepassesPerGame.user)) {
                    res.status(401).send("Gamepass limit reached");
                    return;
                }
                id = await db.createGamepass(req.user.userid, game.gameid, name, desc, 0);
            } else if (assetTypeId == 13) {
                if (req.user.firstDailyAssetUpload && req.user.firstDailyAssetUpload != 0) {
                    if (db.getUnixTimestamp() - req.user.firstDailyAssetUpload < 24 * 60 * 60) {
                        if (db.getAssetsThisDay(req.userid) >= ((req.user.isAdmin || req.user.isMod) ? db.getSiteConfig().shared.maxAssetsPerDaily.admin : db.getSiteConfig().shared.maxAssetsPerDaily.user)) {
                            res.status(401).send("You have reached the daily asset upload limit");
                            return;
                        }
                    } else {
                        await db.setUserProperty(req.user.userid, "firstDailyAssetUpload", db.getUnixTimestamp());
                    }
                } else if (req.user.firstDailyAssetUpload == 0) {
                    await db.setUserProperty(req.user.userid, "firstDailyAssetUpload", db.getUnixTimestamp());
                }
                if (!req.files || Object.keys(req.files).length == 0) {
                    res.status(400).send("No file uploaded");
                    return;
                }
                if (req.files.file.size > 5.5 * 1024 * 1024) {
                    res.status(400).send("File too large");
                    return;
                }
                const file = req.files.file;
                if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/bmp") {
                    id = await db.createAsset(req.user.userid, name, desc, "Decal", req.user.isAdmin || req.user.isMod);
                    req.files.file.mv(`${__dirname}/../assets/${id}.asset`);
                } else {
                    res.status(400).send("Only listed formats are allowed!");
                    return;
                }
            } else if (assetTypeId == 11) {
                if (req.user.firstDailyAssetUpload && req.user.firstDailyAssetUpload != 0) {
                    if (db.getUnixTimestamp() - req.user.firstDailyAssetUpload < 24 * 60 * 60) {
                        if (db.getAssetsThisDay(req.userid) >= ((req.user.isAdmin || req.user.isMod) ? db.getSiteConfig().shared.maxAssetsPerDaily.admin : db.getSiteConfig().shared.maxAssetsPerDaily.user)) {
                            res.status(401).send("You have reached the daily asset upload limit");
                            return;
                        }
                    } else {
                        await db.setUserProperty(req.user.userid, "firstDailyAssetUpload", db.getUnixTimestamp());
                    }
                } else if (req.user.firstDailyAssetUpload == 0) {
                    await db.setUserProperty(req.user.userid, "firstDailyAssetUpload", db.getUnixTimestamp());
                }
                
                if (!req.files || Object.keys(req.files).length == 0) {
                    res.status(400).send("No file uploaded");
                    return;
                }
                if (req.files.file.size > 5.5 * 1024 * 1024) {
                    res.status(400).send("File too large");
                    return;
                }
                if (req.user.robux < db.getSiteConfig().shared.ShirtUploadCost) {
                    res.status(401).send("You do not have enough Robux to upload a shirt");
                    return;   
                }
                const file = req.files.file;
                if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/bmp") {
                    id = await db.createAsset(req.user.userid, name + "-SHIRT", desc, "Shirt", req.user.userid, req.user.isAdmin || req.user.isMod);
                    await db.createCatalogItem(name, desc, 0, "Shirt", req.user.userid, id);
                    req.files.file.mv(`${__dirname}/../assets/${id}.asset`);
                    await db.setUserProperty(req.user.userid, "robux", req.user.robux - db.getSiteConfig().shared.ShirtUploadCost);
                } else {
                    res.status(400).send("Only listed formats are allowed!");
                    return;
                }
            } else if (assetTypeId == 3) {
                if (req.user.firstMonthlyAssetUpload && req.user.firstMonthlyAssetUpload != 0) {
                    if (db.getUnixTimestamp() - req.user.firstMonthlyAssetUpload < 30 * 24 * 60 * 60) {
                        if (db.getAssetsThisDay(req.userid) >= ((req.user.isAdmin || req.user.isMod) ? db.getSiteConfig().shared.maxAssetsPerDaily.admin : db.getSiteConfig().shared.maxAssetsPerDaily.user)) {
                            res.status(401).send("You have reached the monthly asset upload limit");
                            return;
                        }
                    } else {
                        await db.setUserProperty(req.user.userid, "firstMonthlyAssetUpload", db.getUnixTimestamp());
                    }
                } else if (req.user.firstMonthlyAssetUpload == 0) {
                    await db.setUserProperty(req.user.userid, "firstMonthlyAssetUpload", db.getUnixTimestamp());
                }
                if (!req.files || Object.keys(req.files).length == 0) {
                    res.status(400).send("No file uploaded");
                    return;
                }
                if (req.files.file.size > 5.5 * 1024 * 1024) {
                    res.status(400).send("File too large");
                    return;
                }
                const file = req.files.file;
                if (file.mimetype == "audio/mpeg" || file.mimetype == "audio/ogg" || file.mimetype == "audio/wav") {
                    const metadata = await mm.parseBuffer(file.data, {
                        duration: true
                    });
                    if (metadata.format.duration > 7 * 60) {
                        res.status(400).send("Audio too long");
                        return;
                    }
                    id = await db.createAsset(req.user.userid, name, desc, "Audio", req.user.isAdmin || req.user.isMod);
                    req.files.file.mv(`${__dirname}/../assets/${id}.asset`);
                } else {
                    res.status(400).send("Only listed formats are allowed!");
                    return;
                }
            } else if (assetTypeId == 4) {
                if (req.user.firstDailyAssetUpload && req.user.firstDailyAssetUpload != 0) {
                    if (db.getUnixTimestamp() - req.user.firstDailyAssetUpload < 24 * 60 * 60) {
                        if (db.getAssetsThisDay(req.userid) >= ((req.user.isAdmin || req.user.isMod) ? db.getSiteConfig().shared.maxAssetsPerDaily.admin : db.getSiteConfig().shared.maxAssetsPerDaily.user)) {
                            res.status(401).send("You have reached the daily asset upload limit");
                            return;
                        }
                    } else {
                        await db.setUserProperty(req.user.userid, "firstDailyAssetUpload", db.getUnixTimestamp());
                    }
                } else if (req.user.firstDailyAssetUpload == 0) {
                    await db.setUserProperty(req.user.userid, "firstDailyAssetUpload", db.getUnixTimestamp());
                }
                if (!req.files || Object.keys(req.files).length == 0) {
                    res.status(400).send("No file uploaded");
                    return;
                }
                if (req.files.file.size > 5.5 * 1024 * 1024) {
                    res.status(400).send("File too large");
                    return;
                }
                const file = req.files.file;
                if (file.mimetype == "application/octet-stream") {
                    if (file.data.toString().startsWith("MZ�������ÿÿ��") || file.data.toString().startsWith("ÐÏà¡±á��������")) {
                        res.status(400).send("Only listed formats are allowed!");
                        return;
                    }
                    const fp0 = `${__dirname}/../temp/${db.uuidv4()}.asset`;
                    await req.files.file.mv(fp0);
                    const s = await db.convertMesh(fp0);
                    if (s) {
                        id = await db.createAsset(req.user.userid, name, desc, "Mesh", req.user.isAdmin || req.user.isMod);
                        const fp = `${__dirname}/../assets/${id}.asset`;
                        fs.renameSync(fp0, fp);
                    } else {
                        res.status(400).send("An error occured while uploading your file, please try again");
                        return;
                    }
                } else {
                    res.status(400).send("Only listed formats are allowed!");
                    return;
                }
            } else {
                res.status(400).render("400", await db.getRenderObject(req.user));
                return;
            }
            url += `&uploadedId=${id}`
            res.redirect(url);
        });

        app.get("/build/upload", db.requireAuth, async (req, res) => {
            const assetTypeId = parseInt(req.query.assetTypeId);
            const targetPlaceId = parseInt(req.query.targetPlaceId);
            const uploadedId = parseInt(req.query.uploadedId);
            let isUploaded = false;
            if (uploadedId) {
                isUploaded = true;
            }
            let game = null;
            if (targetPlaceId) {
                game = await db.getGame(targetPlaceId);
            }
            let isCreator = game && game.creatorid == req.user.userid;
            let fault = false;
            let formData = ``;

            if (assetTypeId == 34) {
                formData = `<div class="form-row">
                <label for="file">Find your image:</label>
                <input id="file" type="file" name="file" tabindex="1" />
                <span id="file-error" class="error"></span>
            </div>
            <div class="form-row">
                <label for="name">Pass Name:</label>
                <input id="name" type="text" class="text-box text-box-medium" name="name" maxlength="50" tabindex="2" />
                <span id="name-error" class="error"></span>
            </div>
            <div class="form-row textarea-container">
                <label for="description">Description:</label>
                <textarea id="description" name="description" data-item-description-max-character-count="1000" rows="2"
                    cols="62" tabindex="3"></textarea>
            </div>
            <div class="form-row submit-buttons">
                <a id="upload-button" class="btn-medium btn-primary btn-level-element "
                    tabindex="4">Preview<span class=></span></a>
                <span id="loading-container"><img
                        src="https://images.rbx2016.tk/ec4e85b0c4396cf753a06fade0a8d8af.gif"></span>
                <div id="upload-fee-item-result-error" class="status-error btn-level-element ${(!isCreator || fault) ? "" : "hidden"}">${!isCreator ? "You cannot manage this place" : "Insufficient Funds"}
                </div>
                <div id="upload-fee-item-result-success" class="status-confirm btn-level-element ${isUploaded ? "" : "hidden"}">
                    <div><a id="upload-fee-confirmation-link" target="_top">Pass</a> successfully created!</div>
                </div>
            </div>`;
            } else if (assetTypeId == 3) {
                formData = `<div id="audio-bucket-data" data-max-audio-size="20480000" data-max-audio-length="420" data-audio-enabled="false" data-audio-size="8388608" data-audio-price="100" data-shortsoundeffect-enabled="true" data-shortsoundeffect-size="786432" data-shortsoundeffect-price="20" data-longsoundeffect-enabled="true" data-longsoundeffect-size="1835008" data-longsoundeffect-price="35" data-music-enabled="true" data-music-size="8388608" data-music-price="70" data-longmusic-enabled="true" data-longmusic-size="20480000" data-longmusic-price="350"></div>            <div class="form-row">Audio uploads must be less than 7 minutes and smaller than 5.5 MB.</div>
                <div class="form-row">
                    <label for="file">Find your .mp3 or .ogg file:</label>
                    <input id="file" type="file" accept="audio/mpeg,audio/wav,audio/ogg" name="file" tabindex="1">
                    <span id="file-error" class="error"></span>
                </div>
                        <div class="form-row">
                    <label for="name">Audio Name:</label>
                    <input id="name" type="text" class="text-box text-box-medium" name="name" maxlength="50" tabindex="2">
                    <span id="name-error" class="error"></span>
                </div>
                    <div class="form-row submit-buttons">
                                <a id="upload-button" class="btn-medium btn-primary btn-level-element " data-freeaudio-enabled="true" tabindex="4">Upload<span class=""></span></a>
                                        <span id="loading-container"><img src="https://images.rbx2016.tk/ec4e85b0c4396cf753a06fade0a8d8af.gif"></span>
                <div id="upload-fee-item-result-error" class="status-error btn-level-element hidden">${(!isCreator || fault) ? "" : "hidden"}">${!isCreator ? "You cannot manage this place" : "Insufficient Funds"}</div>
                <div id="upload-fee-item-result-success" class="status-confirm btn-level-element ${isUploaded ? "" : "hidden"}">
                    <div><a id="upload-fee-confirmation-link" target="_top">Audio</a> successfully created!</div>
                </div>
            </div>`;
            } else if (assetTypeId == 4) {
                formData = `<div class="form-row">
                <label for="file">Find your mesh:</label>
                <input id="file" type="file" accept="model/obj" name="file" tabindex="1">
                <span id="file-error" class="error"></span>
            </div>
                    <div class="form-row">
                <label for="name">Mesh Name:</label>
                <input id="name" type="text" class="text-box text-box-medium" name="name" maxlength="50" tabindex="2">
                <span id="name-error" class="error"></span>
            </div>
                <div class="form-row submit-buttons">
                            <a id="upload-button" class="btn-medium btn-level-element  btn-primary" data-freeaudio-enabled="true" tabindex="4">Upload<span class=""></span></a>
                                    <span id="loading-container"><img src="https://images.rbx2016.tk/ec4e85b0c4396cf753a06fade0a8d8af.gif"></span>
            <div id="upload-fee-item-result-error" class="status-error btn-level-element hidden">${(!isCreator || fault) ? "" : "hidden"}">${!isCreator ? "You cannot manage this place" : "Insufficient Funds"}</div>
            <div id="upload-fee-item-result-success" class="status-confirm btn-level-element ${isUploaded ? "" : "hidden"}">
                <div><a id="upload-fee-confirmation-link" target="_top">Mesh</a> successfully created!</div>
            </div>
            </div>`;
            } else if (assetTypeId == 13) {
                formData = `<div class="form-row">
                <label for="file">Find your image:</label>
                <input id="file" type="file" accept="image/png,image/jpeg,image/bmp" name="file" tabindex="1">
                <span id="file-error" class="error"></span>
            </div>
                    <div class="form-row">
                <label for="name">Decal Name:</label>
                <input id="name" type="text" class="text-box text-box-medium" name="name" maxlength="50" tabindex="2">
                <span id="name-error" class="error"></span>
            </div>
                <div class="form-row submit-buttons">
                            <a id="upload-button" class="btn-medium btn-level-element  btn-primary" data-freeaudio-enabled="true" tabindex="4">Upload<span class=""></span></a>
                                    <span id="loading-container"><img src="https://images.rbx2016.tk/ec4e85b0c4396cf753a06fade0a8d8af.gif"></span>
            <div id="upload-fee-item-result-error" class="status-error btn-level-element hidden">${(!isCreator || fault) ? "" : "hidden"}">${!isCreator ? "You cannot manage this place" : "Insufficient Funds"}</div>
            <div id="upload-fee-item-result-success" class="status-confirm btn-level-element ${isUploaded ? "" : "hidden"}">
                <div><a id="upload-fee-confirmation-link" target="_top">Decal</a> successfully created!</div>
            </div>
            </div>`
            } else if (assetTypeId == 11) {
                formData = `<div class="form-row">Did you use the template? If not, <a target="_blank" href="https://static.rbx2016.tk/images/shirttemplate.png">download it here</a>.</div>
                <div class="form-row">
                    <label for="file">Find your image:</label>
                    <input id="file" type="file" accept="image/png,image/jpeg,image/bmp" name="file" tabindex="1">
                    <span id="file-error" class="error"></span>
                </div>
                        <div class="form-row">
                    <label for="name">Shirt Name:</label>
                    <input id="name" type="text" class="text-box text-box-medium" name="name" maxlength="50" tabindex="2">
                    <span id="name-error" class="error"></span>
                </div>
                    <div class="form-row submit-buttons">
                                <a id="upload-button" class="btn-medium btn-level-element  btn-primary" data-freeaudio-enabled="true" tabindex="4">Upload for ${db.getSiteConfig().shared.ShirtUploadCost} Robux<span class=""></span></a>
                                        <span id="loading-container"><img src="https://images.rbx2016.tk/ec4e85b0c4396cf753a06fade0a8d8af.gif"></span>
                <div id="upload-fee-item-result-error" class="status-error btn-level-element hidden">${(!isCreator || fault) ? "" : "hidden"}">${!isCreator ? "You cannot manage this place" : "Insufficient Funds"}</div>
                <div id="upload-fee-item-result-success" class="status-confirm btn-level-element ${isUploaded ? "" : "hidden"}">
                    <div><a id="upload-fee-confirmation-link" target="_top">Shirt</a> successfully created!</div>
                </div>
                </div>`
            } else {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            res.render("buildupload", {
                ...(await db.getRenderObject(req.user)),
                gameid: game != null ? game.gameid : null,
                gamename: game != null ? game.gamename : null,
                assetTypeId: assetTypeId,
                formData: formData,
                uploadedId: uploadedId,
                verifyUpload: assetTypeId == 34
            });
        });

        app.get("/develop/:tab", db.requireAuth, async (req, res) => {
            const View = req.query.View;
            const Page = req.query.Page;
            const tab = req.params.tab;
            if ((Page != null && Page != "universes") || View != null) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const games = await db.getGamesByCreatorId(req.user.userid);
            const game_template = fs.readFileSync(__dirname + "/../views/template_mygame.ejs").toString();
            let games_html = "";
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                games_html += game_template.toString().replaceAll("<%= gameid %>", game.gameid).replaceAll("<%= gamename %>", game.gamename).replaceAll("<%= gamename2 %>", db.filterText2(game.gamename).replaceAll(" ", "-"));
            }
            let actual_tab = "MyCreations";
            switch (tab) {
                case null:
                    actual_tab = "MyCreations";
                    res.redirect("/develop");
                    return;
                case "":
                    actual_tab = "MyCreations";
                    break;
                case "groups":
                    actual_tab = "GroupCreations";
                    break;
                case "library":
                    actual_tab = "Library";
                    break;
                case "developer-exchange":
                    actual_tab = "DevEx";
                    break;
                case "premium-payout":
                    actual_tab = "Payout";
                    break;
                default:
                    if (req.user) {
                        res.status(404).render("404", await db.getRenderObject(req.user));
                    } else {
                        res.status(404).render("404", await db.getBlankRenderObject());
                    }
                    return;
            }
            res.render("develop", {
                ...(await db.getRenderObject(req.user)),
                games: games_html,
                tab2: actual_tab,
                tab: null
            });
        });

        app.get("/my/avatar", db.requireAuth, async (req, res) => {
            res.render("avatar", await db.getRenderObject(req.user));
        });

        app.get("/library", db.requireAuth, async (req, res) => {
            const games = await db.getGamesByCreatorId(req.user.userid);
            const game_template = fs.readFileSync(__dirname + "/../views/template_mygame.ejs").toString();
            let games_html = "";
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                games_html += game_template.toString().replaceAll("<%= gameid %>", game.gameid).replaceAll("<%= gamename %>", game.gamename).replaceAll("<%= gamename2 %>", db.filterText2(game.gamename).replaceAll(" ", "-"));
            }
            res.render("develop", {
                ...(await db.getRenderObject(req.user)),
                games: games_html
            });
        });

        app.get("/build/universes", db.requireAuth, async (req, res) => {
            const games = await db.getGamesByCreatorId(req.user.userid);
            const game_template = fs.readFileSync(__dirname + "/../views/template_mygame.ejs").toString();
            let games_html = "";
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                games_html += game_template.toString().replaceAll("<%= gameid %>", game.gameid).replaceAll("<%= gamename %>", game.gamename).replaceAll("<%= gamename2 %>", db.filterText2(game.gamename).replaceAll(" ", "-"));
            }
            res.render("mygames", {
                ...(await db.getRenderObject(req.user)),
                games: games_html
            });
        });

        app.post("/login", async (req, res) => {
            res.send();
        });

        app.get("/users/friends/list-json", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canViewFriends == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const currentPage = parseInt(req.query.currentPage);
            const friendsType = req.query.friendsType;
            const userId = parseInt(req.query.userId);
            if (userId != req.user.userid) {
                res.status(403).send();
                return;
            }
            if (friendsType == "AllFriends") {
                let data = [];
                const friends = await db.getFriends(userId);
                for (let i = 0; i < friends.length; i++) {
                    const friend = await db.getUser(friends[i].friendid);
                    const presenceType = (friend.lastStudio || 0) > (db.getUnixTimestamp() - 30) ? 3 : (friend.lastOnline || 0) > (db.getUnixTimestamp() - 60) ? (friend.lastOnline || 0) > (db.getUnixTimestamp() - 60) && friend.playing != 0 ? 2 : 1 : 0;
                    data.push({
                        "UserId": friend.userid,
                        "AbsoluteURL": "https://www.rbx2016.tk/users/" + friend.userid.toString() + "/profile",
                        "Username": friend.username,
                        "AvatarUri": "https://images.rbx2016.tk/e6ea624485b22e528cc719f04560fe78Headshot.png",
                        "AvatarFinal": true,
                        "OnlineStatus": {
                            "LocationOrLastSeen": presenceType == 3 ? "Studio" : presenceType == 2 ? "Playing" : presenceType == 1 ? "Website" : "Offline",
                            "ImageUrl": "~/images/online.png",
                            "AlternateText": presenceType == 2 ? `${friend.username} is playing.` : presenceType == 1 ? `${friend.username} is online.` : `${friend.username} is offline.`
                        },
                        "Thumbnail": {
                            "Final": true,
                            "Url": "",
                            "RetryUrl": null,
                            "UserId": 530,
                            "EndpointType": "Avatar"
                        },
                        "InvitationId": 0,
                        "LastLocation": presenceType == 3 ? "Studio" : presenceType == 2 ? "Playing" : presenceType == 1 ? "Website" : "Offline",
                        "PlaceId": null,
                        "AbsolutePlaceURL": null,
                        "IsOnline": presenceType == 1,
                        "InGame": presenceType == 2,
                        "InStudio": false,
                        "IsFollowed": false,
                        "FriendshipStatus": 0,
                        "IsDeleted": friend.banned
                    });
                }
                res.json({
                    "UserId": userId,
                    "TotalFriends": data.length,
                    "CurrentPage": "0",
                    "PageSize": "18",
                    "TotalPages": Math.ceil(data.length / 18),
                    "FriendsType": "AllFriends",
                    "PreviousPageCursor": null,
                    "NextPageCursor": "",
                    "Friends": data.splice(18 * currentPage, 18 * (currentPage + 1))
                });
            } else if (friendsType == "FriendRequests") {
                let data = [];
                const friends = await db.getFriendRequests(userId);
                for (let i = 0; i < friends.length; i++) {
                    const friend = await db.getUser(friends[i].userid);
                    const presenceType = (friend.lastStudio || 0) > (db.getUnixTimestamp() - 30) ? 3 : (friend.lastOnline || 0) > (db.getUnixTimestamp() - 60) ? (friend.lastOnline || 0) > (db.getUnixTimestamp() - 60) && friend.playing != 0 ? 2 : 1 : 0;
                    data.push({
                        "UserId": friend.userid,
                        "AbsoluteURL": "https://www.rbx2016.tk/users/" + friend.userid.toString() + "/profile",
                        "Username": friend.username,
                        "AvatarUri": "https://images.rbx2016.tk/e6ea624485b22e528cc719f04560fe78Headshot.png",
                        "AvatarFinal": true,
                        "OnlineStatus": {
                            "LocationOrLastSeen": presenceType == 3 ? "Studio" : presenceType == 2 ? "Playing" : presenceType == 1 ? "Website" : "Offline",
                            "ImageUrl": "~/images/online.png",
                            "AlternateText": presenceType == 2 ? `${friend.username} is playing.` : presenceType == 1 ? `${friend.username} is online.` : `${friend.username} is offline.`
                        },
                        "Thumbnail": {
                            "Final": true,
                            "Url": "",
                            "RetryUrl": null,
                            "UserId": 530,
                            "EndpointType": "Avatar"
                        },
                        "InvitationId": 0,
                        "LastLocation": presenceType == 3 ? "Studio" : presenceType == 2 ? "Playing" : presenceType == 1 ? "Website" : "Offline",
                        "PlaceId": null,
                        "AbsolutePlaceURL": null,
                        "IsOnline": presenceType == 1,
                        "InGame": presenceType == 2,
                        "InStudio": false,
                        "IsFollowed": false,
                        "FriendshipStatus": 0,
                        "IsDeleted": friend.banned
                    });
                }
                res.json({
                    "UserId": userId,
                    "TotalFriends": data.length,
                    "CurrentPage": "0",
                    "PageSize": "18",
                    "TotalPages": Math.ceil(data.length / 18),
                    "FriendsType": "FriendRequests",
                    "PreviousPageCursor": null,
                    "NextPageCursor": "",
                    "Friends": data.splice(18 * currentPage, 18 * (currentPage + 1))
                });
            } else if (friendsType == "Followers") {
                let data = [];
                res.json({
                    "UserId": userId,
                    "TotalFriends": data.length,
                    "CurrentPage": "0",
                    "PageSize": "18",
                    "TotalPages": Math.ceil(data.length / 18),
                    "FriendsType": "Followers",
                    "PreviousPageCursor": null,
                    "NextPageCursor": "",
                    "Friends": data.splice(18 * currentPage, 18 * (currentPage + 1))
                });
            } else if (friendsType == "Following") {
                let data = [];
                res.json({
                    "UserId": userId,
                    "TotalFriends": data.length,
                    "CurrentPage": "0",
                    "PageSize": "18",
                    "TotalPages": Math.ceil(data.length / 18),
                    "FriendsType": "Following",
                    "PreviousPageCursor": null,
                    "NextPageCursor": "",
                    "Friends": data.splice(18 * currentPage, 18 * (currentPage + 1))
                });
            }
            res.status(400).send();
        });

        app.get("/places/:placeid/settings", (req, res) => {
            res.json({});
        });

        app.get("/install/GetInstallerCdns.ashx", async (req, res) => {
            res.json(db.getSiteConfig().shared.installerCdns);
        });

        app.get("/users/:userid/inventory", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.users.canViewInventory == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userid = parseInt(req.params.userid);
            const user = await db.getUser(userid);
            if (!user || user.banned || user.inviteKey == "") {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.render("inventory", {
                ...(await db.getRenderObject(req.user)),
                auserid: user.userid,
                ausername: user.username,
                auserdesc: user.description,
                aUserIsPremium: user.isPremium,
            });
        });

        app.get("/users/favorites/list-json", async (req, res) => {
            if (db.getSiteConfig().shared.users.canViewFavorites == false) {
                res.status(404).json({});
                return;
            }
            const assetTypeId = parseInt(req.query.assetTypeId);
            const itemsPerPage = parseInt(req.query.itemsPerPage);
            const pageNumber = parseInt(req.query.pageNumber);
            const thumbHeight = parseInt(req.query.thumbHeight);
            const thumbWidth = parseInt(req.query.thumbWidth);
            const userId = parseInt(req.query.userId);
            const items = [
                /*
                        {
                                "AssetRestrictionIcon": {
                                    "TooltipText": null,
                                    "CssTag": null,
                                    "LoadAssetRestrictionIconCss": true,
                                    "HasTooltip": false
                                },
                                "Item": {
                                    "AssetId": 1,
                                    "UniverseId": null,
                                    "Name": "Test",
                                    "AbsoluteUrl": "https://www.rbx2016.tk/catalog/1/Test",
                                    "AssetType": 8,
                                    "AssetTypeDisplayName": null,
                                    "AssetTypeFriendlyLabel": null,
                                    "Description": null,
                                    "Genres": null,
                                    "GearAttributes": null,
                                    "AssetCategory": 0,
                                    "CurrentVersionId": 0,
                                    "IsApproved": false,
                                    "LastUpdated": "\/Date(-62135575200000)\/",
                                    "LastUpdatedBy": null,
                                    "AudioUrl": null
                                },
                                "Creator": {
                                    "Id": 1,
                                    "Name": "Roblox",
                                    "Type": 1,
                                    "CreatorProfileLink": "https://www.rbx2016.tk/users/1/profile/"
                                },
                                "Product": {
                                    "Id": 0,
                                    "PriceInRobux": null,
                                    "PremiumDiscountPercentage": null,
                                    "PremiumPriceInRobux": null,
                                    "IsForSale": false,
                                    "IsPublicDomain": true,
                                    "IsResellable": false,
                                    "IsLimited": false,
                                    "IsLimitedUnique": false,
                                    "SerialNumber": null,
                                    "IsRental": false,
                                    "RentalDurationInHours": 0,
                                    "BcRequirement": 0,
                                    "TotalPrivateSales": 0,
                                    "SellerId": 0,
                                    "SellerName": null,
                                    "LowestPrivateSaleUserAssetId": null,
                                    "IsXboxExclusiveItem": false,
                                    "OffsaleDeadline": null,
                                    "NoPriceText": "Free",
                                    "IsFree": true
                                },
                                "PrivateServer": null,
                                "Thumbnail": {
                                    "Final": true,
                                    "Url": "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png",
                                    "RetryUrl": "",
                                    "IsApproved": false
                                },
                                "UserItem": {
                                    "UserAsset": null,
                                    "IsItemOwned": false,
                                    "ItemOwnedCount": 0,
                                    "IsRentalExpired": false,
                                    "IsItemCurrentlyRented": false,
                                    "CanUserBuyItem": false,
                                    "RentalExpireTime": null,
                                    "CanUserRentItem": false
                                }
                            }
                        */
            ] // TODO: Implement this.

            if (assetTypeId == 9) {
                const games = await db.getUserFavoritedGames(userId);
                for (let i = 0; i < games.length; i++) {
                    const game = await db.getGame(games[i]);
                    if (!game) continue;
                    const creator = await db.getUser(game.creatorid);
                    items.push({
                        "AssetRestrictionIcon": null,
                        "Item": {
                            "AssetId": game.gameid,
                            "UniverseId": game.gameid,
                            "Name": game.gamename,
                            "AbsoluteUrl": `https://www.rbx2016.tk/games/${game.gameid}/${db.filterText2(game.gamename).replace(" ", "-")}`,
                            "AssetType": 9,
                            "AssetTypeDisplayName": null,
                            "AssetTypeFriendlyLabel": null,
                            "Description": null,
                            "Genres": null,
                            "GearAttributes": null,
                            "AssetCategory": 0,
                            "CurrentVersionId": 0,
                            "IsApproved": false,
                            "LastUpdated": "\/Date(-62135575200000)\/",
                            "LastUpdatedBy": null,
                            "AudioUrl": null
                        },
                        "Creator": {
                            "Id": creator.userid,
                            "Name": creator.username,
                            "Type": 1,
                            "CreatorProfileLink": `https://www.rbx2016.tk/users/${creator.userid}/profile/`
                        },
                        "Product": null,
                        "PrivateServer": null,
                        "Thumbnail": {
                            "Final": true,
                            "Url": game.iconthumbnail,
                            "RetryUrl": "",
                            "IsApproved": true
                        },
                        "UserItem": {
                            "UserAsset": null,
                            "IsItemOwned": false,
                            "ItemOwnedCount": 0,
                            "IsRentalExpired": false,
                            "IsItemCurrentlyRented": false,
                            "CanUserBuyItem": false,
                            "RentalExpireTime": null,
                            "CanUserRentItem": false
                        }
                    });
                }
            }

            res.json({
                "IsValid": true,
                "Data": {
                    "TotalItems": items.length,
                    "nextPageCursor": null,
                    "previousPageCursor": null,
                    "PageType": "favorites",
                    "Items": items
                }
            });
        });

        app.get("/users/:userid/favorites", async (req, res) => {
            if (db.getSiteConfig().shared.users.canViewFavorites == false) {
                res.status(404).render("404", await db.getRenderObject(req.user));
                return;
            }
            const userid = parseInt(req.params.userid);
            const user = await db.getUser(userid);
            if (!user) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.render("favorites", {
                ...(await db.getRenderObject(req.user)),
                auserid: user.userid,
                ausername: user.username
            });
        });

        app.get("/users/inventory/list-json", (req, res) => {
            if (db.getSiteConfig().shared.users.canViewInventory == false) {
                res.status(404).json({});
                return;
            }
            const assetTypeId = parseInt(req.query.assetTypeId);
            const itemsPerPage = parseInt(req.query.itemsPerPage);
            const pageNumber = parseInt(req.query.pageNumber);
            const userId = parseInt(req.query.userId);

            const items = [
                /*
                        {
                                "AssetRestrictionIcon": {
                                    "TooltipText": null,
                                    "CssTag": null,
                                    "LoadAssetRestrictionIconCss": true,
                                    "HasTooltip": false
                                },
                                "Item": {
                                    "AssetId": 1,
                                    "UniverseId": null,
                                    "Name": "Test",
                                    "AbsoluteUrl": "https://www.rbx2016.tk/catalog/1/Test",
                                    "AssetType": 8,
                                    "AssetTypeDisplayName": null,
                                    "AssetTypeFriendlyLabel": null,
                                    "Description": null,
                                    "Genres": null,
                                    "GearAttributes": null,
                                    "AssetCategory": 0,
                                    "CurrentVersionId": 0,
                                    "IsApproved": false,
                                    "LastUpdated": "\/Date(-62135575200000)\/",
                                    "LastUpdatedBy": null,
                                    "AudioUrl": null
                                },
                                "Creator": {
                                    "Id": 1,
                                    "Name": "Roblox",
                                    "Type": 1,
                                    "CreatorProfileLink": "https://www.rbx2016.tk/users/1/profile/"
                                },
                                "Product": {
                                    "Id": 0,
                                    "PriceInRobux": null,
                                    "PremiumDiscountPercentage": null,
                                    "PremiumPriceInRobux": null,
                                    "IsForSale": false,
                                    "IsPublicDomain": true,
                                    "IsResellable": false,
                                    "IsLimited": false,
                                    "IsLimitedUnique": false,
                                    "SerialNumber": null,
                                    "IsRental": false,
                                    "RentalDurationInHours": 0,
                                    "BcRequirement": 0,
                                    "TotalPrivateSales": 0,
                                    "SellerId": 0,
                                    "SellerName": null,
                                    "LowestPrivateSaleUserAssetId": null,
                                    "IsXboxExclusiveItem": false,
                                    "OffsaleDeadline": null,
                                    "NoPriceText": "Free",
                                    "IsFree": true
                                },
                                "PrivateServer": null,
                                "Thumbnail": {
                                    "Final": true,
                                    "Url": "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png",
                                    "RetryUrl": "",
                                    "IsApproved": false
                                },
                                "UserItem": {
                                    "UserAsset": null,
                                    "IsItemOwned": false,
                                    "ItemOwnedCount": 0,
                                    "IsRentalExpired": false,
                                    "IsItemCurrentlyRented": false,
                                    "CanUserBuyItem": false,
                                    "RentalExpireTime": null,
                                    "CanUserRentItem": false
                                }
                            }
                        */
            ] // TODO: Implement this.

            res.json({
                "IsValid": true,
                "Data": {
                    "TotalItems": items.length,
                    "nextPageCursor": null,
                    "previousPageCursor": null,
                    "PageType": "inventory",
                    "Items": items
                }
            });
        });

        app.get("/item-thumbnails", async (req, res) => {
            const jsoncallback = req.query.jsoncallback;
            const params = req.query.params;
            const json = JSON.parse(params);
            const assetid = parseInt(json[0]["assetId"]);
            let item = await db.getCatalogItem(assetid);
            if (!item) {
                item = await db.getGamepass(assetid);
                if (!item) {
                    res.status(400).json({});
                    return;
                }
                res.send(jsoncallback + "(" + JSON.stringify([{
                    "id": item.id,
                    "name": db.filterText2(item.name).replaceAll(" ", "-"),
                    "url": "https://www.rbx2016.tk/catalog/" + item.id.toString() + "/" + db.filterText2(item.name).replaceAll(" ", "-"),
                    "thumbnailFinal": true,
                    "thumbnailUrl": item.thumbnailurl,
                    "bcOverlayUrl": null,
                    "limitedOverlayUrl": null,
                    "deadlineOverlayUrl": null,
                    "limitedAltText": null,
                    "newOverlayUrl": null,
                    "imageSize": "medium",
                    "saleOverlayUrl": null,
                    "iosOverlayUrl": null,
                    "transparentBackground": false
                }]) + ")");
                return;
            }
            res.send(jsoncallback + "(" + JSON.stringify([{
                "id": item.itemid,
                "name": db.filterText2(item.itemname).replaceAll(" ", "-"),
                "url": "https://www.rbx2016.tk/catalog/" + item.itemid.toString() + "/" + db.filterText2(item.itemname).replaceAll(" ", "-"),
                "thumbnailFinal": true,
                "thumbnailUrl": item.itemimage,
                "bcOverlayUrl": null,
                "limitedOverlayUrl": null,
                "deadlineOverlayUrl": null,
                "limitedAltText": null,
                "newOverlayUrl": null,
                "imageSize": "medium",
                "saleOverlayUrl": null,
                "iosOverlayUrl": null,
                "transparentBackground": false
            }]) + ")");
        });

        app.get("/game/GetCurrentUser.ashx", db.requireAuth2, async (req, res) => {
            const ip = get_ip(req).clientIp;
            let user = req.user;
            if (!user && typeof db.pendingStudioAuthentications[ip] == "object" && db.pendingStudioAuthentications[ip].length > 0) {
                while (db.pendingStudioAuthentications[ip].length > 0 && !user) {
                    const cookieObject = db.pendingStudioAuthentications[ip].shift();
                    if (db.getUnixTimestamp() - cookieObject[0] >= 30) {
                        // return res.sendStatus(403);
                    } else {
                        user = await db.findUserByCookie(cookieObject[1]);
                    }
                }
            }
            if (user) {
                if (typeof db.pendingStudioAuthentications[ip] == "object") {
                    if (!db.pendingStudioAuthentications[ip].includes(ip)) {
                        db.pendingStudioAuthentications[ip].push([db.getUnixTimestamp(), user.cookie]);
                    }
                } else {
                    db.pendingStudioAuthentications[ip] = [
                        [db.getUnixTimestamp(), user.cookie]
                    ];
                }
                res.send(user.userid.toString());
            } else {
                // res.status(403).send();
                res.send("1");
            }
        });

        async function getGamesT5(userid) {
            if (db.getSiteConfig().shared.home.showRecentlyPlayedGames == false) {
                return ``;
            }
            let out = `<div id="recently-visited-places" class="col-xs-12 container-list home-games">
            <div class="container-header">
                <h3>Recently Played</h3>
<a href="https://www.rbx2016.tk/games/?sortFilter=6" class="btn-secondary-xs btn-more btn-fixed-width">See All</a>            </div>
            
<ul class="hlist game-cards ">`;
            let games = await db.getUserRecentlyPlayedGames(userid);
            if (games.length == 0) {
                return ``;
            }
            games.reverse();
            for (let i = 0; i < games.length; i++) {
                const game = await db.getGame(games[i]);
                const creator = await db.getUser(game.creatorid);
                out += `<li class="list-item game-card">
                <div class="game-card-container">
                <a href="https://www.rbx2016.tk/games/${game.gameid}" class="game-card-link">
                    <div class="game-card-thumb-container">
                        <img class="game-card-thumb" src="${game.iconthumbnail}" thumbnail="{&quot;Final&quot;:true,&quot;Url&quot;:&quot;${game.iconthumbnail}&quot;,&quot;RetryUrl&quot;:null}" image-retry="">
                    </div>
                    <div class="text-overflow game-card-name" title="${game.gamename}" ng-non-bindable="">
                    ${game.gamename}
                    </div>
                    <div class="game-card-name-secondary">
                        ${game.playing} Playing
                    </div>
                    <div class="game-card-vote">
            <div class="vote-bar" data-voting-processed="true">
                                <div class="vote-thumbs-up">
                                    <span class="icon-thumbs-up"></span>
                                </div>
                                <div class="vote-container" data-upvotes="${game.likes.length}" data-downvotes="${game.dislikes.length}">
                                    <div class="vote-background"></div>
                                    <div class="vote-percentage" style="width: 0%;"></div>
                                    <div class="vote-mask">
                                        <div class="segment seg-1"></div>
                                        <div class="segment seg-2"></div>
                                        <div class="segment seg-3"></div>
                                        <div class="segment seg-4"></div>
                                    </div>
                                </div>
                                <div class="vote-thumbs-down">
                                    <span class="icon-thumbs-down"></span>
                                </div>
                            </div>
                        <div class="vote-counts">
                            <div class="vote-down-count">${game.dislikes.length}</div>
                            <div class="vote-up-count">${game.likes.length}</div>
                        </div>
                    </div>
                </a>
                <span class="game-card-footer">
                    <span class="text-label xsmall">By </span>
                    <a class="text-link xsmall text-overflow" href="https://www.rbx2016.tk/users/${creator.userid}/profile">${creator.username}</a>
                </span>
                </div>
            </li>`;
            }
            out += `
            </ul>
            </div>`;
            return out;
        }

        async function getGamesT6(userid) {
            if (db.getSiteConfig().shared.home.showFavoritedGames == false) {
                return ``;
            }
            let out = `<div id="my-favorties-games" class="col-xs-12 container-list home-games">
            <div class="container-header">
                <h3>My Favorites</h3>
        <a href="https://www.rbx2016.tk/users/${userid}/favorites#!/places" class="btn-secondary-xs btn-more btn-fixed-width">See All</a>            </div>
        
        
        <ul class="hlist game-cards ">`;
            const games = await db.getUserFavoritedGames(userid);
            if (games.length == 0) {
                return ``;
            }
            for (let i = 0; i < games.length; i++) {
                const game = await db.getGame(games[i]);
                const creator = await db.getUser(game.creatorid);
                out += `<li class="list-item game-card">
                <div class="game-card-container">
                <a href="https://www.rbx2016.tk/games/${game.gameid}" class="game-card-link">
                    <div class="game-card-thumb-container">
                        <img class="game-card-thumb" src="${game.iconthumbnail}" thumbnail="{&quot;Final&quot;:true,&quot;Url&quot;:&quot;${game.iconthumbnail}&quot;,&quot;RetryUrl&quot;:null}" image-retry="">
                    </div>
                    <div class="text-overflow game-card-name" title="${game.gamename}" ng-non-bindable="">
                    ${game.gamename}
                    </div>
                    <div class="game-card-name-secondary">
                        ${game.playing} Playing
                    </div>
                    <div class="game-card-vote">
            <div class="vote-bar" data-voting-processed="true">
                                <div class="vote-thumbs-up">
                                    <span class="icon-thumbs-up"></span>
                                </div>
                                <div class="vote-container" data-upvotes="${game.likes.length}" data-downvotes="${game.dislikes.length}">
                                    <div class="vote-background"></div>
                                    <div class="vote-percentage" style="width: 0%;"></div>
                                    <div class="vote-mask">
                                        <div class="segment seg-1"></div>
                                        <div class="segment seg-2"></div>
                                        <div class="segment seg-3"></div>
                                        <div class="segment seg-4"></div>
                                    </div>
                                </div>
                                <div class="vote-thumbs-down">
                                    <span class="icon-thumbs-down"></span>
                                </div>
                            </div>
                        <div class="vote-counts">
                            <div class="vote-down-count">${game.dislikes.length}</div>
                            <div class="vote-up-count">${game.likes.length}</div>
                        </div>
                    </div>
                </a>
                <span class="game-card-footer">
                    <span class="text-label xsmall">By </span>
                    <a class="text-link xsmall text-overflow" href="https://www.rbx2016.tk/users/${creator.userid}/profile">${creator.username}</a>
                </span>
                </div>
            </li>`;
            }
            out += `
            </ul>
            </div>`;
            return out;
        }

        app.get("/home", db.requireAuth, async (req, res) => {
            res.render("home", {
                ...await db.getRenderObject(req.user),
                gameFavorites: await getGamesT5(req.user.userid),
                recentGames: await getGamesT6(req.user.userid)
            });
        });

        app.get("/games", db.requireAuth, async (req, res) => {
            res.render("games", {
                ...await db.getRenderObject(req.user),
                keyword: req.query.Keyword || ""
            });
        });

        app.get("/Games.aspx", (req, res) => {
            res.redirect("/games");
        });

        async function getCatalogItems(keyword) {
            return new Promise(async returnPromise => {
                if (db.getSiteConfig().shared.pages.catalogEnabled == false) {
                    returnPromise(``);
                    return;
                }
                let catalogItems = []
                if (keyword){
                    catalogItems = await db.getCatalogItems(keyword);;
                }else {
                    catalogItems = await db.getCatalogItems2(0, 50);
                }
                if (catalogItems.length == 0) {
                    returnPromise(``);
                    return;
                }
                let out = ``;
                for (let i = 0; i < catalogItems.length; i++) {
                    const item = catalogItems[i];
                    let limitedHtml = ``;
                    if (item.unitsAvailableForConsumption > -1){
                        if (item.unquie) {
                            limitedHtml = `<img src="https://static.rbx2016.tk/d649b9c54a08dcfa76131d123e7d8acc.png" alt="Limited Unique" class="limited-overlay">`;
                        }else{
                            limitedHtml = `<img src="https://static.rbx2016.tk/793dc1fd7562307165231ca2b960b19a.png" alt="Limited Unique" class="limited-overlay">`;
                        }
                    }
                    const creator = await db.getUser(item.itemcreatorid);
                    const created = db.unixToDate(item.created);
                    const updated = db.unixToDate(item.updated);
                    out += `<div class="CatalogItemOuter SmallOuter">
                    <div class="SmallCatalogItemView SmallView">
                    <div class="CatalogItemInner SmallInner">    
                            <div class="roblox-item-image image-small" data-item-id="${item.id}" data-image-size="small">
                                <div class="item-image-wrapper">
                                    <a href="https://www.rbx2016.tk/catalog/${item.itemid}">
                                        <img title="${item.itemname}" alt="${item.itemname}" class="original-image " src="${item.itemimage}">
                                                                ${limitedHtml}
                                                                                    ${db.getUnixTimestamp() - item.created > 86400 ? `<img src="https://static.rbx2016.tk/b84cdb8c0e7c6cbe58e91397f91b8be8.png" alt="New">` : ``}
                                    </a>
                                </div>
                            </div>
                            
                        <div id="textDisplay">
                        <div class="CatalogItemName notranslate"><a class="name notranslate" href="https://www.rbx2016.tk/catalog/?id=${item.itemid}" title="${item.itemname}">${item.itemname}</a></div>
                        ${item.amount > 0 ? `<div class="robux-price"><span class="SalesText">was </span><span class="robux notranslate">${item.itemprice == 0 ? "FREE" : db.formatNumberS(item.itemprice)}</span></div>
                        <div id="PrivateSales"><span class="SalesText">now </span><span class="robux notranslate">???</span></div>
                </div>` : `<div class="robux-price"><span class="robux notranslate">${item.itemprice == 0 ? "FREE" : db.formatNumberS(item.itemprice)}</span></div>    `}        
                            <div class="CatalogHoverContent">
                                <div><span class="CatalogItemInfoLabel">Creator:</span> <span class="HoverInfo notranslate"><a href="https://www.rbx2016.tk/users/${creator.userid}/profile">${creator.username}</a></span></div>
                                <div><span class="CatalogItemInfoLabel">Updated:</span> <span class="HoverInfo">${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}</span></div>
                                <div><span class="CatalogItemInfoLabel">Sales:</span> <span class="HoverInfo notranslate">${item.itemowners.length}</span></div>
                                <div><span class="CatalogItemInfoLabel">Favorited:</span> <span class="HoverInfo">${item.itemfavorites.length} times</span></div>
                            </div>
                    </div>
                    </div>	
                    </div>`;
                }
                returnPromise(out);
            });
        }

        app.get("/catalog", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.pages.catalogEnabled == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.render("catalog", await db.getRenderObject(req.user));
        });

        app.get("/catalog/contents", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.pages.catalogEnabled == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            if (req.query.Category != "All" && req.query.Category != "Featured" && req.query.Category != "1" && req.query.Category != "0") {
                res.status(400).render("400", await db.getRenderObject(req.user));
                return;
            }
            if (req.query.Category == "Featured") {
                req.query.Category = "1";
            }else if (req.query.Category == "All") {
                req.query.Category = "0";
            }
            res.render("catalog_page", {
                ...(await db.getRenderObject(req.user)),
                catalogHtml: await getCatalogItems((!req.query.Keyword || req.query.Keyword == "") ? null : req.query.Keyword),
                category: req.query.Category || "1",
                legendShown: req.query.LegendExpanded == "true"
            });
        });

        app.get("/catalog/browse.aspx", db.requireAuth, async (req, res) => {
            const query = querystring.stringify(req.query);
            res.redirect(`/catalog/contents?${query}`); 
        });

        app.get("/catalog/:id", db.requireAuth, async (req, res) => {
            const id = parseInt(req.params.id);
            const asset = await db.getCatalogItem(id);
            if (!asset || (asset.deleted && !req.user.isAdmin && !req.user.isMod && req.user.userid != asset.creatorid)) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.redirect("/catalog/" + asset.itemid.toString() + "/" + db.filterText(asset.itemname).replaceAll(" ", "-"));
        });

        app.get("/catalog/:id/:name", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.assetsEnabled == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const id = parseInt(req.params.id);
            let asset = await db.getCatalogItem(id);
            let asset2 = null;
            let asset2Expected = false;
            if (asset.itemdecalid){
                asset2Expected = true;
                asset2 = await db.getAsset(asset.itemdecalid);
            }
            let asset3 = null;
            let asset3Expected = false;
            if (asset.itemmeshid){
                asset3Expected = true;
                asset3 = await db.getAsset(asset.itemmeshid);
            }
            if (asset2Expected){
                if (!asset2 || ((asset2.deleted || asset2.approvedBy == 0) && !req.user.isAdmin && !req.user.isMod && req.user.userid != asset2.creatorid)) {
                    if (req.user) {
                        res.status(404).render("404", await db.getRenderObject(req.user));
                    } else {
                        res.status(404).render("404", await db.getBlankRenderObject());
                    }
                    return;
                }
            }
            if (asset3Expected){
                if (!asset3 || ((asset3.deleted || asset3.approvedBy == 0) && !req.user.isAdmin && !req.user.isMod && req.user.userid != asset3.creatorid)) {
                    if (req.user) {
                        res.status(404).render("404", await db.getRenderObject(req.user));
                    } else {
                        res.status(404).render("404", await db.getBlankRenderObject());
                    }
                    return;
                }
            }
            const actualUrl = `/catalog/${asset.itemid}/${db.filterText2(asset.itemname).replaceAll(" ", "-")}`;
            if (req.url != actualUrl) {
                res.redirect(actualUrl);
                return;
            }
            const creator = await db.getUser(asset.itemcreatorid);
            const created = db.unixToDate(asset.created);
            const updated = db.unixToDate(asset.updated);
            if (!creator || creator.banned || asset.deleted || creator.inviteKey == "") {
                res.render("catalogitem", {
                    ...(await db.getRenderObject(req.user)),
                    id: asset.itemid,
                    icon: asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : `https://assetdelivery.rbx2016.tk/asset/?id=${asset.itemid}`,
                    price: asset.price || 0,
                    name: "[ Content Deleted ]",
                    name2: "[ Content Deleted ]".replaceAll(" ", "-"),
                    desc: "[ Content Deleted ]",
                    genre: asset.itemgenre,
                    likes: asset.itemlikes.length,
                    dislikes: asset.itemdislikes.length,
                    userVoted: await db.userLikeStatus(req.user.userid, asset.id),
                    favorites: asset.itemfavorites.length,
                    userFavorited: await db.userHasFavorited(req.user.userid, asset.id),
                    creatorname: creator.username,
                    creatorid: creator.userid,
                    sold: asset.itemowners.length,
                    owned: asset.itemowners.includes(req.user.userid),
                    likeratio: asset.itemlikes.length == 0 && asset.itemdislikes.length == 0 ? 50 : asset.itemlikes.length / (asset.itemlikes.length + asset.itemdislikes.length),
                    created: `${created.getDate()}/${created.getMonth()}/${created.getFullYear()}`,
                    updated: `${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`,
                    onSale: asset.onSale,
                    isCreator: req.user.userid == asset.itemcreatorid,
                    type: asset.itemtype
                });
                return;
            }
            res.render("catalogitem", {
                ...(await db.getRenderObject(req.user)),
                id: asset.itemid,
                genre: asset.itemgenre,
                icon: asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : `https://assetdelivery.rbx2016.tk/asset/?id=${asset.itemdecalid}`,
                price: asset.price || 0,
                name: asset.itemname,
                name2: asset.itemname.replaceAll(" ", "-"),
                desc: asset.itemdesc,
                likes: asset.itemlikes.length,
                dislikes: asset.itemdislikes.length,
                userVoted: await db.userLikeStatus(req.user.userid, asset.id),
                favorites: asset.itemfavorites.length,
                userFavorited: await db.userHasFavorited(req.user.userid, asset.id),
                creatorname: creator.username,
                creatorid: creator.userid,
                sold: asset.itemowners.length,
                owned: asset.itemowners.includes(req.user.userid),
                likeratio: asset.itemlikes.length == 0 && asset.itemdislikes.length == 0 ? 50 : asset.itemlikes.length / (asset.itemlikes.length + asset.itemdislikes.length),
                created: `${created.getDate()}/${created.getMonth()}/${created.getFullYear()}`,
                updated: `${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`,
                onSale: asset.onSale,
                isCreator: req.user.userid == asset.itemcreatorid,
                type: asset.itemtype
            });
        });

        app.get("/catalog/:itemid", db.requireAuth, async (req, res) => {
            const itemid = parseInt(req.params.itemid);
            const item = await db.getCatalogItem(itemid);
            if (!item) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.redirect(`/catalog/${item.itemid}/${db.filterText2(item.itemname).replaceAll(" ", "-")}`);
        });

        app.get("/catalog/:itemid/:itemname", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.pages.catalogEnabled == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const itemid = parseInt(req.params.itemid);
            const item = await db.getCatalogItem(itemid);
            if (!item) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const actualUrl = `/catalog/${item.itemid}/${db.filterText2(item.itemname).replaceAll(" ", "-")}`;
            if (req.url != actualUrl) {
                res.redirect(actualUrl);
                return;
            }
            const creator = await db.getUser(item.itemcreatorid);
            res.render("catalogitem", {
                ...(await db.getRenderObject(req.user)),
                itemname: item.itemname,
                itemname2: db.filterText2(item.itemname).replaceAll(" ", "-"),
                itemid: item.itemid,
                itemthumb: item.itemthumb,
                itemcreatorid: creator.userid,
                itemcreatorusername: creator.username,
                itemprice: item.itemprice,
                itemdesc: item.itemdescription,
                currenttime: db.formatAMPMFull(new Date()),
                itemfavorites: item.itemfavorites,

                owned: false, // TODO: Implement this.
            });
        });

        if (db.getSiteConfig().shared.ADMIN_AdminPanelEnabled == true) {
            const admiPath = db.getSiteConfig().shared.ADMIN_AdminPanelRoute;
            const adminNav = `<nav>
            <h5 class="logo">Admin Dashboard</h5>
            <ul>
                <li>
                    <b>Information</b>
                    <ul>
                        <li>
                            <a href="${admiPath}">Dashboard</a>
                        </li>
                        <li>
                            <a href="${admiPath}/statistics">Statistics</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <b>Configuration</b>
                    <ul>
                        <li>
                            <a href="${admiPath}/fflags">FFlag Settings</a>
                        </li>
                        <li>
                            <a href="${admiPath}/emailsettings">Email Settings</a>
                        </li>
                        <li>
                            <a href="${admiPath}/restartarbiter">Restart Arbiter</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <b>People</b>
                    <ul>
                        <li>
                            <a href="${admiPath}/invitekeys">Invite Keys</a>
                        </li>
                        <li>
                            <a href="${admiPath}/usercomputers">User Computers</a>
                        </li>
                        <li>
                            <a href="${admiPath}/usermoderation">User Moderation</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <b>Catalog</b>
                    <ul>
                        <li>
                            <a href="${admiPath}/assetmoderation">Asset Moderation</a>
                        </li>
                        <li>
                            <a href="${admiPath}/grantitem">Grant Item</a>
                        </li>
                        <li>
                            <a href="${admiPath}/massupload">Mass Upload</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <b>Jobs</b>
                    <ul>
                        <li>
                            <a href="${admiPath}/rccrunscript">Run Script</a>
                        </li>
                        <li>
                            <a href="${admiPath}/rccjobs">Info</a>
                        </li>
                        <li>
                            <a href="${admiPath}/rcckilljob">Kill Job</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>`;

            app.get(admiPath, db.requireAuth, db.requireMod, async (req, res) => {
                res.render("admin/index", {
                    ...await db.getRenderObject(req.user),
                    cpuUsage: await db.getCpuUsage(),
                    jobs: (await db.getJobs()).length,
                    admiPath: db.getSiteConfig().shared.ADMIN_AdminPanelRoute,
                    adminNav: adminNav
                });
            });

            app.get(admiPath + "/:page", db.requireAuth, db.requireMod, async (req, res) => {
                const page = req.params.page;
                const bp = path.resolve(`${__dirname}/../views/admin/`) + path.sep;
                const fp = path.resolve(bp + page + ".ejs");
                if (!fp.startsWith(bp)) {
                    res.status(400).render("400", await db.getRenderObject(req.user));
                }
                if (!req.user.isAdmin && !db.getSiteConfig().shared.MODS_ACCESS.includes(page)) {
                    res.status(403).render("403", await db.getRenderObject(req.user));
                    return;
                }
                if (fs.existsSync(fp) && page != "index") {
                    if (req.params.page == "statistics") {
                        let gameServicesEnabled = 0;
                        let totalGameServices = 0;
                        for (const value of Object.values(db.getSiteConfig().shared.games)) {
                            totalGameServices++;
                            if (!value) {
                                continue;
                            }
                            gameServicesEnabled++;
                        }

                        let userServicesEnabled = 0;
                        let totalUserServices = 0;
                        for (const value of Object.values(db.getSiteConfig().shared.users)) {
                            totalUserServices++;
                            if (!value) {
                                continue;
                            }
                            userServicesEnabled++;
                        }

                        const diskSpace = await db.getDiskSpace();

                        res.render(`admin/${page}`, {
                            ...await db.getRenderObject(req.user),
                            cpuUsage: await db.getCpuUsage(),
                            jobs: (await db.getJobs()).length,
                            admiPath: admiPath,
                            adminNav: adminNav,

                            // Statistics
                            gamesEnabled: `${Math.round(gameServicesEnabled / totalGameServices * 100)}% Enabled`,
                            playing: db.formatNumber(await db.countPlayingPlayers()),
                            robux: db.formatNumber(await db.getTotalUserRobux()),
                            richest: (await db.getRichestUser()).userid,
                            gamesSize: db.formatBytes(await db.getGamesSize()),
                            places: db.formatNumber(await db.countGames()),
                            usersEnabled: `${Math.round(userServicesEnabled / totalUserServices * 100)}% Enabled`,
                            users: db.formatNumber(await db.countUsers()),
                            games: db.formatNumber(await db.countActiveGames()),
                            freeSpace: `${Math.round((diskSpace.size - diskSpace.free) / diskSpace.size * 100)}% Used`,
                            catalogItems: db.formatNumber(await db.countCatalogItems()),
                            catalogEnabled: db.getSiteConfig().shared.pages.catalogEnabled ? "Enabled" : "Disabled"
                        });
                        return;
                    } else if (req.params.page == "rccrunscript") {
                        if (db.getSiteConfig().backend.ADMIN_AdminCanExecuteJobScripts == false && db.getSiteConfig().backend.ADMIN_AdminCanExecuteNeJobScripts == false) {
                            res.status(404).render("404", await db.getRenderObject(req.user));
                            return;
                        }
                        let jobs = await db.getJobs();
                        if (jobs.length > 15) {
                            jobs = jobs.slice(jobs.length - 15, jobs.length);
                        }
                        let someJobs = "";
                        for (let i = 0; i < jobs.length; i++) {
                            const jobId = jobs[i];
                            someJobs += `<option value="${jobId}">${jobId}</option>`
                        }
                        res.render(`admin/${page}`, {
                            ...await db.getRenderObject(req.user),
                            cpuUsage: await db.getCpuUsage(),
                            jobs: (await db.getJobs()).length,
                            admiPath: admiPath,
                            adminNav: adminNav,

                            // RCCRunScript
                            someJobs: someJobs
                        });
                        return;
                    }

                    res.render(`admin/${page}`, {
                        ...await db.getRenderObject(req.user),
                        cpuUsage: await db.getCpuUsage(),
                        jobs: (await db.getJobs()).length,
                        admiPath: admiPath,
                        adminNav: adminNav
                    });
                } else {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                }
            });
        }

        app.get("/not-approved", db.requireAuth, async (req, res) => {
            if (!req.user.banned) {
                res.redirect("/home");
                return;
            }
            res.render("banned", await db.getRenderObject(req.user, true));
        });

        app.get("/my/account", db.requireAuth, async (req, res) => {
            res.render("account", {
                ...(await db.getRenderObject(req.user)),
                price: db.formatNumberS(db.getSiteConfig().shared.usernameConfiguration.changeUsernamePrice)
            });
        });

        app.get("/games/refer", async (req, res) => {
            const placeid = req.query.PlaceId;
            res.redirect(`/games/${placeid}/`);
        });

        app.get("/games/moreresultscached", async (req, res) => {
            const SortFilter = parseInt(req.query.SortFilter);
            const TimeFilter = parseInt(req.query.TimeFilter);
            const GenreID = parseInt(req.query.GenreID);
            const MinBCLevel = parseInt(req.query.MinBCLevel);
            const StartRows = parseInt(req.query.StartRows);
            const MaxRows = parseInt(req.query.MaxRows);
            const IsUserLoggedIn = req.query.IsUserLoggedIn == "true";
            const NumberOfRowsToOccupy = parseInt(req.query.NumberOfRowsToOccupy);
            const NumberOfColums = parseInt(req.query.NumberOfColums);
            const InHorizontalScrollMode = req.query.InHorizontalScrollMode == "true";
            const DeviceTypeId = parseInt(req.query.DeviceTypeId);
            const AdSpan = parseInt(req.query.AdSpan);
            const AdAlignment = parseInt(req.query.AdAlignment);
            const PersonalizedUniverseId = parseInt(req.query.PersonalizedUniverseId);

            const Keyword = req.query.Keyword;

            let games = null
            if (Keyword) {
                games = await db.findGames(Keyword);
            } else {
                games = await db.getPublicGames();
            }
            let genre = "All"
            if (GenreID) {
                genre = db.genres[GenreID]
            }

            let out = "";
            for (let i = 0; i < games.length; i++) {
                if (i < StartRows || i > MaxRows || games[i].genre != genre) {
                    continue;
                }
                const game = games[i];
                const creator = await db.getUser(game.creatorid);
                out += `<li class="list-item game-card">
                <div class="game-card-container">
                    <a href="https://www.rbx2016.tk/games/${game.gameid}" class="game-card-link">
                        <div class="game-card-thumb-container">
                            <img class="game-card-thumb"
                                src="${game.iconthumbnail}"
                                thumbnail="{&quot;Final&quot;:true,&quot;Url&quot;:&quot;${game.iconthumbnail}&quot;,&quot;RetryUrl&quot;:null}"
                                image-retry />
                        </div>
                        <div class="text-overflow game-card-name" title="${game.gamename}" ng-non-bindable>
                            ${game.gamename}
                        </div>
                        <div class="game-card-name-secondary">
                        ${game.playing} Playing
                        </div>
                        <div class="game-card-vote">
                            <div class="vote-bar" data-voting-processed="false">
                                <div class="vote-thumbs-up">
                                    <span class="icon-thumbs-up"></span>
                                </div>
                                <div class="vote-container" data-upvotes="${game.likes.length}" data-downvotes="${game.dislikes.length}">
                                    <div class="vote-background "></div>
                                    <div class="vote-percentage"></div>
                                    <div class="vote-mask">
                                        <div class="segment seg-1"></div>
                                        <div class="segment seg-2"></div>
                                        <div class="segment seg-3"></div>
                                        <div class="segment seg-4"></div>
                                    </div>
                                </div>
                                <div class="vote-thumbs-down">
                                    <span class="icon-thumbs-down"></span>
                                </div>
                            </div>
                            <div class="vote-counts">
                                <div class="vote-down-count">${game.dislikes.length}</div>
                                <div class="vote-up-count">${game.likes.length}</div>
                            </div>
                        </div>
                    </a>
                    <span class="game-card-footer">
                        <span class="text-label xsmall">By </span>
                        <a class="text-link xsmall text-overflow" href="https://www.rbx2016.tk/users/${creator.userid}/profile">${creator.username}</a>
                    </span>
                </div>
            </li>
            `;
            }
            res.send(out);
        });

        app.get("/login/RequestAuth.ashx", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                return res.status(403).send("User is not authorized.");
            }
            res.send("http://www.rbx2016.tk/Login/Negotiate.ashx?suggest=" + await db.generateUserTokenByCookie(req.user.cookie));
        });

        app.get("/games/getgameinstancesjson", async (req, res) => {
            const placeId = parseInt(req.query.placeId);
            const startindex = parseInt(req.query.startindex);

            const game = await db.getGame(placeId);
            if (!game) {
                return res.status(404).json({
                    "Collection": []
                });
            }
            let servers = await db.getJobsByGameId(placeId);

            if (!servers) {
                servers = [];
            } else if (servers.length > startindex + 10) {
                servers = servers.splice(startindex, 10)
            }

            let instances = [];
            for (let i = 0; i < servers.length; i++) {
                const server = servers[i];

                const plrs = await db.getPlayingPlayers(game.gameid);
                let players = [];
                for (let j = 0; j < plrs.length; j++) {
                    const plr = plrs[j];
                    players.push({
                        "Id": plr.userid,
                        "Username": plr.username,
                        // "Thumbnail": "https://images.rbx2016.tk/e6ea624485b22e528cc719f04560fe78Headshot.png",
                        // "AssetId": plr.userid,
                        // "AssetHash": plrs.userid.toString(),
                        // "AssetTypeId": 0,
                        "Url": "https://images.rbx2016.tk/e6ea624485b22e528cc719f04560fe78Headshot.png",
                    })
                }

                let jobId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
                try {
                    jobId = server.getJobId()
                } catch {}

                instances.push({
                    "Capacity": game.maxplayers,
                    "Ping": 0, // TODO: Actually make work.
                    "FPS": 60, // TODO: Actually make work.
                    "ShowSlowGameMessage": false,
                    "Guid": jobId,
                    "PlaceId": game.gameid,
                    "CurrentPlayers": players
                })
            }

            res.json({
                "Collection": instances
            });
        });

        app.get("/games/:gameid", db.requireAuth, async (req, res) => {
            const gameid = parseInt(req.params.gameid);
            const game = await db.getGame(gameid);
            if (!game) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.redirect("/games/" + game.gameid.toString() + "/" + db.filterText(game.gamename).replaceAll(" ", "-"));
        });

        app.get("/game-pass/:id", db.requireAuth, async (req, res) => {
            const id = parseInt(req.params.id);
            const gamepass = await db.getGamepass(id);
            if (!gamepass) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.redirect("/game-pass/" + gamepass.id.toString() + "/" + db.filterText(gamepass.name).replaceAll(" ", "-"));
        });

        app.get("/library/:id", db.requireAuth, async (req, res) => {
            const id = parseInt(req.params.id);
            const asset = await db.getAsset(id);
            if (!asset || (asset.deleted && !req.user.isAdmin && !req.user.isMod && req.user.userid != asset.creatorid)) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            res.redirect("/library/" + asset.id.toString() + "/" + db.filterText(asset.name).replaceAll(" ", "-"));
        });

        async function getGamesT1(userid) {
            let out = ``;
            const games = await db.getGamesByCreatorId(userid);
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                const gamename2 = db.filterText2(game.gamename).replaceAll(" ", "-");
                const created = db.unixToDate(game.created);
                const updated = db.unixToDate(game.updated);
                out += `<table class="item-table" data-item-id="${game.gameid}" data-type="game" data-universeid="{game.gameid}"
                data-developerstats-url="https://create.rbx2016.tk/creations/experiences/{game.gameid}/stats">
                <tr>
                    <td class="image-col">
                        <a href="https://www.rbx2016.tk/games/{game.gameid}/${gamename2}" class="game-image">
                            <img src="${game.iconthumbnail}"
                                alt="${game.gamename}" />
                        </a>
                    </td>
                    <td class="name-col">
                        <a class="title" href="javascript:;">${game.gamename}</a>
                        <table class="details-table">
                            <tr>
                                <td class="item-date"><span>Updated:</span>${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}</td>
                            </tr>
                        </table>
                    </td>
                    <td class="stats-col-games">
                        <div class="totals-label">Total Visitors:<span>0</span></div>
                        <div class="totals-label">Last 7 days:<span>0</span></div>
                    </td>
                    <td class="edit-col">
                        <a class="roblox-edit-button btn-control btn-control-large" href="javascript:;">Edit</a>
                    </td>
                    <td class="menu-col">
                        <div class="gear-button-wrapper">
                            <a href="#" class="gear-button"></a>
                        </div>
                    </td>
                </tr>
            </table>
            <div class="separator"></div>`;
            }
            return out;
        }

        async function getGamesT2(user) {
            let out = ``;
            const games = await db.getGamesByCreatorId(user.userid);
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                const gamename2 = db.filterText2(game.gamename).replaceAll(" ", "-");
                const created = db.unixToDate(game.created);
                const updated = db.unixToDate(game.updated);
                out += `<div class="asset model" id="newasset"
                onclick="document.location.href ='http://www.rbx2016.tk/ide/publish/editplace?placeId=${game.gameid}&t=${user.cookie}';">
                <a class="model-image">
                    <img id="newModelImage" class="modelThumbnail" src="${game.iconthumbnail}" alt="${game.gamename}" />
                </a>
                <p class="item-name-container ellipsis-overflow">${game.gamename}</p>
            </div>`;
            }
            return out;
        }

        app.get("/ide/publish/editplace", db.requireAuth2, async (req, res) => {
            if (db.getSiteConfig().shared.games.canEditGames == false) {
                res.status(403).send("Editing games is currently disabled.")
                return;
            }
            const placeId = parseInt(req.query.placeId);
            const t = req.query.t;
            let user = req.user
            if (!user) {
                user = await db.findUserByCookie(t);
            }
            if (!user) {
                res.sendStatus(401);
                return;
            }
            const game = await db.getGame(placeId);
            if (!game) {
                res.sendStatus(404);
                return;
            }
            if (game.creatorid != user.userid) {
                res.sendStatus(403);
                return;
            }
            res.render("publishing", {
                ...await db.getRenderObject(user),
                gamename: db.filterText2(game.gamename),
                gamedesc: game.description,
                gamegenre: game.genre || "All",
                gameid: db.toString(game.gameid),
                newUpload: "False"
            });
        });

        app.get("/build/gamesbycontext", db.requireAuth, async (req, res) => {
            res.render("publishedgames", {
                ...await db.getRenderObject(req.user),
                games: await getGamesT1(req.user.userid)
            })
        });

        app.get("/IDE/Upload.aspx", (req, res) => {
            res.redirect("/ide/publishas");
        });

        app.get("/ide/publishas", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                return res.status(401).send("User is not authorized.");
            }
            res.render("publishas", {
                ...await db.getRenderObject(req.user),
                games: await getGamesT2(req.user),
            });
        });

        app.get("/ide/publish/newplace", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                return res.status(401).send("User is not authorized.");
            }
            res.render("publishnewplace", await db.getRenderObject(req.user));
        });

        app.get("/ide/publish", db.requireAuth2, async (req, res) => {
            if (!req.user) {
                return res.status(401).send("User is not authorized.");
            }
            res.render("publish", {
                ...await db.getRenderObject(req.user),
                games: await getGamesT1(req.user.userid)
            });
        });

        app.get("/ide/welcome", db.requireAuth2, (req, res) => {
            if (req.user) {
                res.send();
            } else {
                res.redirect("/My/Places.aspx&showlogin=True")
            }
        });

        app.post("/ide/publish/newplace", db.requireAuth2, async (req, res) => {
            if (db.getSiteConfig().shared.games.canCreateGames == false) {
                res.status(403).send("Creating games is currently disabled.")
                return;
            }
            let user = req.user;
            if (!user) {
                if (typeof req.body.__RequestVerificationToken != "undefined") {
                    user = await db.getUserByCsrfToken(req.body.__RequestVerificationToken)
                }
                if (!user) {
                    return res.status(401).send("Not logged in.");
                }
            }
            const userGames = await db.getGamesByCreatorId(req.user.userid);
            if (userGames.length >= (req.user.isAdmin ? db.getSiteConfig().shared.maxGamesPerUser.admin : db.getSiteConfig().shared.maxGamesPerUser.user)) {
                res.status(403).send("You have reached the maximum number of games you can create.");
                return;
            }
            const created = await db.createGame(req.body.Name, req.body.Description, user.userid);
            res.render("publishing", {
                ...await db.getRenderObject(req.user),
                gamename: db.filterText2(req.body.Name),
                gamedesc: req.body.Description,
                gamegenre: req.body.Genre || "All",
                gameid: db.toString(created),
                newUpload: "True"
            });
        });

        app.post("/gametransactions/settransactionstatuscomplete", (req, res) => {
            const receipt = req.body.receipt;
            console.log("GOT RECEIPT: " + receipt);
        });

        app.get("/gametransactions/getpendingtransactions", async (req, res) => {
            const PlaceId = parseInt(req.query.PlaceId);
            const PlayerId = parseInt(req.query.PlayerId);

            const products = await db.getRecipes(PlaceId, PlayerId);
            let out = [];
            for (let i = 0; i < products.length; i++) {
                const recipe = products[i];
                const product = await db.getDevProduct(recipe.id);
                out.push({
                    playerId: PlayerId,
                    placeId: PlaceId,
                    receipt: recipe.recipe,

                    actionArgs: [{
                        Key: "productId",
                        Value: product.id.toString()
                    }, {
                        Key: "currencyTypeId",
                        Value: product.currency.toString()
                    }, {
                        Key: "unitPrice",
                        Value: product.price.toString()
                    }]
                });
            }
            res.json(out);
        });

        app.post("/game/toggle-profile", db.requireAuth, async (req, res) => {
            const placeId = parseInt(req.body.placeId);
            const addToProfile = req.body.addToProfile == "true";
            const game = await db.getGame(placeId);
            if (!game) {
                return res.status(404).send("Game not found.");
            }
            if (game.creatorid != req.user.userid) {
                return res.status(403).send("You are not the creator of this game.");
            }
            await db.setGameProperty(placeId, "showOnProfile", addToProfile);
            res.json({
                isValid: true,
                data: {
                    inShowcase: addToProfile
                }
            });
        });

        app.get("/games/:gameid/:gamename", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.games.canViewGames == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const gameid = parseInt(req.params.gameid);
            const game = await db.getGame(gameid);
            if (!game) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const actualUrl = `/games/${game.gameid}/${db.filterText2(game.gamename).replaceAll(" ", "-")}`;
            if (req.url != actualUrl) {
                res.redirect(actualUrl);
                return;
            }
            const creator = await db.getUser(game.creatorid);
            if (!creator || creator.banned || game.deleted || creator.inviteKey == "") {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }

            let gamepassesHtml = `<div id="rbx-game-passes" class="container-list game-dev-store game-passes">
            <div class="container-header">
                <h3>Passes for this game</h3>
            </div>
            <ul id="rbx-passes-container" class="hlist store-cards gear-passes-container">
                    
                    `;
            let hadGamepass = false;
            let gamepasses = await db.getGamepasses(gameid);
            for (let i = 0; i < gamepasses.length; i++) {
                const gamepass = gamepasses[i];
                if (!gamepass.onSale) {
                    continue;
                }
                if (!hadGamepass) {
                    hadGamepass = true;
                }
                const creator = await db.getUser(gamepass.creatorid);
                let html1 = `<div class="store-card-footer">
                                <button class="PurchaseButton btn-buy-md btn-full-width rbx-gear-passes-purchase" data-item-id="${gamepass.id}" data-item-name="${gamepass.name}" data-product-id="${gamepass.id}" data-expected-price="${gamepass.price}" data-asset-type="Game Pass" data-bc-requirement="" data-expected-seller-id="${creator.userid}" data-seller-name="${creator.username}" data-expected-currency="1">
                                    <span>Buy</span>
                                </button>
                        </div>`;
                if (gamepass.owners.includes(req.user.userid)) {
                    html1 = `<div class="store-card-footer">
                                <h5>Owned</h5>
                        </div>`
                }
                gamepassesHtml += `<li class="list-item">
                <div class="store-card">
                    <a href="https://www.rbx2016.tk/game-pass/${gamepass.id}" class="gear-passes-asset"><img class="" src="${gamepass.thumbnailurl}"></a>
                    <div class="store-card-caption">
                        <div class="text-overflow store-card-name" title="${gamepass.name}">
                            ${gamepass.name}
                        </div>

                        <div class="store-card-price">
                            <span class="icon-robux-16x16"></span>
                            <span class="text-robux">${gamepass.price != 0 ? gamepass.price : "FREE"}</span>
                        </div>

                        ${html1}                        
                    </div>
                </div>
            </li>`;
            }
            gamepassesHtml += `</ul>                        
            </div>`
            if (gamepasses.length == 0 || !hadGamepass) {
                gamepassesHtml = `<p class="section-content-off">
                This game does not sell any virtual items or power-ups.
            </p>`;
            }
            if (db.getSiteConfig().shared.gamepassesEnabled == false) {
                gamepassesHtml = `<p class="section-content-off">
                Gamepasses are currently disabled.
            </p>`;
            }

            const created = db.unixToDate(game.created);
            const updated = db.unixToDate(game.updated);
            res.render("game", {
                ...(await db.getRenderObject(req.user)),
                gameid: game.gameid,
                gamename: game.gamename,
                gamename2: game.gamename.replaceAll(" ", "-"),
                desc: game.description,
                likes: game.likes.length,
                dislikes: game.dislikes.length,
                userVoted: await db.userLikeStatus(req.user.userid, game.gameid),
                favorites: game.favorites.length,
                userFavorited: await db.userHasFavorited(req.user.userid, game.gameid),
                serversize: 12,
                gameOnProfile: game.showOnProfile,
                creatorname: creator.username,
                creatorid: game.creatorid,
                visits: game.visits,
                genre: game.genre,
                playing: game.playing,
                created: `${created.getDate()}/${created.getMonth()}/${created.getFullYear()}`,
                updated: `${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`,
                canManage: req.user.userid == creator.userid && db.getSiteConfig().shared.games.canManageGames,
                canCopy: (game.copiable || req.user.userid == creator.userid) && db.getSiteConfig().shared.games.canEditGames,
                canEdit: db.getSiteConfig().shared.games.canEditGames,
                canPlay: db.getSiteConfig().shared.games.canPlayGames && (game.isPublic || req.user.userid == creator.userid),
                isPlayServiceDown: !db.getSiteConfig().shared.games.canPlayGames,
                gamepassesHtml: gamepassesHtml,
            });
        });

        app.post("/api/item.ashx", db.requireAuth, async (req, res) => {
            const rqtype = req.query.rqtype;
            if (rqtype == "purchase") {
                const productId = parseInt(req.query.productID);
                const expectedCurrency = parseInt(req.query.expectedCurrency);
                const expectedPrice = parseInt(req.query.expectedPrice);
                const expectedSellerId = parseInt(req.query.expectedSellerID);
                const gamepass = await db.getGamepass(productId);
                
                if (!gamepass) {
                    const item = await db.getCatalogItem(productId);
                    if (!item){
                        res.status(404).json({});
                        return;
                    }
                    if (db.getSiteConfig().shared.pages.catalogEnabled == false) {
                        res.status(404).json({});
                        return;
                    }
    
                    if (item.itemcreatorid != expectedSellerId) {
                        res.status(401).json({});
                        return;
                    }
                    if (item.itemprice != expectedPrice) {
                        res.status(403).json({});
                        return;
                    }
                    if (item.currency != expectedCurrency) {
                        res.status(403).json({});
                        return;
                    }
                    if (await db.buyCatalogItem(req.user, productId)) {
                        res.json({
                            isValid: true,
                            data: {
                                name: item.itemname,
                                productId: item.itemid
                            }
                        });
                    } else {
                        res.status(500).json({});
                    }    
                    return;
                }

                if (db.getSiteConfig().shared.gamepassesEnabled == false) {
                    res.status(404).json({});
                    return;
                }

                if (gamepass.creatorid != expectedSellerId) {
                    res.status(401).json({});
                    return;
                }
                if (gamepass.price != expectedPrice) {
                    res.status(403).json({});
                    return;
                }
                if (gamepass.currency != expectedCurrency) {
                    res.status(403).json({});
                    return;
                }
                if (await db.buyGamepass(req.user, productId)) {
                    res.json({
                        isValid: true,
                        data: {
                            name: gamepass.name,
                            productId: gamepass.id
                        }
                    });
                } else {
                    res.status(500).json({});
                }
            } else {
                res.status(400).json({});
            }
        });

        app.get("/My/Money.aspx", db.requireAuth, async (req, res) => {
            res.render("mymoney", {
                ...(await db.getRenderObject(req.user)),
                tixExchangeRate: db.getSiteConfig().backend.tix.exchangeRate
            });
        });

        app.post("/v1/convert/tix", db.requireAuth, async (req, res) => {
            const tix = parseInt(req.body.tix);
            if (await db.convertCurrency(req.user.userid, "tix", tix)) {
                res.redirect("/My/Money.aspx");
            } else {
                res.send("Something went wrong, please make sure that the amount you provided is valid and try again.");
            }
        });

        app.post("/v1/convert/robux", db.requireAuth, async (req, res) => {
            const robux = parseInt(req.body.robux);
            if (await db.convertCurrency(req.user.userid, "robux", robux)) {
                res.redirect("/My/Money.aspx");
            } else {
                res.send("Something went wrong, please make sure that the amount you provided is valid and try again.");
            }
        });

        app.post("/v1/delete/item", db.requireAuth, async (req, res) => {
            const itemId = parseInt(req.body.itemId);
            await db.deleteItemFromInventory(req.user.userid, itemId);
            res.send("OK");
        });

        app.post("/v1/password/change", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.passwordConfiguration.canChangePassword != true){
                res.status(401).send("Changing usernames is currently disabled.");
                return;
            }

            const cpass = req.body.cpass;
            const npass = req.body.npass;

            if (!bcrypt.compareSync(cpass, await db.getUserProperty(req.user.userid, "password"))) {
                res.status(401).send("Unauthorized");
                return;
            }

            if (await db.setUserProperty(req.user.userid, "password", bcrypt.hashSync(npass, 10))){
                res.send("OK");
            }else{
                res.status(500).send("Something went wrong, please try again.");
            }
        });
        
        app.post("/v1/username/change", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.usernameConfiguration.canChangeUsername != true){
                res.status(401).send("Changing usernames is currently disabled.");
                return;
            }
            const username = req.body.username;
            const cpass = req.body.cpass;

            if (!username || username.length < 3 || username.length > 20) {
                res.status(400).send("Invalid username");
                return;
            }

            if (await db.userExists(username)) {
                res.status(400).send("Username already exists");
                return;
            }

            if (!bcrypt.compareSync(cpass, await db.getUserProperty(req.user.userid, "password"))) {
                res.status(401).send("Unauthorized");
                return;
            }

            const robux = await db.getUserProperty(req.user.userid, "robux");
            if (robux < db.getSiteConfig().shared.usernameConfiguration.changeUsernamePrice) {
                res.status(403).send("Not enough robux");
                return;
            }

            const finalUsername = db.filterText3(username);
            
            if (await db.setUserProperty(req.user.userid, "username", finalUsername)){
                await db.setUserProperty(req.user.userid, "robux", robux - db.getSiteConfig().shared.usernameConfiguration.changeUsernamePrice);
                res.send("OK");
            }else{
                res.status(500).send("Something went wrong");
            }
        });

        app.get("/game-pass/:id/:name", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.gamepassesEnabled == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const id = parseInt(req.params.id);
            const gamepass = await db.getGamepass(id);
            if (!gamepass) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            if (!gamepass.onSale && req.user.userid != gamepass.creatorid) {
                return res.status(404).render("404", await db.getRenderObject(req.user));
            }
            const actualUrl = `/game-pass/${gamepass.id}/${db.filterText2(gamepass.name).replaceAll(" ", "-")}`;
            if (req.url != actualUrl) {
                res.redirect(actualUrl);
                return;
            }
            const creator = await db.getUser(gamepass.creatorid);
            if (!creator || creator.banned || gamepass.deleted || creator.inviteKey == "") {
                res.status(404).json({});
                return;
            }

            const game = await db.getGame(gamepass.gameid);

            const created = db.unixToDate(gamepass.created);
            const updated = db.unixToDate(gamepass.updated);
            res.render("gamepass", {
                ...(await db.getRenderObject(req.user)),
                id: gamepass.id,
                icon: gamepass.thumbnailurl,
                gameid: game.gameid,
                gamename: game.gamename,
                gamegenre: game.genre,
                gamethumb: game.iconthumbnail,
                price: gamepass.price,
                name: gamepass.name,
                name2: gamepass.name.replaceAll(" ", "-"),
                desc: gamepass.description,
                likes: gamepass.likes.length,
                dislikes: gamepass.dislikes.length,
                userVoted: await db.userLikeStatus(req.user.userid, gamepass.id),
                favorites: gamepass.favorites.length,
                userFavorited: await db.userHasFavorited(req.user.userid, gamepass.id),
                creatorname: creator.username,
                creatorid: game.creatorid,
                sold: gamepass.sold,
                owned: gamepass.owners.includes(req.user.userid),
                likeratio: gamepass.likes.length == 0 && gamepass.dislikes.length == 0 ? 50 : gamepass.likes.length / (gamepass.likes.length + gamepass.dislikes.length),
                created: `${created.getDate()}/${created.getMonth()}/${created.getFullYear()}`,
                updated: `${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`,
                onSale: gamepass.onSale,
                isCreator: req.user.userid == gamepass.creatorid,
            });
        });

        app.get("/library/:id/:name", db.requireAuth, async (req, res) => {
            if (db.getSiteConfig().shared.assetsEnabled == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const id = parseInt(req.params.id);
            const asset = await db.getAsset(id);
            if (!asset || ((asset.deleted || asset.approvedBy == 0) && !req.user.isAdmin && !req.user.isMod && req.user.userid != asset.creatorid)) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const actualUrl = `/library/${asset.id}/${db.filterText2(asset.name).replaceAll(" ", "-")}`;
            if (req.url != actualUrl) {
                res.redirect(actualUrl);
                return;
            }
            const creator = await db.getUser(asset.creatorid);
            if (!creator || creator.banned || asset.deleted || creator.inviteKey == "") {
                const created = db.unixToDate(asset.created);
                const updated = db.unixToDate(asset.updated);
                res.render("asset", {
                    ...(await db.getRenderObject(req.user)),
                    id: asset.id,
                    icon: asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : asset.type == "Audio" ? "https://static.rbx2016.tk/eadc8982548a4aa4c158ba1dad61ff14.png" : asset.type == "Mesh" ? "https://static.rbx2016.tk/643d0aa8abe0b6f253c59ef6bbd0b30a.jpg" : `https://www.rbx2016.tk/asset/?id=${asset.id}`,
                    price: asset.price || 0,
                    name: "[ Content Deleted ]",
                    name2: "[ Content Deleted ]".replaceAll(" ", "-"),
                    desc: "[ Content Deleted ]",
                    likes: asset.likes.length,
                    dislikes: asset.dislikes.length,
                    userVoted: await db.userLikeStatus(req.user.userid, asset.id),
                    favorites: asset.favorites.length,
                    userFavorited: await db.userHasFavorited(req.user.userid, asset.id),
                    creatorname: creator.username,
                    creatorid: creator.userid,
                    sold: asset.sold,
                    owned: asset.owners.includes(req.user.userid),
                    likeratio: asset.likes.length == 0 && asset.dislikes.length == 0 ? 50 : asset.likes.length / (asset.likes.length + asset.dislikes.length),
                    created: `${created.getDate()}/${created.getMonth()}/${created.getFullYear()}`,
                    updated: `${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`,
                    onSale: asset.onSale,
                    isCreator: req.user.userid == asset.creatorid,
                    type: asset.type
                });
                return;
            }

            const created = db.unixToDate(asset.created);
            const updated = db.unixToDate(asset.updated);
            res.render("asset", {
                ...(await db.getRenderObject(req.user)),
                id: asset.id,
                icon: asset.deleted ? "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png" : (asset.approvedBy == 0 && (!req.user.isAdmin && !req.user.isMod)) ? "https://static.rbx2016.tk/eb0f290fb60954fff9f7251a689b9088.jpg" : asset.type == "Audio" ? "https://static.rbx2016.tk/eadc8982548a4aa4c158ba1dad61ff14.png" : asset.type == "Mesh" ? "https://static.rbx2016.tk/643d0aa8abe0b6f253c59ef6bbd0b30a.jpg" : `https://www.rbx2016.tk/asset/?id=${asset.id}`,
                price: asset.price || 0,
                name: asset.name,
                name2: asset.name.replaceAll(" ", "-"),
                desc: asset.description,
                likes: asset.likes.length,
                dislikes: asset.dislikes.length,
                userVoted: await db.userLikeStatus(req.user.userid, asset.id),
                favorites: asset.favorites.length,
                userFavorited: await db.userHasFavorited(req.user.userid, asset.id),
                creatorname: creator.username,
                creatorid: creator.userid,
                sold: asset.sold,
                owned: asset.owners.includes(req.user.userid),
                likeratio: asset.likes.length == 0 && asset.dislikes.length == 0 ? 50 : asset.likes.length / (asset.likes.length + asset.dislikes.length),
                created: `${created.getDate()}/${created.getMonth()}/${created.getFullYear()}`,
                updated: `${updated.getDate()}/${updated.getMonth()}/${updated.getFullYear()}`,
                onSale: asset.onSale,
                isCreator: req.user.userid == asset.creatorid,
                type: asset.type
            });
        });

        app.post("/v1/update/item", db.requireAuth, async (req, res) => {
            const itemId = parseInt(req.body.itemId);
            const price = parseInt(req.body.price);
            const gamepass = await db.getGamepass(itemId);
            if (!gamepass) {
                const item = await db.getCatalogItem(itemId);
                if (!item) {
                    res.status(404).send("Invalid item ID");
                    return;
                }
                if (item.itemcreatorid != req.user.userid) {
                    res.status(403).send("You are not the creator of this item");
                    return;
                }
                if (price < 0) {
                    res.status(400).send("Invalid price");
                    return;
                }
                await db.setCatalogItemProperty(itemId, "price", price);
                res.redirect(`/catalog/${itemId}/${db.filterText2(item.name).replaceAll(" ", "-")}`);
                return;
            }
            if (gamepass.creatorid != req.user.userid) {
                res.status(403).send("You are not the creator of this item");
                return;
            }
            if (price < 0) {
                res.status(400).send("Invalid price");
                return;
            }
            await db.setGamepassProperty(itemId, "price", price);
            res.redirect(`/game-pass/${itemId}/${db.filterText2(gamepass.name).replaceAll(" ", "-")}`);
        });

        app.post("/v1/visibiliy/item/toggle", db.requireAuth, async (req, res) => {
            const itemId = parseInt(req.body.itemId);
            const gamepass = await db.getGamepass(itemId);
            if (!gamepass) {
                const asset = await db.getAsset(itemId);
                if (!asset) {
                    const item = await db.getCatalogItem(itemId);
                    if (!item) {
                        res.status(404).json({});
                        return;
                    }
                    if (req.user.userid != item.creatorid){
                        res.status(403).json({});
                        return;
                    }
                    await db.setCatalogItemProperty(itemId, "onSale", !asset.onSale);
                    res.json({});
                    return;
                }
                if (req.user.userid != asset.creatorid){
                    res.status(403).json({});
                    return;
                }
                await db.setAssetProperty(itemId, "onSale", !asset.onSale);
                res.json({});
                return;
            }
            if (gamepass.creatorid != req.user.userid) {
                res.status(403).json({});
                return;
            }
            await db.setGamepassProperty(itemId, "onSale", !gamepass.onSale);
            res.json({});
        });

        app.get("/places/:placeid/settings", async (req, res) => {
            if (db.getSiteConfig().shared.games.canManageGames == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const placeid = parseInt(req.params.placeid);
            const game = await db.getGame(placeid);
            if (req.user.userid != game.creatorid) {
                res.json({});
                return;
            }
            const creator = await db.getUser(game.creatorid);
            res.json({
                "DefaultFormatNameString": "{0}\u0027s Place Number: {1}",
                "IUser": null,
                "GameDetailsResources": {
                    "IsValueCreated": false,
                    "Value": {
                        "ActionShareGameToChatMetadata": {
                            "IsTranslated": true
                        },
                        "ActionShareGameToChat": "Share to chat",
                        "ActionSwapToSourceMetadata": {
                            "IsTranslated": true
                        },
                        "ActionSwapToSource": "Translate to Original Language",
                        "ActionSwapToTranslationMetadata": {
                            "IsTranslated": true
                        },
                        "DescriptionAllowCopyingDisclaimerMetadata": {
                            "IsTranslated": true
                        },
                        "HeadingDescriptionMetadata": {
                            "IsTranslated": true
                        },
                        "HeadingDescription": "Description",
                        "HeadingRecommendedGamesMetadata": {
                            "IsTranslated": true
                        },
                        "HeadingRecommendedGames": "Recommended Experiences",
                        "LabelAboutMetadata": {
                            "IsTranslated": true
                        },
                        "LabelAbout": "About",
                        "LabelAllowCopyingCheckboxMetadata": {
                            "IsTranslated": true
                        },
                        "LabelAllowCopyingCheckbox": "Allow Copying",
                        "LabelAllowedGearMetadata": {
                            "IsTranslated": true
                        },
                        "LabelAllowedGear": "Allowed Gear",
                        "LabelByMetadata": {
                            "IsTranslated": true
                        },
                        "LabelBy": "By",
                        "LabelByCreatorMetadata": {
                            "IsTranslated": true
                        },
                        "LabelCopyingTitleMetadata": {
                            "IsTranslated": true
                        },
                        "LabelCopyingTitle": "Copying",
                        "LabelCreatedMetadata": {
                            "IsTranslated": true
                        },
                        "LabelCreated": "Created",
                        "LabelExperimentalModeMetadata": {
                            "IsTranslated": true
                        },
                        "LabelExperimentalMode": "Experimental Mode",
                        "LabelExperimentalWarningMetadata": {
                            "IsTranslated": true
                        },
                        "LabelFavoritesMetadata": {
                            "IsTranslated": true
                        },
                        "LabelFavorites": "Favorites",
                        "LabelGameCopyLockedMetadata": {
                            "IsTranslated": true
                        },
                        "LabelGameCopyLocked": "This experience is copylocked",
                        "LabelGameDoesNotSellMetadata": {
                            "IsTranslated": true
                        },
                        "LabelGameDoesNotSell": "No passes available.",
                        "LabelGameRequiresBuildersClubMetadata": {
                            "IsTranslated": true
                        },
                        "LabelGameRequiresBuildersClub": "This Experience requires Builders Club",
                        "LabelGenreMetadata": {
                            "IsTranslated": true
                        },
                        "LabelGenre": "Genre",
                        "LabelLeaderboardsMetadata": {
                            "IsTranslated": true
                        },
                        "LabelLeaderboards": "Leaderboards",
                        "LabelMaxPlayersMetadata": {
                            "IsTranslated": true
                        },
                        "LabelMaxPlayers": "Server Size",
                        "LabelNoMetadata": {
                            "IsTranslated": true
                        },
                        "LabelNo": "No",
                        "LabelNoRunningGamesMetadata": {
                            "IsTranslated": true
                        },
                        "LabelNoRunningGames": "There are currently no running experiences.",
                        "LabelPlaceCopyingAllowedMetadata": {
                            "IsTranslated": true
                        },
                        "LabelPlaceCopyingAllowed": "This experience\u0027s source can be copied.",
                        "LabelPlayingMetadata": {
                            "IsTranslated": true
                        },
                        "LabelPlaying": "Active",
                        "LabelPrivateSourceMetadata": {
                            "IsTranslated": true
                        },
                        "LabelPrivateSource": "Private Source",
                        "LabelPrivateSourceDescriptionMetadata": {
                            "IsTranslated": true
                        },
                        "LabelPrivateSourceDescription": "This experience\u0027s source is private",
                        "LabelPublicPrivateSourceCheckBoxMetadata": {
                            "IsTranslated": true
                        },
                        "LabelPublicPrivateSourceCheckBox": "By leaving this checkbox checked, you are agreeing to allow every other user of Roblox the right to use (in various ways) the content you are now making available, as set out in the Terms. If you do not want to grant this right, please uncheck this box.",
                        "LabelPublicSourceMetadata": {
                            "IsTranslated": true
                        },
                        "LabelPublicSource": "Public Source",
                        "LabelPublicSourceDescriptionMetadata": {
                            "IsTranslated": true
                        },
                        "LabelPublicSourceDescription": "This experience\u0027s source is public",
                        "LabelReportAbuseMetadata": {
                            "IsTranslated": true
                        },
                        "LabelReportAbuse": "Report Abuse",
                        "LabelServersMetadata": {
                            "IsTranslated": true
                        },
                        "LabelServers": "Servers",
                        "LabelStoreMetadata": {
                            "IsTranslated": true
                        },
                        "LabelStore": "Store",
                        "LabelUpdatedMetadata": {
                            "IsTranslated": true
                        },
                        "LabelUpdated": "Updated",
                        "LabelVisitsMetadata": {
                            "IsTranslated": true
                        },
                        "LabelVisits": "Visits",
                        "LabelVoiceEnabledMetadata": {
                            "IsTranslated": true
                        },
                        "LabelVoiceEnabled": "Voice Enabled",
                        "LabelYesMetadata": {
                            "IsTranslated": true
                        },
                        "LabelYes": "Yes",
                        "MessageExternalLinkWarningMetadata": {
                            "IsTranslated": true
                        },
                        "MessageExternalLinkWarning": "By clicking \"continue\", you will be redirected to a website that is not owned or operated by Roblox. They may have different terms and privacy policies.",
                        "MessageLeavingRobloxTitleMetadata": {
                            "IsTranslated": true
                        },
                        "MessageLeavingRobloxTitle": "Leaving Roblox",
                        "State": 0
                    }
                },
                "ID": game.gameid,
                "DefaultUserName": creator.username,
                "DefaultPlaceNumber": (await db.getGamesByCreatorId(creator.userid)).length + 1,
                "Name": game.gamename,
                "Description": "",
                "DescriptionMaxCharacterCount": 1000,
                "Genre": "All",
                "Access": game.isPublic ? "Everyone" : "Friends",
                "IsPublic": false,
                "DeviceSectionHeader": null,
                "SellGameAccessSectionHeader": null,
                "ShouldShowStartPlaceNameOrDescriptionUpdateAlsoUpdatesGames": true,
                "NumberOfMaxPlayersList": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
                "NumberOfPlayersList": [1, 2, 3, 4, 5],
                "IsAllGenresAllowed": false,
                "AllowedGearTypes": [{
                    "GearTypeDisplayName": "Melee",
                    "IsSelected": false,
                    "Category": 8
                }, {
                    "GearTypeDisplayName": "Power ups",
                    "IsSelected": false,
                    "Category": 11
                }, {
                    "GearTypeDisplayName": "Ranged",
                    "IsSelected": false,
                    "Category": 9
                }, {
                    "GearTypeDisplayName": "Navigation",
                    "IsSelected": false,
                    "Category": 12
                }, {
                    "GearTypeDisplayName": "Explosives",
                    "IsSelected": false,
                    "Category": 10
                }, {
                    "GearTypeDisplayName": "Musical",
                    "IsSelected": false,
                    "Category": 13
                }, {
                    "GearTypeDisplayName": "Social",
                    "IsSelected": false,
                    "Category": 14
                }, {
                    "GearTypeDisplayName": "Transport",
                    "IsSelected": false,
                    "Category": 22
                }, {
                    "GearTypeDisplayName": "Building",
                    "IsSelected": false,
                    "Category": 21
                }],
                "ChatType": "Both", // Classic
                "IsCopyingAllowed": game.copiable,
                "IsOldVersionAllowed": false,
                "ShouldForceRestart": false,
                "NumberOfPlayersMax": game.maxplayers,
                "NumberOfPlayersPreferred": game.maxplayers,
                "NumberOfCustomSocialSlots": 1,
                "SocialSlotType": 1,
                "SellGameAccess": false,
                "ShowAllowPrivateServers": true,
                "ArePrivateServersAllowed": false,
                "IsFreePrivateServer": false,
                "PrivateServersPrice": 100,
                "PrivateServerMinPrice": 10,
                "PrivateServerDefaultPrice": 100,
                "PrivateServersMarketplaceTaxRate": 0.3,
                "MarketplaceTaxRate": 0.3,
                "ActivePrivateServersCount": 0,
                "ActivePrivateServersSubscriptionsCount": 0,
                "PrivateServerConfigurationLink": "https://develop.rbx2016.tk/v1/universes/configuration/vip-servers",
                "Price": 0,
                "PrivateServersHelpLink": "https://developer.rbx2016.tk/en-us/articles/Creating-a-VIP-Server-on-Roblox",
                "OverridesDefaultAvatar": false,
                "UsePortraitMode": false,
                "BCSellRequirement": null,
                "BCSellReqirementMet": true,
                "SellingVisible": true,
                "Creator": {
                    "Name": creator.username,
                    "CreatorTargetId": creator.userid,
                    "CreatorType": 0
                },
                "PublishStep": 0,
                "MaxPublishStepReached": 0,
                "PlayableDevices": [{
                    "DeviceType": 1,
                    "Selected": true
                }, {
                    "DeviceType": 2,
                    "Selected": true
                }, {
                    "DeviceType": 3,
                    "Selected": true
                }, {
                    "DeviceType": 4,
                    "Selected": false
                }],
                "FinalPublishStep": 4,
                "VersionHistoryOnConfigurePageEnabled": true,
                "DefaultDevelopTabName": "Experience",
                "PortraitModeEnabled": false,
                "IsEngagementPayoutEnabled": true,
                "EngagementPayoutUrl": "https://www.rbx2016.tk/develop/premium-payout?ctx=gameDetail",
                "UserIsSellerBanned": false,
                "DeviceConfigurationEnabled": true,
                "ConsoleContentAgreementEnabled": true,
                "ShowDeveloperProducts": true,
                "CurrentUniverse": null,
                "AllowPlaceToBeCopiedInGame": false,
                "AllowPlaceToBeUpdatedInGame": false,
                "DeveloperProductUniverseId": 0,
                "TemplateID": null,
                "AccessTypesUsingPermissions": null,
                "AccessTypeSelectList": [{
                    "Disabled": false,
                    "Group": null,
                    "Selected": false,
                    "Text": "Everyone",
                    "Value": null
                }, {
                    "Disabled": false,
                    "Group": null,
                    "Selected": false,
                    "Text": "Friends",
                    "Value": null
                }],
                "UserAgreementModel": null,
                "MachineID": "WEB967",
                "BaseScripts": ["~/js/jquery-1.11.1.min.js", "~/js/jquery/jquery-migrate-1.2.1.min.js", "~/js/roblox.js", "~/js/jquery.tipsy.js", "~/js/GoogleAnalytics/GoogleAnalyticsEvents.js", "~/js/jquery.cookie.js", "~/js/common/forms.js", "~/js/jquery.simplemodal-1.3.5.js", "~/js/GenericConfirmation.js", "~/js/JavaScriptEndpoints.js"],
                "Title": "Roblox Studio",
                "Groups": null,
                "PrimaryGroupId": null,
                "MetaTagListViewModel": {
                    "FacebookMetaTags": null,
                    "TwitterMetaTags": null,
                    "StructuredDataTags": {
                        "StructuredDataContext": "http://schema.org",
                        "StructuredDataType": "Organization",
                        "StructuredDataName": "Roblox",
                        "RobloxUrl": "https://www.rbx2016.tk/",
                        "RobloxLogoUrl": "https://images.rbx2016.tk/cece570e37aa8f95a450ab0484a18d91",
                        "RobloxFacebookUrl": "https://www.facebook.com/roblox/",
                        "RobloxTwitterUrl": "https://twitter.com/roblox",
                        "RobloxLinkedInUrl": "https://www.linkedin.com/company/147977",
                        "RobloxInstagramUrl": "https://www.instagram.com/roblox/",
                        "RobloxYouTubeUrl": "https://www.youtube.com/user/roblox",
                        "RobloxGooglePlusUrl": "https://plus.google.com/+roblox",
                        "RobloxTwitchTvUrl": "https://www.twitch.tv/roblox",
                        "Title": "Roblox",
                        "Description": null,
                        "Images": null,
                        "ImageWidth": null,
                        "ImageHeight": null
                    },
                    "Description": "Roblox is a global platform that brings people together through play.",
                    "Keywords": "free games, online games, building games, virtual worlds, free mmo, gaming cloud, physics engine",
                    "NoIndexNoFollow": false,
                    "NoIndex": false,
                    "NoFollow": false,
                    "IncludeReferrerOriginTag": false,
                    "GoogleSiteVerificationTag": null,
                    "IncludeAppleAppIdTag": true,
                    "IncludeAngularContentSecurityPolicyTag": true
                },
                "JavascriptErrorTrackerViewModel": {
                    "InitializeParameter": "{ \u0027suppressConsoleError\u0027: true}"
                }
            });
        });

        app.post("/client-status/set", db.requireAuth, async (req, res) => {
            const status = req.query.status;
            if (status.length > 254) {
                res.send("false");
                return;
            }
            res.send("true")
        });

        app.get("/account/settings/account-country", async (req, res) => {
            res.json({
                "countryName": "USA",
                "localizedName": "USA",
                "countryId": 1,
                "success": true,
                "errorMessage": null
            });
        });

        app.get("/account/settings/account-restrictions", db.requireAuth, async (req, res) => {
            res.json({
                "IsEnabled": false
            });
        });

        app.get("/v1/gender", db.requireAuth, async (req, res) => {
            res.json({
                "gender": db.getSiteConfig().shared.users.gendersEnabled ? req.user.gender : 1
            });
        });

        app.get("/account/settings/private-server-invite-privacy", db.requireAuth, async (req, res) => {
            res.json({
                "PrivateServerInvitePrivacy": "Friends"
            });
        });

        app.get("/account/settings/follow-me-privacy", db.requireAuth, async (req, res) => {
            res.json({
                "FollowMePrivacy": "NoOne"
            });
        });

        app.get("/v1/trade-privacy", db.requireAuth, async (req, res) => {
            res.json({
                "tradePrivacy": "All"
            });
        });

        app.get("/v1/trade-value", db.requireAuth, async (req, res) => {
            res.json({
                "tradeValue": "None"
            });
        });

        app.get("/v1/inventory-privacy", db.requireAuth, async (req, res) => {
            res.json({
                "inventoryPrivacy": "AllUsers"
            });
        });

        app.get("/account/settings/app-chat-privacy", db.requireAuth, async (req, res) => {
            res.json({
                "AppChatPrivacy": "Friends"
            });
        });

        app.get("/account/settings/game-chat-privacy", db.requireAuth, async (req, res) => {
            res.json({
                "GameChatPrivacy": "AllUsers"
            });
        });

        app.get("/account/settings/private-message-privacy", db.requireAuth, async (req, res) => {
            res.json({
                "PrivateMessagePrivacy": "Friends"
            });
        });

        app.get("/userblock/getblockedusers", (req, res) => {
            res.json({
                "success": true,
                "userList": [],
                "total": 0
            });
        });

        app.post("/moderation/filtertext", (req, res) => {
            const text = req.body.text;
            const userid = req.body.userId;
            res.json({
                "data": {
                    "white": text,
                    "black": ""
                }
            });
        });

        app.post("//moderation/filtertext", (req, res) => {
            const text = req.body.text;
            const userid = req.body.userId;
            res.json({
                "data": {
                    "white": text,
                    "black": ""
                }
            });
        });

        app.get("/Error/Dmp.ashx", (req, res) => {
            res.send();
        });

        app.get("/Error/Grid.ashx", (req, res) => {
            res.send();
        });

        app.get("/setup/domain.pem", (req, res) => {
            const file = `${__dirname}/../certs/domain.pem`
            const content = fs.readFileSync(file);
            res.send(content);
        });

        app.get("/setup/domain.crt", (req, res) => {
            const file = `${__dirname}/../certs/domain.crt`
            const content = fs.readFileSync(file);
            res.send(content);
        });

        app.get("/universes/validate-place-join", (req, res) => {
            res.send("true")
        });

        app.get("/my/settings/json", db.requireAuth, async (req, res) => {
            const ip = get_ip(req).clientIp;
            res.json({
                "ChangeUsernameEnabled": true,
                "IsAdmin": req.user.isAdmin,
                "UserId": req.user.userid,
                "Name": req.user.username,
                "DisplayName": req.user.username,
                "IsEmailOnFile": req.user.emailverified,
                "IsEmailVerified": req.user.emailverified,
                "IsPhoneFeatureEnabled": false,
                "RobuxRemainingForUsernameChange": Math.max(0, 1000 - req.user.robux),
                "PreviousUserNames": "",
                "UseSuperSafePrivacyMode": false,
                "IsAppChatSettingEnabled": true,
                "IsGameChatSettingEnabled": true,
                "IsContentRatingsSettingEnabled": false,
                "IsParentalControlsTabEnabled": true,
                "IsParentalSpendControlsEnabled": true,
                "IsParentalScreentimeRestrictionsEnabled": false,
                "IsSetPasswordNotificationEnabled": false,
                "ChangePasswordRequiresTwoStepVerification": false,
                "ChangeEmailRequiresTwoStepVerification": false,
                "UserEmail": db.censorEmail(req.user.email),
                "UserEmailMasked": true,
                "UserEmailVerified": req.user.emailverified,
                "CanHideInventory": true,
                "CanTrade": false,
                "MissingParentEmail": false,
                "IsUpdateEmailSectionShown": true,
                "IsUnder13UpdateEmailMessageSectionShown": false,
                "IsUserConnectedToFacebook": false,
                "IsTwoStepToggleEnabled": false,
                "AgeBracket": 0,
                "UserAbove13": !(await db.isUserUnder13(req.user.userid)),
                "ClientIpAddress": ip,
                "AccountAgeInDays": 1105,
                "IsBcRenewalMembership": false,
                "PremiumFeatureId": null,
                "HasCurrencyOperationError": false,
                "CurrencyOperationErrorMessage": null,
                "BlockedUsersModel": {
                    "BlockedUserIds": [],
                    "BlockedUsers": [],
                    "MaxBlockedUsers": 100,
                    "Total": 0,
                    "Page": 1
                },
                "Tab": null,
                "ChangePassword": false,
                "IsAccountPinEnabled": true,
                "IsAccountRestrictionsFeatureEnabled": true,
                "IsAccountRestrictionsSettingEnabled": false,
                "IsAccountSettingsSocialNetworksV2Enabled": false,
                "IsUiBootstrapModalV2Enabled": true,
                "IsDateTimeI18nPickerEnabled": true,
                "InApp": false,
                "MyAccountSecurityModel": {
                    "IsEmailSet": true,
                    "IsEmailVerified": true,
                    "IsTwoStepEnabled": false,
                    "ShowSignOutFromAllSessions": true,
                    "TwoStepVerificationViewModel": {
                        "UserId": req.user.userid,
                        "IsEnabled": false,
                        "CodeLength": 0,
                        "ValidCodeCharacters": null
                    }
                },
                "ApiProxyDomain": "https://api.rbx2016.tk",
                "AccountSettingsApiDomain": "https://accountsettings.rbx2016.tk",
                "AuthDomain": "https://auth.rbx2016.tk",
                "IsDisconnectFacebookEnabled": true,
                "IsDisconnectXboxEnabled": true,
                "NotificationSettingsDomain": "https://notifications.rbx2016.tk",
                "AllowedNotificationSourceTypes": ["Test", "FriendRequestReceived", "FriendRequestAccepted", "PartyInviteReceived", "PartyMemberJoined", "ChatNewMessage", "PrivateMessageReceived", "UserAddedToPrivateServerWhiteList", "ConversationUniverseChanged", "TeamCreateInvite", "GameUpdate", "DeveloperMetricsAvailable", "GroupJoinRequestAccepted", "Sendr"],
                "AllowedReceiverDestinationTypes": ["DesktopPush", "NotificationStream"],
                "BlacklistedNotificationSourceTypesForMobilePush": [],
                "MinimumChromeVersionForPushNotifications": 50,
                "PushNotificationsEnabledOnFirefox": true,
                "LocaleApiDomain": "https://locale.rbx2016.tk",
                "HasValidPasswordSet": true,
                "FastTrackMember": null,
                "IsFastTrackAccessible": false,
                "HasFreeNameChange": false,
                "IsAgeDownEnabled": !(await db.isUserUnder13(req.user.userid)),
                "IsDisplayNamesEnabled": false,
                "IsBirthdateLocked": await db.isUserUnder13(req.user.userid)
            })
        });

        app.get("/users/profile/playergames-json", async (req, res) => {
            if (db.getSiteConfig().shared.games.canViewGames == false) {
                if (req.user) {
                    res.status(404).render("404", await db.getRenderObject(req.user));
                } else {
                    res.status(404).render("404", await db.getBlankRenderObject());
                }
                return;
            }
            const userId = parseInt(req.query.userId);
            const user = await db.getUser(userId);
            if (!user || user.banned || user.inviteKey == "") {
                res.status(404).send();
                return;
            }

            let games_json = []
            const games = await db.getGamesByCreatorId(userId);
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                games_json.push({
                    "CreatorID": game.creatorid,
                    "CreatorName": user.username,
                    "CreatorAbsoluteUrl": "https://www.rbx2016.tk/users/" + user.userid + "/profile/",
                    "Plays": 0,
                    "Price": 0,
                    "ProductID": 0,
                    "IsOwned": false,
                    "IsVotingEnabled": true,
                    "TotalUpVotes": 0,
                    "TotalDownVotes": 0,
                    "TotalBought": 0,
                    "UniverseID": game.gameid,
                    "HasErrorOcurred": false,
                    "Favorites": 0,
                    "Description": "",
                    "HideGameCardInfo": false,
                    "GameDetailReferralUrl": "https://www.rbx2016.tk/games/refer?PlaceId=" + game.gameid + "\u0026Position=1\u0026PageType=Profile",
                    "Thumbnail": {
                        "Final": true,
                        "Url": "https://static.rbx2016.tk/images/3970ad5c48ba1eaf9590824bbc739987f0d32dc9.png",
                        "RetryUrl": null,
                        "UserId": 0,
                        "EndpointType": "Avatar"
                    },
                    "UseDataSrc": false,
                    "IsAsyncThumbnailEnabled": false,
                    "GamePageResources": null,
                    "Name": "Basplate",
                    "PlaceID": game.gameid,
                    "PlayerCount": 0,
                    "ImageId": 0
                })
            }

            res.json({
                "Title": "Experiences",
                "Games": [],
                "ModalAssetViewType": 4,
                "ProfileLangResources": {
                    "ActionAcceptMetadata": {
                        "IsTranslated": true
                    },
                    "ActionAccept": "Accept",
                    "ActionAddFriendMetadata": {
                        "IsTranslated": true
                    },
                    "ActionAddFriend": "Add Friend",
                    "ActionBlockUserMetadata": {
                        "IsTranslated": true
                    },
                    "ActionBlockUser": "Block User",
                    "ActionCancelBlockUserMetadata": {
                        "IsTranslated": true
                    },
                    "ActionCancelBlockUser": "Cancel",
                    "ActionChatMetadata": {
                        "IsTranslated": true
                    },
                    "ActionChat": "Chat",
                    "ActionCloseMetadata": {
                        "IsTranslated": true
                    },
                    "ActionClose": "Close",
                    "ActionConfirmBlockUserMetadata": {
                        "IsTranslated": true
                    },
                    "ActionConfirmBlockUser": "Block",
                    "ActionConfirmUnblockUserMetadata": {
                        "IsTranslated": true
                    },
                    "ActionConfirmUnblockUser": "Unblock",
                    "ActionFavoritesMetadata": {
                        "IsTranslated": true
                    },
                    "ActionFavorites": "Favorites",
                    "ActionFollowMetadata": {
                        "IsTranslated": true
                    },
                    "ActionFollow": "Follow",
                    "ActionGridViewMetadata": {
                        "IsTranslated": true
                    },
                    "ActionGridView": "Grid View",
                    "ActionImpersonateUserMetadata": {
                        "IsTranslated": true
                    },
                    "ActionImpersonateUser": "Impersonate User",
                    "ActionInventoryMetadata": {
                        "IsTranslated": true
                    },
                    "ActionInventory": "Inventory",
                    "ActionJoinGameMetadata": {
                        "IsTranslated": true
                    },
                    "ActionJoinGame": "Join",
                    "ActionMessageMetadata": {
                        "IsTranslated": true
                    },
                    "ActionMessage": "Message",
                    "ActionPendingMetadata": {
                        "IsTranslated": true
                    },
                    "ActionPending": "Pending",
                    "ActionSaveMetadata": {
                        "IsTranslated": true
                    },
                    "ActionSave": "Save",
                    "ActionSeeAllMetadata": {
                        "IsTranslated": true
                    },
                    "ActionSeeAll": "See All",
                    "ActionSeeLessMetadata": {
                        "IsTranslated": true
                    },
                    "ActionSeeLess": "See Less",
                    "ActionSeeMoreMetadata": {
                        "IsTranslated": true
                    },
                    "ActionSeeMore": "See More",
                    "ActionSlideshowViewMetadata": {
                        "IsTranslated": true
                    },
                    "ActionSlideshowView": "Slideshow View",
                    "ActionTradeMetadata": {
                        "IsTranslated": true
                    },
                    "ActionTrade": "Trade",
                    "ActionTradeItemsMetadata": {
                        "IsTranslated": true
                    },
                    "ActionTradeItems": "Trade Items",
                    "ActionUnblockUserMetadata": {
                        "IsTranslated": true
                    },
                    "ActionUnblockUser": "Unblock User",
                    "ActionUnfollowMetadata": {
                        "IsTranslated": true
                    },
                    "ActionUnfollow": "Unfollow",
                    "ActionUnfriendMetadata": {
                        "IsTranslated": true
                    },
                    "ActionUnfriend": "Unfriend",
                    "ActionUpdateStatusMetadata": {
                        "IsTranslated": true
                    },
                    "ActionUpdateStatus": "Update Status",
                    "DescriptionAboutSuccessMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionAboutSuccess": "Successfully updated description.",
                    "DescriptionAboutWarningMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionAboutWarning": "Keep yourself safe, do not share personal details online.",
                    "DescriptionBlockUserFooterMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionBlockUserFooter": "When you\u0027ve blocked a user, neither of you can directly contact the other.",
                    "DescriptionBlockUserPromptMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionBlockUserPrompt": "Are you sure you want to block this user?",
                    "DescriptionChangeAliasMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionChangeAlias": "Only you can see this information",
                    "DescriptionErrorMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionError": "Unable to update description, please try again later.",
                    "DescriptionPlaceholderStatusMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionPlaceholderStatus": "Tell the Roblox community about what you like to make, build, and explore...",
                    "DescriptionUnblockUserPromptMetadata": {
                        "IsTranslated": true
                    },
                    "DescriptionUnblockUserPrompt": "Are you sure you want to unblock this user?",
                    "HeadingAboutTabMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingAboutTab": "About",
                    "HeadingBlockUserTitleMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingBlockUserTitle": "Warning",
                    "HeadingCollectionsMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingCollections": "Collections",
                    "HeadingCurrentlyWearingMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingCurrentlyWearing": "Currently Wearing",
                    "HeadingFavoriteGamesMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingFavoriteGames": "Favorites",
                    "HeadingFriendsMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingFriends": "Friends",
                    "HeadingFriendsNumMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingGamesMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingGames": "Experiences",
                    "HeadingGameTitleMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingGameTitle": "Experiences",
                    "HeadingGroupsMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingGroups": "Groups",
                    "HeadingPlayerAssetsBadgesMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingPlayerAssetsBadges": "Badges",
                    "HeadingPlayerAssetsClothingMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingPlayerAssetsClothing": "Clothing",
                    "HeadingPlayerAssetsModelsMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingPlayerAssetsModels": "Models",
                    "HeadingPlayerBadgeMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingPlayerBadge": "Badges",
                    "HeadingProfileMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingProfile": "Profile",
                    "HeadingProfileGroupsMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingProfileGroups": "Groups",
                    "HeadingRobloxBadgeMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingRobloxBadge": "Roblox Badges",
                    "HeadingStatisticsMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingStatistics": "Statistics",
                    "LabelAboutMetadata": {
                        "IsTranslated": true
                    },
                    "LabelAbout": "About",
                    "LabelAliasMetadata": {
                        "IsTranslated": true
                    },
                    "LabelAlias": "Alias",
                    "LabelBlockWarningBodyMetadata": {
                        "IsTranslated": true
                    },
                    "LabelBlockWarningBody": "Are you sure you want to block this user?",
                    "LabelBlockWarningConfirmMetadata": {
                        "IsTranslated": true
                    },
                    "LabelBlockWarningConfirm": "Block",
                    "LabelBlockWarningFooterMetadata": {
                        "IsTranslated": true
                    },
                    "LabelBlockWarningFooter": "When you\u0027ve blocked a user, neither of you can directly contact the other.",
                    "LabelCancelMetadata": {
                        "IsTranslated": true
                    },
                    "LabelCancel": "Cancel",
                    "LabelChangeAliasMetadata": {
                        "IsTranslated": true
                    },
                    "LabelChangeAlias": "Set Alias",
                    "LabelCreationsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelCreations": "Creations",
                    "LabelFollowersMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFollowers": "Followers",
                    "LabelFollowingMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFollowing": "Following",
                    "LabelForumPostsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelForumPosts": "Forum Posts",
                    "LabelFriendsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFriends": "Friends",
                    "LabelGridViewMetadata": {
                        "IsTranslated": true
                    },
                    "LabelGridView": "Grid View",
                    "LabelJoinDateMetadata": {
                        "IsTranslated": true
                    },
                    "LabelJoinDate": "Join Date",
                    "LabelLoadMoreMetadata": {
                        "IsTranslated": true
                    },
                    "LabelLoadMore": "Load More",
                    "LabelMembersMetadata": {
                        "IsTranslated": true
                    },
                    "LabelMembers": "Members",
                    "LabelPastUsernameMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPastUsername": "Past Usernames",
                    "LabelPastUsernamesMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPastUsernames": "Previous usernames",
                    "LabelPlaceVisitsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPlaceVisits": "Place Visits",
                    "LabelPlayingMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPlaying": "Active",
                    "LabelQuotationMetadata": {
                        "IsTranslated": true
                    },
                    "LabelRankMetadata": {
                        "IsTranslated": true
                    },
                    "LabelRank": "Rank",
                    "LabelReadMoreMetadata": {
                        "IsTranslated": true
                    },
                    "LabelReadMore": "Read More",
                    "LabelReportAbuseMetadata": {
                        "IsTranslated": true
                    },
                    "LabelReportAbuse": "Report Abuse",
                    "LabelShowLessMetadata": {
                        "IsTranslated": true
                    },
                    "LabelShowLess": "Show Less",
                    "LabelSlideshowViewMetadata": {
                        "IsTranslated": true
                    },
                    "LabelSlideshowView": "Slideshow View",
                    "LabelUnblockWarningBodyMetadata": {
                        "IsTranslated": true
                    },
                    "LabelUnblockWarningBody": "Are you sure you want to unblock this user?",
                    "LabelUnblockWarningConfirmMetadata": {
                        "IsTranslated": true
                    },
                    "LabelUnblockWarningConfirm": "Unblock",
                    "LabelVisitsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelVisits": "Visits",
                    "LabelWarningTitleMetadata": {
                        "IsTranslated": true
                    },
                    "LabelWarningTitle": "Warning",
                    "MessageAcceptFriendRequestErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageAcceptFriendRequestError": "Unable to accept friend request.",
                    "MessageAliasHasErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageAliasHasError": "An error has occurred. Please try again later",
                    "MessageAliasIsModeratedMetadata": {
                        "IsTranslated": true
                    },
                    "MessageAliasIsModerated": "Please avoid using full names or offensive language.",
                    "MessageBlockErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageBlockError": "Unable to block user. You may have blocked too many people.",
                    "MessageBlockRequestErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageBlockRequestError": "Unable to block user.",
                    "MessageChangeStatusMetadata": {
                        "IsTranslated": true
                    },
                    "MessageChangeStatus": "What are you up to?",
                    "MessageErrorBlockLimitMetadata": {
                        "IsTranslated": true
                    },
                    "MessageErrorBlockLimit": "Operation failed! You may have blocked too many people.",
                    "MessageErrorGeneralMetadata": {
                        "IsTranslated": true
                    },
                    "MessageErrorGeneral": "Something went wrong. Please check back in a few minutes.",
                    "MessageFollowErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageFollowError": "Unable to follow user.",
                    "MessageImpersonateUserErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageImpersonateUserError": "Unable to impersonate user.",
                    "MessageNoCreationMetadata": {
                        "IsTranslated": true
                    },
                    "MessageRemoveFriendErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageRemoveFriendError": "Unable to unfriend user.",
                    "MessageSendFriendRequestErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageSendFriendRequestError": "Unable to send friend request.",
                    "MessageSharingMetadata": {
                        "IsTranslated": true
                    },
                    "MessageSharing": "Sharing...",
                    "MessageUnfollowErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageUnfollowError": "Unable to unfollow user.",
                    "MessageUpdateStatusErrorMetadata": {
                        "IsTranslated": true
                    },
                    "MessageUpdateStatusError": "Unable to update status.",
                    "ResponseTooManyAttemptsMetadata": {
                        "IsTranslated": true
                    },
                    "ResponseTooManyAttempts": "Too many attempts. Please try again later.",
                    "State": 0
                },
                "GamePageResources": {
                    "ActionDisableExperimentalModeMetadata": {
                        "IsTranslated": true
                    },
                    "ActionDisableExperimentalMode": "Disable",
                    "ActionSeeAllMetadata": {
                        "IsTranslated": true
                    },
                    "ActionSeeAll": "See All",
                    "HeadingExperimentalModeMetadata": {
                        "IsTranslated": true
                    },
                    "HeadingExperimentalMode": "Experimental Mode Experiences",
                    "LabelFilterExperimentalMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterExperimental": "Recommended",
                    "LabelFreeMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFree": "Free",
                    "LabelMoreResultsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelMoreResults": "more results",
                    "LabelMoreResultsForMetadata": {
                        "IsTranslated": true
                    },
                    "LabelMoreResultsFor": "More Results For",
                    "LabelSponsoredMetadata": {
                        "IsTranslated": true
                    },
                    "LabelSponsored": "Sponsored",
                    "LabelSponsoredAdMetadata": {
                        "IsTranslated": true
                    },
                    "LabelSponsoredAd": "Sponsored Ad",
                    "LabelTopResultMetadata": {
                        "IsTranslated": true
                    },
                    "LabelTopResult": "Top Result",
                    "LabelCancelFieldMetadata": {
                        "IsTranslated": true
                    },
                    "LabelCancelField": "Cancel",
                    "LabelCreatorByMetadata": {
                        "IsTranslated": true
                    },
                    "LabelExperimentalMetadata": {
                        "IsTranslated": true
                    },
                    "LabelExperimental": "Experimental",
                    "LabelExperimentalHelpTextMetadata": {
                        "IsTranslated": true
                    },
                    "LabelExperimentalHelpText": "What\u0027s this?",
                    "LabelExperimentalModeMetadata": {
                        "IsTranslated": true
                    },
                    "LabelExperimentalMode": "Experimental Mode",
                    "LabelExperimentalResultsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelExperimentalResults": "These results contain Experimental Mode experiences.",
                    "LabelFilterAllTimeMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterAllTime": "All Time",
                    "LabelFilterBecauseYouLikedMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterBuildersClubMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterBuildersClub": "Builders Club",
                    "LabelFilterByMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterBy": "Filter By",
                    "LabelFilterContestMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterContest": "Contest",
                    "LabelFilterContinuePlayingAndFavoritesMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterContinuePlayingAndFavorites": "Continue Playing + Favorites",
                    "LabelFilterDefaultMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterDefault": "Default",
                    "LabelFilterFeaturedMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterFeatured": "Featured",
                    "LabelFilterFriendActivityMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterFriendActivity": "Friend Activity",
                    "LabelFilterGenreMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterGenre": "Genre",
                    "LabelFilterMyFavoriteMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterMyFavorite": "My Favorite",
                    "LabelFilterMyFavoritesMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterMyFavorites": "My Favorites",
                    "LabelFilterMyLibraryMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterMyLibrary": "My Library",
                    "LabelFilterMyRecentMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterMyRecent": "My Recent",
                    "LabelFilterNowMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterNow": "Now",
                    "LabelFilterPastDayMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPastDay": "Past Day",
                    "LabelFilterPastWeekMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPastWeek": "Past Week",
                    "LabelFilterPersonalizedByLikedMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPersonalizedByLiked": "Because You Liked",
                    "LabelFilterPersonalServerMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPersonalServer": "Personal Server",
                    "LabelFilterPopularMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPopular": "Popular",
                    "LabelFilterPopularByCountryMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPopularInVrMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPopularInVr": "Popular in VR",
                    "LabelFilterPopularNearYouMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPopularNearYou": "Popular Near You",
                    "LabelFilterPopularWorldwideMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPopularWorldwide": "Popular Worldwide",
                    "LabelFilterPurchasedMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterPurchased": "Purchased",
                    "LabelFilterRecentlyPlayedMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterRecentlyPlayed": "Recently Played",
                    "LabelFilterRecommendedForYouMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterRecommendedForYou": "Recommended For You",
                    "LabelFilterTimeMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterTime": "Time",
                    "LabelFilterTopFavoriteMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterTopFavorite": "Top Favorite",
                    "LabelFilterTopGrossingMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterTopGrossing": "Top Earning",
                    "LabelFilterTopPaidMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterTopPaid": "Top Paid",
                    "LabelFilterTopRatedMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterTopRated": "Top Rated",
                    "LabelFilterTopRetainingMetadata": {
                        "IsTranslated": true
                    },
                    "LabelFilterTopRetaining": "Recommended",
                    "LabelNoSearchResultsMetadata": {
                        "IsTranslated": true
                    },
                    "LabelNoSearchResults": "No Results Found",
                    "LabelPlayingMultipleUsersMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPlayingOnePlusUsersMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPlayingOnePlusUsersWithCommaMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPlayingOneUserMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPlayingPhraseMetadata": {
                        "IsTranslated": true
                    },
                    "LabelPlayingTwoUsersFixedMetadata": {
                        "IsTranslated": true
                    },
                    "LabelRecommendedForYouMetadata": {
                        "IsTranslated": true
                    },
                    "LabelRecommendedForYou": "Recommended For You",
                    "LabelSearchFieldMetadata": {
                        "IsTranslated": true
                    },
                    "LabelSearchField": "Search",
                    "LabelSearchInsteadForMetadata": {
                        "IsTranslated": true
                    },
                    "LabelSearchInsteadFor": "Search instead for",
                    "LabelSearchYouMightMeanMetadata": {
                        "IsTranslated": true
                    },
                    "LabelSearchYouMightMean": "Did you mean:",
                    "LabelServerErrorMetadata": {
                        "IsTranslated": true
                    },
                    "LabelServerError": "An Error Occured",
                    "LabelShowingResultsForMetadata": {
                        "IsTranslated": true
                    },
                    "LabelShowingResultsFor": "Showing results for",
                    "State": 0
                }
            });
        });

        app.get("/account/settings/settings-groups", db.requireAuth, async (req, res) => {
            res.json([{
                "title": "Account Info",
                "url": "https://www.rbx2016.tk/my/account#!/info",
                "suffix": "info"
            }, {
                "title": "Security",
                "url": "https://www.rbx2016.tk/my/account#!/security",
                "suffix": "security"
            }, {
                "title": "Privacy",
                "url": "https://www.rbx2016.tk/my/account#!/privacy",
                "suffix": "privacy"
            }, {
                "title": "Parental Controls",
                "url": "https://www.rbx2016.tk/my/account#!/parental-controls",
                "suffix": "parental-controls"
            }, {
                "title": "Billing",
                "url": "https://www.rbx2016.tk/my/account#!/billing",
                "suffix": "billing"
            }, {
                "title": "Notifications",
                "url": "https://www.rbx2016.tk/my/account#!/notifications",
                "suffix": "notifications"
            }])
        });

        app.get("/game/report-stats", (req, res) => {
            res.send();
        });

        app.get("/usercheck/show-tos", (req, res) => {
            if (req.query.isLicensingTermsCheckNeeded == "True") {
                res.json({
                    "success": true
                });
                return;
            }
            res.json({
                "success": true
            });
        });
    }
}