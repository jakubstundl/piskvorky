"use strict";
game.start();
/*
const link1:string = `${window.location.host}/hra-p2?id=${game.getId()}`
        const link2:HTMLLinkElement = document.getElementById("gameLink") as HTMLLinkElement;
        link2.innerHTML = `${window.location.host}/hra-p2?id=${game.getId()}`*/
const copyButton = () => {
    let input = document.querySelector("#gameLink");
    input.select();
    input.setSelectionRange(0, 99999); /* For mobile devices */
    /* Copy the text inside the text field */
    document.execCommand("copy");
    const tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied: " + input.value;
};
const outFunc = () => {
    const tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
};
