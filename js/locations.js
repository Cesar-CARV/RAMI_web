const locationsContainer = document.querySelector(".locations-container");

const api = "https://rickandmortyapi.com/api/location?page="; // api + page;
let page = 1;


const createCard = async (location) =>{
    let div = document.createElement("div");
    div.classList.add("card","card-episode");

    div.addEventListener("click",async (e)=>{
        let card = e.target;
        
        while(card.querySelector(".id-container") == null){
            card = card.parentElement;
        }

        let url = card.querySelector(".info-container").querySelector(".url-location").value;
        let modal = document.querySelector(".modal-container");

        modal.style.display = "flex";
        await createModal(url);
        e.stopImmediatePropagation();
    },false);


    let gallery = "";
    let iteration = (location.residents.length >=3) ? 3 : location.residents.length;

    for (let i = 0; i < iteration; i ++){
        gallery += `<div><img src="${await (await(await fetch(location.residents[i])).json()).image}"></div> `;
    }
        

    div.innerHTML = `
        <div class="id-container">
            <h3>${location.id}</h3>
        </div>
        <div class="info-container">
            <h4 class="info-text">${location.name}</h4>
            <p class="info-title">Type: </p>
            <p class="info-text">${location.type}</p>
            <p class="info-title">Dimension:</p>
            <p class="info-text">${location.dimension}</p>
            <input type="hidden" class="url-location" value="${location.url}">
        </div>
        <div class="preview-gallery">
            ${gallery}
            <div><p>+${location.residents.length-iteration}</p></div>
        </div>
    `;

    return div;

}

const addCard = async () =>{
    let fragmento = document.createDocumentFragment();

    let peticion = await fetch(api + page.toString());
    let res = await peticion.json();
    let location = await res.results;

     for (let i = 0; i < location.length; i++){
        let ep = await createCard(location[i]);
        fragmento.appendChild(ep);
     }
    //console.log(fragmento);
    locationsContainer.innerHTML = "";
    locationsContainer.appendChild(fragmento);

    controlPages("locations: ",api,page);
}

window.addEventListener("load",e=>{
    addCard();
});

/* Modal */
const createModal = async (url) =>{
    let modal = document.querySelector(".modal");
    let peticion = await fetch(url);
    let location = await peticion.json();


    let gallery= "";

    for (let i = 0; i < location.residents.length; i++){
        let peticion = await fetch(location.residents[i]);
        let res = await peticion.json();

        gallery += `<a href="characters.html?url=${res.url}"><img src="${res.image}" title="${res.name}"></a>`;
    }

    let newInnerHTML = `
    <div class="modal-menu">
        <h4 class="modal-title">Locatoin- ${location.name}</h4>
        <input type="button" value="X" class="modal-close-button">
    </div>
    <div class="modal-information">
        <div class="modal-img">
            <div class="id-container">
                <h3>${location.id}</h3>
            </div>
        </div>
        <div class="info-container">
            <h4 class="info-text">${location.name}</h4>
            <p class="info-title">Type: </p>
            <p class="info-text">${location.type}</p>
            <p class="info-title">Dimensino: </p>
            <p class="info-text">${location.dimension}</p>
        </div>
    </div>

    <div class="modal-information">
        <div class="info-container">
            <p>Residents:</p>
            <br>
            <div class="modal-gallery">
                ${gallery}
            </div>
        </div>
    </div>
    `;

    modal.innerHTML = newInnerHTML;
    
    let modalContainer = document.querySelector(".modal-container");
    let modalButton = document.querySelector(".modal-close-button");

    modalButton.addEventListener("click",() =>{
        modalContainer.style.display = "none";
        modal.innerHTML = `<div class="icon-load"></div>`;
    });
}