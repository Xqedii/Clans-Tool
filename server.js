const mineflayer = require('mineflayer');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/version', (req, res) => {
    res.json({ xqedii: version });
});
app.get('/members', (req, res) => {
    res.json({ xqedii: members });
});
app.get('/invites', (req, res) => {
    res.json({ xqedii: invites });
});
app.get('/joins', (req, res) => {
    res.json({ xqedii: joins });
});
app.get('/timer', (req, res) => {
    res.json({ xqedii: timer });
});
app.get('/reqinvites', (req, res) => {
    res.json({ xqedii: reqinvites });
});
app.get('/messages', (req, res) => {
    res.json({ xqedii: messages });
});
app.get('/timespent', (req, res) => {
    res.json({ xqedii: timespent });
});
app.get('/online', (req, res) => {
    res.json({ xqedii: online });
});
app.get('/maxonline', (req, res) => {
    res.json({ xqedii: maxonline });
});
app.get('/message', (req, res) => {
    res.json({ xqedii: message });
    message = [];
});
app.get('/address', (req, res) => {
    res.json({ xqedii: address });
});
app.get('/nickname', (req, res) => {
    res.json({ xqedii: nickname });
});
app.post('/start', (req, res) => {
    stop = false
    createBot();
});
app.post('/stop', (req, res) => {
    stop = true
});

app.post('/send-message', (req, res) => {
    const { message } = req.body;

    if (message) {
        ConsoleCommand = message;
    } else {
        res.status(400).json({ status: 'The Text Field is empty!' });
    }
});



app.post('/lobbyone', (req, res) => {
    lobby = 1;
});
app.post('/lobbytwo', (req, res) => {
    lobby = 2;
});

app.listen(port, () => {
    console.log(``)
    console.log(`░█████╗░██╗░░░░░░█████╗░███╗░░██╗░██████╗  ████████╗░█████╗░░█████╗░██╗░░░░░`)
    console.log(`██╔══██╗██║░░░░░██╔══██╗████╗░██║██╔════╝  ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░`)
    console.log(`██║░░╚═╝██║░░░░░███████║██╔██╗██║╚█████╗░  ░░░██║░░░██║░░██║██║░░██║██║░░░░░`)
    console.log(`██║░░██╗██║░░░░░██╔══██║██║╚████║░╚═══██╗  ░░░██║░░░██║░░██║██║░░██║██║░░░░░`)
    console.log(`╚█████╔╝███████╗██║░░██║██║░╚███║██████╔╝  ░░░██║░░░╚█████╔╝╚█████╔╝███████╗`)
    console.log(`░╚════╝░╚══════╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░  ░░░╚═╝░░░░╚════╝░░╚════╝░╚══════╝`)
    console.log(``)
    console.log(`               Server started on http://localhost:${port}`)
    console.log(``)
});

var version = "1.1"
var nickname = "Zaprosil"
var password = "test123"
var address = "CraftPlay.PL"
var members = 0
var invites = 0
var joins = 0
var messages = 0
var timespent = "0s"
let online = 0;
let lobby = 2;
let timer = 0;
let reqinvites = 5;
let stop = false
let InviteStart = false;
let message = [];
let lastMessage = "";
let ConsoleCommand = "";

let maxonline = 0;
fs.readFile('data/data.json', 'utf8', (err, data) => {
  if (err) {
    return;
  }
  const jsonData = JSON.parse(data);
  maxonline = jsonData.maxonline;
});

function createBot() {
    let currentlobby = lobby;
    message.push("Waiting for server...")
    const bot = mineflayer.createBot({
        host: address,
        username: `${nickname}`,
        version: 760,
        port: 25565
    });

    function updateMembers() {
        setTimeout(() => {
            bot.chat(`/clan info`)
            setTimeout(() => {
                let playersList = lastMessage.split(':')[1]?.trim();
                if (playersList) {
                    const players = playersList.split(',').map(player => player.trim()).filter(player => player.length > 0);
                    const numberOfPlayers = players.length;
                    members = numberOfPlayers;
                };
            }, 300); 
        }, 500); 
    }
    bot.once('login', () => {
        message.push(`Connected to the <b>${address}</b> server!`)
        message.push(" ", "<hr>", " ")
        setTimeout(() => {
            message.push(`Logging in to ${nickname} account...`)
            bot.chat(`/login ${password}`);
            setTimeout(() => {
                message.push(`Joining BedWars mode...`)
                bot.setQuickBarSlot(0);
                setTimeout(() => {
                    bot.activateItem();
                    setTimeout(() => {
                        bot.clickWindow(37, 0, 0)
                        setTimeout(() => {
                            message.push("", "Starting Clan Invites!")
                            message.push(" ", "<hr>", " ")
                            InviteStart = true
                            updateMembers()

                            setInterval(() => {
                                if (stop == true) {
                                    stop = false
                                    bot.quit();
                                    message.push(" ", "The bot has been disconnected from the server!", " ", "<hr>", " ")
                                    return;
                                }
                                if (currentlobby == lobby) {
                                    if (ConsoleCommand != "") {
                                        bot.chat(ConsoleCommand)
                                        message.push(`<b>Console:</b> ${ConsoleCommand}`)
                                        ConsoleCommand = "";
                                    }
                                } else {
                                    InviteStart = false
                                    currentlobby = lobby
                                    bot.setQuickBarSlot(8);
                                    bot.activateItem();
                                    setTimeout(() => {
                                        bot.clickWindow(lobby-1, 0, 0)
                                        message.push(" ",`Moved to Lobby <b>${lobby}</b>!`, " ")
                                        setTimeout(() => {
                                            InviteStart = true
                                        }, 1000);
                                    }, 500);
                                }
                            }, 1000);

                        }, 500);
                    }, 200);
                }, 200);
            }, 500);
        }, 1000);
    });
    bot.on('message', (jsonMsg) => {
        if (currentlobby == lobby) {
            let chatMess = jsonMsg.toString();
            if (chatMess.includes("Czlonkowie")) {
                lastMessage = chatMess;
            }
            if (chatMess.includes("dolaczyl do Twojego klanu")) {
                let parts = chatMess.split("»");
                let Final = parts[1] ? parts[1].trim() : "";
                message.push(`${Final}`);
                joins = joins+1;
            }
            if (chatMess.includes("zaprosil do klanu")) {
                invites = invites+1;
                InvCheck = InvCheck+1;
                timer = (InvCheck/5)*100
                reqinvites = 5-InvCheck;
                if (InvCheck >= 5) {
                    InvCheck = 0;
                    reqinvites = 5;
                    setTimeout(() => {
                        bot.chat(`/clan chat Discord klanu: www.discord.gg/NBJsHvWwGH`);
                        message.push(" ", "Information message has been sent!", " ")
                        messages = messages+1;
                        updateMembers()
                    }, 2000);
                    timer = 0;
                }
            }
        }
    });
    let invitedPlayers = new Set();
    let InvCheck = 0;
    bot.on('playerJoined', (player) => {
        if (InviteStart == true) {
            if (!invitedPlayers.has(player.username)) {
                setTimeout(() => {
                    bot.chat(`/clan invite ${player.username}`);
                    //bot.chat(`/msg ${player.username} Hej ${player.username}! Zapraszam do mojego klanu RCF! /klan accept RCF`);
                }, 3000);
                invitedPlayers.add(player.username);
            }
        }
        online = Object.keys(bot.players).length;
        function updateMaxOnline() {
            fs.readFile('data/data.json', 'utf8', (err, data) => {
                if (err || !data) return;
                let jsonData = JSON.parse(data || '{"maxonline": 0}');
                if (jsonData.maxonline < online) {
                    jsonData.maxonline = online;
                    maxonline = jsonData.maxonline
                    fs.writeFile('data/data.json', JSON.stringify(jsonData, null, 2), () => {});
                }
            });
        }
        updateMaxOnline();
    });
    bot.on('kicked', (info) => message.push(`<span style="color:#ff4d4d;"><b>Warning! Bot was kicked: ${info}</b></span>`));
    bot.on('error', (error) => message.push(`<span style="color:#ff4d4d;"><b>Warning: ${error}</b></span>`));    
}
function startTimer() {
    let totalSeconds = 0;

    setInterval(() => {
        totalSeconds++;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedTime = [days && `${days}d`, hours && `${hours}h`, minutes && `${minutes}m`, `${seconds}s`]
            .filter(Boolean).join(' ');

        timespent = formattedTime
    }, 1000);
}
startTimer();