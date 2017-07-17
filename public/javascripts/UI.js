const Tabs = require("./Tabs")

class UI {
    constructor (app) {
        this.app = app
        this.tabs = new Tabs(app)
        this.usernameTxt = $('header .team .name')
        this.scoreTxt = $('header .team .score')
    }
    initProfile (myTeam) {
        this.usernameTxt.innerHTML = myTeam.name
        this.scoreTxt.innerHTML = myTeam.score
    }
    setTimer (seconds) {
        let secs = seconds % 60
        let mins = (seconds - secs) / 60
        if (secs < 10) secs = "0" + secs
        $("header > time").innerHTML = seconds > 0 ? (mins + ":" + secs) : "Time's up!"
    }
    announceHighScore () {
        document.body.classList.add('highscore-mode')
        setTimeout(() => document.body.classList.remove('highscore-mode'), 2500)
    }
}

module.exports = UI