
game.start();
/*
const link1:string = `${window.location.host}/hra-p2?id=${game.getId()}`
        const link2:HTMLLinkElement = document.getElementById("gameLink") as HTMLLinkElement;
        link2.innerHTML = `${window.location.host}/hra-p2?id=${game.getId()}`*/

   
        

const copyButton = () => {
        let input: HTMLInputElement= document.querySelector("#gameLink") as HTMLInputElement;
        input.select();
  input.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  const  tooltip:HTMLDivElement = document.getElementById("myTooltip") as HTMLDivElement;
  tooltip.innerHTML = "Copied: " + input.value;
}

const outFunc = () => {
        const  tooltip:HTMLDivElement = document.getElementById("myTooltip") as HTMLDivElement;
        tooltip.innerHTML = "Copy to clipboard";
      }