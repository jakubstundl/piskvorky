
game.start();
/*
const link1:string = `${window.location.host}/hra-p2?id=${game.getId()}`
        const link2:HTMLLinkElement = document.getElementById("gameLink") as HTMLLinkElement;
        link2.innerHTML = `${window.location.host}/hra-p2?id=${game.getId()}`*/
        fetch(`/getQR?id=${game.id}`)
        .then(response => response.json())
        .then(data => {
                console.log(data)
                let img = new Image();
                img.src = `data:image/png;base64,${data.img_data}`;
                let imageElement = document.querySelector(".grid") as HTMLImageElement;
                imageElement.innerHTML = `<img id="picture" src="data:image/png;base64,${data.img_data}" style="width:100%;height:auto">`;
       }
        );

