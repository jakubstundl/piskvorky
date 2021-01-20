"use strict";
let field2 = [];
const mySymbol2 = "cross";
console.log(document.querySelectorAll(".square").length);
for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
    field2.push(new Field(i));
}
for (let i = 0; i < field2.length; i++) {
    field2[i].click(mySymbol2);
}
field2[0].dissableAll();
const p2Start = (player) => {
    fetch(`/getState?id=${game.getId()}`)
        .then((resp) => resp.json())
        .then((json) => {
        console.log(`json.player=${json.player} player=${player}`);
        if (json.player === player) {
            game.enableAll();
        }
        else {
            setTimeout(() => { p2Start(player); }, 1000);
        }
    });
};
p2Start(mySymbol2);
