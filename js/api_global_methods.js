const backbutton = document.querySelector(".back-button");
const nextbutton = document.querySelector(".next-button");

const infoApiInfo = document.querySelector(".info-api__info");
const numPage = document.querySelector(".page-num");

const getPage = async (api, pag) =>{
    let peticion = await fetch(api + pag.toString());
    let respuesta = await peticion.json();
    return respuesta;

}

const getPageInfo = async (obj_page) =>{
    let next = await obj_page.info.next;
    let prev = await obj_page.info.prev;
    let count = await obj_page.info.count;
    let pages = await obj_page.info.pages;

    return {pages: pages, next_pg: next, prev_pg: prev, count: count};
}

const controlPages = async (text, api, page) =>{
    let info = await getPageInfo(await getPage(api, page));
    infoApiInfo.innerText = text  + info.count;
    numPage.innerText = page + " / " + info.pages;


    backbutton.classList.add("button-off");
    nextbutton.classList.add("button-off");

    if (info.prev_pg !== null) backbutton.classList.toggle("button-off");
    else console.log("No hay una pagina previa");

    if (info.next_pg !== null)nextbutton.classList.toggle("button-off");
    else console.log("No hay una pagina siguiente");
}


nextbutton.addEventListener("click", e=> {
    let button = e.target;

    clickControlPageButton(button, 1);

});

backbutton.addEventListener("click", e=> {
    let button = e.target;

    clickControlPageButton(button, -1);

});

const clickControlPageButton = (button, operation) =>{
    let container = document.querySelector(".flex-container");
    if (!button.classList.contains("button-off")){
        page += operation;
        button.classList.toggle("button-off");
        container.innerHTML = `<div class="icon-load"></div>`;
        addCard();
        location.href = "#";
    }
}