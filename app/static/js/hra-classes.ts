class SymbolTurn {
  symbol: string;
  picture: HTMLImageElement;
  constructor() {
    this.symbol = "circle";
    this.picture = document.querySelector(".player div") as HTMLImageElement;
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
  id: string;
  link1: string;
  link2: string;
  constructor() {
    this.id = "";
    this.link1 = "";
    this.link2 = "";
  }
  setLinks(id: number) {
    this.link1 = `/hra-p1?id=${id}`;
    this.link2 = `/hra-p2?id=${id}`;
    let span1: HTMLLinkElement = document.getElementById(
      "gameLink"
    ) as HTMLLinkElement;
    span1.href = this.link2;
    let buttonLink: HTMLButtonElement = document.getElementById(
      "okBtn"
    ) as HTMLButtonElement;
    buttonLink.addEventListener("click", () => {
      location.href = this.link1;
    })
    fetch(`/getQR?id=${id}`)
    .then(response => response.json())
    .then(data => {
            console.log("gameid"+game.id);
            console.log(data)
            let img = new Image();
            img.src = `data:image/png;base64,${data.img_data}`;
            let imageElement = document.querySelector(".grid") as HTMLImageElement;
            imageElement.innerHTML = `<img id="picture" src="data:image/png;base64,${data.img_data}" style="width:100%;height:auto">`;
   }
    );
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
  id: number;
  constructor() {
    this.id = 0;
  }
  start() {
    fetch("/newGame")
      .then((resp) => resp.json())
      .then((json) => {
        this.id = json.id;
        link.setLinks(this.id);
        let i: number = 0;
      });
  }
  getId() {
    const getQueryParams = (qs: string) => {
      //console.log(getQueryParams(document.location.search).id)
      qs = qs.split("+").join(" ");

      let params: any = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

      while ((tokens = re.exec(qs))) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }

      return params;
    };

    return getQueryParams(document.location.search).id.toString();
  }
  enableAll = () => {
    const buttons: Array<HTMLButtonElement> = [];
    for (
      let i: number = 0;
      i < document.querySelectorAll(".square").length;
      i++
    ) {
      buttons.push(
        document.querySelectorAll(".square")[i] as HTMLButtonElement
      );
    }
    let i: number = 0;
    let timer: number;

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
  gameState() {
    let gameState: string = "";
    let buttons: Array<HTMLButtonElement> = [];
    for (
      let i: number = 0;
      i < document.querySelectorAll(".square").length;
      i++
    ) {
      buttons.push(
        document.querySelectorAll(".square")[i] as HTMLButtonElement
      );
    }
    for (let i: number = 0; i < buttons.length; i++) {
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
  setState(state: string, player: string) {
    let buttons: Array<HTMLButtonElement> = [];
    for (
      let i: number = 0;
      i < document.querySelectorAll(".square").length;
      i++
    ) {
      buttons.push(
        document.querySelectorAll(".square")[i] as HTMLButtonElement
      );
    }
    for (let i: number = 0; i < buttons.length; i++) {
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
  sendGameState(player: string) {
    interface Data {
      id: string;
      state: string;
      player: string;
    }
    let data: Data = {
      id: this.getId(),
      state: this.gameState(),
      player: player,
    };

    fetch("/setState", {
      method: "POST", // or 'PUT'
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
  wait(player: string) {
    setTimeout(() => {
      fetch(`/getState?id=${this.getId()}`)
        .then((resp) => resp.json())
        .then((json) => {
          //console.log(`json.player=${json.player} player=${player}`);
          if (json.player === player) {
            //console.log(`json.state=${json.state} player=${player}`);
            this.setState(json.state, json.player);
            this.play();
          } else {
            this.wait(player);
          }
        });
    }, 3000);
  }
  win(symbol: string) {
    setTimeout(() => {
      switch (symbol) {
        case "X":
          if (confirm("Vyhrál křížek")) {
            location.href = "/index";
          } else {
            location.href = "/index";
          }
          break;
        case "O":
          if (confirm("Vyhrálo kolečko")) {
            location.href = "/index";
          } else {
            location.href = "/index";
          }
          break;
      }
    }, 200);
  }
  checkWin(state: string) {
    //console.log(`checkWin ${state}`);

    const checkRows = (symbol: string) => {
      let n: number = 0;
      for (let i: number = 0; i < 10; i++) {
        for (let j: number = 0; j < 10; j++) {
         // console.log(10 * i + j)
          if (state[10 * i + j] === symbol) {
            
            n++;
            if (n > 4) {
             // console.log(`win proc`);
              this.win(symbol);
            }
            //console.log(`row n=${n}`);
          } else {
            n = 0;
          }
        }
      }
    };
    const checkColumns = (symbol: string) => {
      let n: number = 0;
      for (let i: number = 0; i < 10; i++) {
        for (let j: number = 0; j < 10; j++) {
          if (state[10 * j + i] === symbol) {
            n++;
            if (n > 4) {
              //console.log(`win proc`);
              this.win(symbol);
            }
          } else {
            n = 0;
          }
        }
      }
    };
    const checkLeanUp = (symbol: string) => {
      let n: number = 0;
      for (let i: number = 0; i < 6; i++) {
        for (let j: number = 4; j < 10; j++) {
          for(let k: number = 0;k<5;k++){
            
              
            if (state[10 * i + j+ 9 * k] === symbol) {
             n++;
              if (n > 4) {
                //console.log(`win proc`);
                this.win(symbol);
              }
              //console.log(`row n=${n}`);
            } else {
              n = 0;
            }
          }
          
        }
      }
    };
    const checkLeanDown = (symbol: string) => {
      let n: number = 0;
      for (let i: number = 0; i < 5; i++) {
        for (let j: number = 0; j < 5; j++) {
          for(let k: number = 0;k<5;k++){
            //console.log("leanDown"+(10 * i + j+ 11 * k))
            if (state[10 * i + j+ 11 * k] === symbol) {
              
              n++;
              if (n > 4) {
               // console.log(`win proc`);
                this.win(symbol);
              }
              //console.log(`row n=${n}`);
            } else {
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
    checkLeanDown("O")
    checkLeanDown("X")
    checkLeanUp("O")
    checkLeanUp("X")

  }

  play() {
    
    this.enableAll();
    this.checkWin(this.gameState());
  }
}
let game = new Game();

class Field {
  fieldNumber: number;
  field: HTMLButtonElement;
  constructor(fieldNumber: number) {
    this.fieldNumber = fieldNumber;
    this.field = document.querySelectorAll(".square")[
      this.fieldNumber
    ] as HTMLButtonElement;
  }
  setSymbol(symbol: string) {
    if (symbol === "circle") {
      this.field.className = `square O`;
    } else if (symbol === "cross") {
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
    const buttons: Array<HTMLButtonElement> = [];
    for (
      let i: number = 0;
      i < document.querySelectorAll(".square").length;
      i++
    ) {
      buttons.push(
        document.querySelectorAll(".square")[i] as HTMLButtonElement
      );
    }

    for (let i: number = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
  click(mySymbol: string) {
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
