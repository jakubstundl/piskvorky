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
        this.link2 = `${window.location.host}/hra-p2?id=${id}`;
        let span1 = document.getElementById("gameLink");
        span1.href = this.link2;
        let buttonLink = document.getElementById("okBtn");
        buttonLink.addEventListener("click", () => {
            location.href = this.link1;
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
                        console.log(i);
                    }
                    i++;
                    if (i === buttons.length) {
                        clearInterval(timer);
                    }
                }, 5);
            };
            myTimer();
        };
        this.gameState = () => {
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
    sendGameState(player) {
        let data = {
            id: this.getId(),
            state: this.gameState(),
            player: player,
        };
        fetch("/gameState", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
            console.log("succes, now wait()");
            this.wait();
        })
            .catch((error) => {
            console.error("Error:", error);
        });
    }
    wait() {
        fetch(`/gameState/${this.getId()}`)
            .then((resp) => resp.json())
            .then((json) => { });
    }
    play() { }
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
                console.log("Click");
                this.setOByClick();
                this.dissableAll();
                game.sendGameState(mySymbol);
            });
        }
        if (mySymbol === "cross") {
            this.field.addEventListener("click", () => {
                console.log("Click");
                this.setXByClick();
                this.dissableAll();
                game.sendGameState(mySymbol);
            });
        }
    }
}
