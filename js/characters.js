const charactersContainer = document.querySelector(".characters-container");

const api = "https://rickandmortyapi.com/api/character?page="; // api + page;
let page = 1;

const getAllCharcaters = async (obj_page) =>{
    let respuesta = await obj_page.results;
    return respuesta;
}

const getMainCharacterInfo = async (obj_character) =>{
    let name = await obj_character.name;
    let status = await obj_character.status;
    let species = await obj_character.species;
    let lastKnowLocation = await obj_character.location;
    let urlImage = await obj_character.image;
    let urlCharacter = await obj_character.url;

    let peticion = await fetch(obj_character.episode[0]);
    let res = await peticion.json();

    let firstSeenIn = await res.name;

    let data = {
        name: name,
        status: status,
        species: species,
        lastKnowLocation: lastKnowLocation.name,
        firstSeenIn: firstSeenIn,
        image: urlImage,
        url: urlCharacter
    }

    return data;
}

const createCard = (obj_characterInfo) =>{
    let status = "status--unknow";
    if (obj_characterInfo.status == "Alive") status = "status--live";
    else if (obj_characterInfo.status == "Dead") status = "status--dead";

    let div = document.createElement("div");
    div.classList.add("card","card-character");
    
    div.addEventListener("click",async (e)=>{
        let card = e.target;
        
        while(card.querySelector(".img-container") == null){
            card = card.parentElement;
        }

        let url = card.querySelector(".info-container").querySelector(".url-character").value;
        let modal = document.querySelector(".modal-container");

        modal.style.display = "flex";
        await createModal(url);
        e.stopImmediatePropagation();
    },false);

    div.innerHTML = `
        <div class="img-container">
            <img src="${obj_characterInfo.image}" alt="">
        </div>
        <div class="info-container">
            <h4 class="info-text">${obj_characterInfo.name}</h4>
            <div class="info-status">
                <div class="status ${status}"></div>
                <p class="info-text">${obj_characterInfo.status} - ${obj_characterInfo.species}</p>
            </div>
            <p class="info-title">Last know location:</p>
            <p class="info-text">${obj_characterInfo.lastKnowLocation}</p>
            <p class="info-title">First seen in:</p>
            <p class="info-text">${obj_characterInfo.firstSeenIn}</p>
            <input type="hidden" class="url-character" value="${obj_characterInfo.url}">
        </div>
    `;

    return div;
}

const addCard = async () =>{
    let fragmento = document.createDocumentFragment();
    let characters = await getAllCharcaters(await getPage(api,page));

    for (let i = 0; i < characters.length; i++){
        let chrt = await getMainCharacterInfo(characters[i]);
        fragmento.appendChild(createCard(chrt));
    }
    //console.log(fragmento);
    charactersContainer.innerHTML = "";
    charactersContainer.appendChild(fragmento);

    controlPages("characters: ",api,page);
}

window.addEventListener("load",e=>{
    addCard();
});

/* Modal */
const createModal = async (url) =>{
    let modal = document.querySelector(".modal");
    let peticion = await fetch(url);
    let character = await peticion.json();

    let peticion2 = await fetch(character.episode[0]);
    let res = await peticion2.json();
    let firstSeenIn = res.name;

    let status = "status--unknow";
    if (character.status == "Alive") status = "status--live";
    else if (character.status == "Dead") status = "status--dead";

    let episodeList = `
    <ul class="modal-list">
    `;

    for (let i = 0; i < character.episode.length; i++){
        let peticion = await fetch(character.episode[i]);
        let res = await peticion.json();

        episodeList += `<li><a href="episodes.html?url=${character.episode[i]}" class="madal-list__item">${res.id} - ${res.name} - ${res.episode}</a></li>`;
    }
    episodeList += "</ul>";

    let newInnerHTML = `
        <div class="modal-menu">
            <h4 class="modal-title">Character - ${character.name}</h4>
            <input type="button" value="X" class="modal-close-button">
        </div>        

        <div class="modal-information">
            <div class="modal-img">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div class="info-container">
                <h4 class="info-text">${character.name}</h4>
                <div class="info-status">
                    <div class="status ${status}"></div>
                    <p class="info-text">${character.status} - ${character.species}</p>
                </div>
                <p class="info-title">Last know location:</p>
                <p class="info-text">${character.location.name}</p>
                <p class="info-title">First seen in:</p>
                <p class="info-text">${firstSeenIn}</p>
            </div>
        </div>
        
        <div class="modal-information">
            <div class="info-container">
                <p class="info-title">Gender:</p>
                <p class="info-text">${character.gender}</p>
                <p class="info-title">Type:</p>
                <p class="info-text">${character.type}</p>
                <p class="info-title">Origin:</p>
                <p class="info-text">${character.location.name}</p>
            </div>
        </div>
        <div class="modal-information">
            <div class="info-container">
                <p>Episodes:</p>
                <br>
                ${episodeList}
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
