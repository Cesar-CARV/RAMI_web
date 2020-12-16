const episodesContainer = document.querySelector(".episodes-container");

const api = "https://rickandmortyapi.com/api/episode?page="; // api + page;
let page = 1;


const createCard = async (episode) =>{
    let div = document.createElement("div");
    div.classList.add("card","card-episode");

    div.addEventListener("click",async (e)=>{
        let card = e.target;
        
        while(card.querySelector(".id-container") == null){
            card = card.parentElement;
        }

        let url = card.querySelector(".info-container").querySelector(".url-episode").value;
        let modal = document.querySelector(".modal-container");

        modal.style.display = "flex";
        await createModal(url);
        e.stopImmediatePropagation();
    },false);


    let gallery = "";
    let iteration = (episode.characters.length >=3) ? 3 : episode.characters.length;

    for (let i = 0; i < iteration; i ++){
        gallery += `<div><img src="${await (await(await fetch(episode.characters[i])).json()).image}"></div> `;
    }
        

    div.innerHTML = `
        <div class="id-container">
            <h3>${episode.id}</h3>
        </div>
        <div class="info-container">
            <h4 class="info-text">${episode.name}</h4>
            <p class="info-title">Air date:</p>
            <p class="info-text">${episode.air_date}</p>
            <p class="info-title">Season-episode:</p>
            <p class="info-text">${episode.episode}</p>
            <input type="hidden" class="url-episode" value="${episode.url}">
        </div>
        <div class="preview-gallery">
            ${gallery}
            <div><p>+${episode.characters.length-3}</p></div>
        </div>
    `;

    return div;

}

const addCard = async () =>{
    let fragmento = document.createDocumentFragment();

    let peticion = await fetch(api + page.toString());
    let res = await peticion.json();
    let episodes = await res.results;

    for (let i = 0; i < episodes.length; i++){
        let ep = await createCard(episodes[i]);
        fragmento.appendChild(ep);
    }
    //console.log(fragmento);
    episodesContainer.innerHTML = "";
    episodesContainer.appendChild(fragmento);

    controlPages("episodes: ",api,page);
}

window.addEventListener("load",e=>{
    addCard();
});

/* Modal */
const createModal = async (url) =>{
    let modal = document.querySelector(".modal");
    let peticion = await fetch(url);
    let episode = await peticion.json();


    let gallery= "";

    for (let i = 0; i < episode.characters.length; i++){
        let peticion = await fetch(episode.characters[i]);
        let res = await peticion.json();

        gallery += `<a href="characters.html?url=${res.url}"><img src="${res.image}" title="${res.name}"></a>`;
    }

    let newInnerHTML = `
    <div class="modal-menu">
        <h4 class="modal-title">Episode - ${episode.name}</h4>
        <input type="button" value="X" class="modal-close-button">
    </div>
    <div class="modal-information">
        <div class="modal-img">
            <div class="id-container">
                <h3>${episode.id}</h3>
            </div>
        </div>
        <div class="info-container">
            <h4 class="info-text">${episode.name}</h4>
            <p class="info-title">Air date:</p>
            <p class="info-text">${episode.air_date}</p>
            <p class="info-title">Season-episode:</p>
            <p class="info-text">${episode.episode}</p>
        </div>
    </div>

    <div class="modal-information">
        <div class="info-container">
            <p>Characters:</p>
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