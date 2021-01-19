"use strict";
let field1 = [];
const mySymbol1 = "circle";
console.log(document.querySelectorAll(".square").length);
for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
    field1.push(new Field(i));
}
for (let i = 0; i < field1.length; i++) {
    field1[i].click(mySymbol1);
}
