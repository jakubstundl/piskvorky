"use strict";
//redirecting to game and players ids
document.getElementById("okBtn").addEventListener("click", () => {
  location.href = `/hra?id=${
    document.getElementById("gameID").innerHTML
  }&player=${document.getElementById("player1ID").innerHTML}`;
});

//function to get url params
const getQueryParams = (qs) => {
  //console.log(getQueryParams(document.location.search).id)
  qs = qs.split("+").join(" ");

  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while ((tokens = re.exec(qs))) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
};


//if no params show link for player2 else hide
if (getQueryParams(document.location.search).id != undefined) {
  document.getElementById("gameIDdiv").classList.add("gameIDdiv");
} else {
  document.getElementById("gameLink").innerHTML = `${window.location.host}/hra?id=${
    document.getElementById("gameID").innerHTML
  }&player=${document.getElementById("player2ID").innerHTML}`;
}

//returns string of the name of the field symbol
const fieldStringify = (field) => {
  let symbol = "";
  if (getSymbol(field) === "circle") {
    symbol = "o";
  } else {
    if (getSymbol(field) === "cross") {
      symbol = "x";
    } else {
      symbol = "-";
    }
  }
  return symbol;
};

//returns 100chars with the field states
//and send to flask function
const stateOfGame = () => {
  let xo = "";
  for (let i = 0; i < 100; i++) {
    xo += fieldStringify(btnsElm[i]);
  }
  sendToFlask(xo);
  return xo;
};

//function sending to backend the json
const sendToFlask = (stateOfGame) => {
  let game_id= getQueryParams(document.location.search).id
  let player = getQueryParams(document.location.search).player
  let sOg = stateOfGame
  let lastPush = isPlaying === 'circle' ? 'cross' : 'circle'
  let JSON_sent =  {"game_id":game_id,
                    "player":player,
                    "state_of_game":sOg,
                    "last_push":lastPush
                  };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "/hra", true);
  //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(JSON.stringify(JSON_sent));
};

const setState = (state) =>{  
  for (let i = 0; i < btnsElm.length; i += 1) {
    if(state[i] === "o"){
      if(!btnsElm[i].classList.contains("O")){
        btnsElm[i].classList.add("O")
      }
    }
    if(state[i] === "x"){
      if(!btnsElm[i].classList.contains("X")){
        btnsElm[i].classList.add("X")
      }
    }
  }
  }
  const getState = () =>{
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText)
          setState(this.responseText)
        }
      };
      xhttp.open("POST", "/getState", true);
      xhttp.send(getQueryParams(document.location.search).id);
    }

  setInterval(()=>{
  getState()
  console.log("getStateSent")
  }, 500)