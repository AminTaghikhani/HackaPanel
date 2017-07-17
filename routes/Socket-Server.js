const moment = require("moment");
const config = require("../panel.config")
const CodeCompiler = require('./CodeCompiler')

const start = moment().set(config.time.start)
const end = moment().set(config.time.end)
const getRemainingTime = () => -moment().diff(end, 'seconds')

class SocketServer {
    constructor (io, teamAuth) {
        this.io = io
        this.compiler = new CodeCompiler(this)
        this.teamAuth = teamAuth
        this.io.on("connection", this.onUserConnected.bind(this))
        setInterval(() => { this.tick() }, 1000)
    }
    onUserConnected (socket) {
        this.io.to(socket.id).emit("initial-settings", {
            id: socket.id,
            time: getRemainingTime(),
            teams: config.teams
        })
        socket.on('disconnect', () => this.teamAuth.disconnect(socket.id))
        socket.on("user-connect", this.onUserRequestedToConnect.bind(this))
        socket.on("user-run", data => this.onUserRequestRunTheCode(socket.id, data))
        socket.on("user-submit", data => this.onUserRequestedToSubmitTheCode(socket.id, data))
    }
    onUserRequestedToConnect (data) {
        this.teamAuth.teams[data.username].connect = true
        this.teamAuth.teams[data.username].id = data.id
    }
    onUserRequestRunTheCode (id, data) {
        data.id = id
        data.username = this.teamAuth.findTeamIndexById(id)
        this.compiler.run(0, data, response => {
            this.sendConsoleResponse(response)
        })
    }
    onUserRequestedToSubmitTheCode (id, data) {
        data.id = id
        data.username = this.teamAuth.findTeamIndexById(id)
        this.compiler.volly(data, result => {
            this.setScore(result.username, result.score)
        })
    }
    tick () {
        this.io.emit("time-sync", getRemainingTime())
    }
    setScore (username, score) {
        if (config.teams[username].score < score) {
            config.teams[username].score = score
            this.io.emit("score-changed", {
                username: username,
                score: score
            })
        }
    }
    sendConsoleResponse (response) {
        this.io.to(response.id).emit("console-response", response)
    }
}

module.exports = SocketServer