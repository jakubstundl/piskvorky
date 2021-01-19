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
