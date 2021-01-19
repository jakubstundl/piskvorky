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
    this.link2 = `${window.location.host}/hra-p2?id=${id}`;
    let span1: HTMLLinkElement = document.getElementById(
      "gameLink"
    ) as HTMLLinkElement;
    span1.href = this.link2;
    let buttonLink: HTMLButtonElement = document.getElementById(
      "okBtn"
    ) as HTMLButtonElement;
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
  gameState = () => {
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
  };
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

    fetch("/gameState", {
      method: "POST", // or 'PUT'
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
      .then((json) => {});
  }

  play() {}
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
