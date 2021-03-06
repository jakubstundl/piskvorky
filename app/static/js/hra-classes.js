"use strict";
class SymbolTurn {
    constructor() {
        this.symbol = "circle";
        this.picture = document.querySelector(".player div");
    }
    getSymbol() {
        return this.symbol;
    }
    setSymbolX() {
        this.symbol = "cross";
        this.picture.className = "cssCross";
    }
    setSymbolO() {
        this.symbol = "circle";
        this.picture.className = "cssCircle";
    }
}
let symbol = new SymbolTurn();
class Link {
    constructor() {
        this.id = "";
        this.link1 = "";
        this.link2 = "";
    }
    setLinks(id) {
        this.link1 = `/hra-p1?id=${id}`;
        this.link2 = `/hra-p2?id=${id}`;
        let input = document.getElementById("gameLink");
        input.value = `https://piskvorky-app.herokuapp.com/${this.link2}`;
        input.select();
        let buttonLink = document.getElementById("okBtn");
        buttonLink.addEventListener("click", () => {
            location.href = this.link1;
        });
        fetch(`/getQR?id=${id}`)
            .then(response => response.json())
            .then(data => {
            console.log("gameid" + game.id);
            console.log(data);
            let img = new Image();
            img.src = `data:image/png;base64,${data.img_data}`;
            let imageElement = document.querySelector(".grid");
            imageElement.innerHTML = `<img id="picture" src="data:image/png;base64,${data.img_data}" style="width:100%;height:auto">`;
        });
    }
    getLink1() {
        return this.link1;
    }
    getLink2() {
        return this.link2;
    }
}
let link = new Link();
class Game {
    constructor() {
        this.enableAll = () => {
            const buttons = [];
            for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
                buttons.push(document.querySelectorAll(".square")[i]);
            }
            let i = 0;
            let timer;
            const myTimer = () => {
                timer = setInterval(() => {
                    if (buttons[i].className === "square") {
                        buttons[i].disabled = false;
                    }
                    i++;
                    if (i === buttons.length) {
                        clearInterval(timer);
                    }
                }, 5);
            };
            myTimer();
        };
        this.id = 0;
    }
    start() {
        fetch("/newGame")
            .then((resp) => resp.json())
            .then((json) => {
            this.id = json.id;
            link.setLinks(this.id);
            let i = 0;
        });
    }
    getId() {
        const getQueryParams = (qs) => {
            //console.log(getQueryParams(document.location.search).id)
            qs = qs.split("+").join(" ");
            let params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while ((tokens = re.exec(qs))) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
            return params;
        };
        return getQueryParams(document.location.search).id.toString();
    }
    gameState() {
        let gameState = "";
        let buttons = [];
        for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
            buttons.push(document.querySelectorAll(".square")[i]);
        }
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].className === "square") {
                gameState += "-";
            }
            if (buttons[i].className === "square O") {
                gameState += "O";
            }
            if (buttons[i].className === "square X") {
                gameState += "X";
            }
        }
        return gameState;
    }
    setState(state, player) {
        let buttons = [];
        for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
            buttons.push(document.querySelectorAll(".square")[i]);
        }
        for (let i = 0; i < buttons.length; i++) {
            switch (state[i]) {
                case "-":
                    buttons[i].className = "square";
                    break;
                case "O":
                    buttons[i].className = "square O";
                    break;
                case "X":
                    buttons[i].className = "square X";
                    break;
            }
            switch (player) {
                case "circle":
                    symbol.setSymbolO();
                    break;
                case "cross":
                    symbol.setSymbolX();
            }
        }
    }
    sendGameState(player) {
        let data = {
            id: this.getId(),
            state: this.gameState(),
            player: player,
        };
        fetch("/setState", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
            //console.log("succes, now wait()");
            this.wait(player);
        })
            .catch((error) => {
            //console.error("Error:", error);
        });
    }
    wait(player) {
        setTimeout(() => {
            fetch(`/getState?id=${this.getId()}`)
                .then((resp) => resp.json())
                .then((json) => {
                //console.log(`json.player=${json.player} player=${player}`);
                if (json.player === player) {
                    //console.log(`json.state=${json.state} player=${player}`);
                    this.setState(json.state, json.player);
                    this.play();
                }
                else {
                    this.wait(player);
                }
            });
        }, 3000);
    }
    win(symbol) {
        setTimeout(() => {
            switch (symbol) {
                case "X":
                    if (confirm("Vyhrál křížek")) {
                        location.href = "/index";
                    }
                    else {
                        location.href = "/index";
                    }
                    break;
                case "O":
                    if (confirm("Vyhrálo kolečko")) {
                        location.href = "/index";
                    }
                    else {
                        location.href = "/index";
                    }
                    break;
            }
        }, 200);
    }
    checkWin(state) {
        //console.log(`checkWin ${state}`);
        const checkRows = (symbol) => {
            let n = 0;
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    // console.log(10 * i + j)
                    if (state[10 * i + j] === symbol) {
                        n++;
                        if (n > 4) {
                            // console.log(`win proc`);
                            this.win(symbol);
                        }
                        //console.log(`row n=${n}`);
                    }
                    else {
                        n = 0;
                    }
                }
            }
        };
        const checkColumns = (symbol) => {
            let n = 0;
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (state[10 * j + i] === symbol) {
                        n++;
                        if (n > 4) {
                            //console.log(`win proc`);
                            this.win(symbol);
                        }
                    }
                    else {
                        n = 0;
                    }
                }
            }
        };
        const checkLeanUp = (symbol) => {
            let n = 0;
            for (let i = 0; i < 6; i++) {
                for (let j = 4; j < 10; j++) {
                    for (let k = 0; k < 5; k++) {
                        if (state[10 * i + j + 9 * k] === symbol) {
                            n++;
                            if (n > 4) {
                                //console.log(`win proc`);
                                this.win(symbol);
                            }
                            //console.log(`row n=${n}`);
                        }
                        else {
                            n = 0;
                        }
                    }
                }
            }
        };
        const checkLeanDown = (symbol) => {
            let n = 0;
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    for (let k = 0; k < 5; k++) {
                        //console.log("leanDown"+(10 * i + j+ 11 * k))
                        if (state[10 * i + j + 11 * k] === symbol) {
                            n++;
                            if (n > 4) {
                                // console.log(`win proc`);
                                this.win(symbol);
                            }
                            //console.log(`row n=${n}`);
                        }
                        else {
                            n = 0;
                        }
                    }
                }
            }
        };
        checkColumns("X");
        checkRows("X");
        checkColumns("O");
        checkRows("O");
        checkLeanDown("O");
        checkLeanDown("X");
        checkLeanUp("O");
        checkLeanUp("X");
    }
    play() {
        this.enableAll();
        this.checkWin(this.gameState());
    }
}
let game = new Game();
class Field {
    constructor(fieldNumber) {
        this.fieldNumber = fieldNumber;
        this.field = document.querySelectorAll(".square")[this.fieldNumber];
    }
    setSymbol(symbol) {
        if (symbol === "circle") {
            this.field.className = `square O`;
        }
        else if (symbol === "cross") {
            this.field.className = `square X`;
        }
    }
    setXByClick() {
        this.field.classList.add("X");
        symbol.setSymbolO();
    }
    setOByClick() {
        this.field.classList.add("O");
        symbol.setSymbolX();
    }
    dissableAll() {
        const buttons = [];
        for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
            buttons.push(document.querySelectorAll(".square")[i]);
        }
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }
    click(mySymbol) {
        if (mySymbol === "circle") {
            this.field.addEventListener("click", () => {
                //console.log("Click " + mySymbol);
                this.setOByClick();
                this.dissableAll();
                game.sendGameState(mySymbol);
                // console.log(game.sendGameState(mySymbol));
                game.wait(mySymbol);
                game.checkWin(game.gameState());
            });
        }
        if (mySymbol === "cross") {
            this.field.addEventListener("click", () => {
                // console.log("Click " + mySymbol);
                this.setXByClick();
                this.dissableAll();
                game.sendGameState(mySymbol);
                // console.log(game.sendGameState(mySymbol));
                game.wait(mySymbol);
                game.checkWin(game.gameState());
            });
        }
    }
}
