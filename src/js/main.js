// Import our custom CSS
import '../scss/styles.scss';
import { Modal } from 'bootstrap';

let page = 1;
let maxNumPages = 0;

document.addEventListener("DOMContentLoaded", async () => {
    const charactersData = await getApiData('/character');

    if (!maxNumPages) {
        maxNumPages = charactersData.info.pages; 
    }
   
    renderCards(charactersData);
});

async function getApiData(path) {
    document.querySelector('.loader').classList.remove('visually-hidden');

    try {
        const response = await fetch(`https://rickandmortyapi.com/api${path}`);
      
        return await response.json();
    } catch (e) {
        alert('Something went wrong!');
    }
}

function renderCards(item, byPage = false) {
    if (byPage) {
        document.querySelector('.characters-list').textContent = '';
    }
    
    let rowID = ``;

    item.results.forEach(({id, name, image}, index) => {
        if (index % 4 === 0) {
            rowID = `row-${page}${index}`;
            
            document.querySelector('.characters-list')
                .insertAdjacentHTML('beforeend', `<div id="${rowID}" class="row row-cols-2 row-cols-md-4 mx-0 gx-5"></div>`);
        }

        const characterItem = `<div class="col p-1 mb-5 shadow-sm rounded bg-body-tertiary">
                <div class="character px-0 position-relative start-50 top-0 translate-middle" data-id="${id}">
                    <img src="${image}" alt="" class="w-75 shadow rounded character-img">
                    <div class="character-name mt-3">${name}</div>
                </div>
            </div>`;
        
        document.querySelector(`#${rowID}`)
            .insertAdjacentHTML('beforeend', characterItem);
    }); 

    document.querySelector('.loader').classList.add('visually-hidden');
    toTop();
}

//open modal character
document.addEventListener('click', async (e) => {
    e.preventDefault();

    if (e.target.classList.contains("character") || e.target.closest(".character")) {
        let characterId = e.target.dataset.id;

        if (!characterId) {
            characterId = e.target.parentNode.dataset.id
        }

        const characterData = await getApiData(`/character/${characterId}`);
        renderContentModal(characterData);       
    }   
});

function renderContentModal(item) {
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            let data = item[key];

            if (key === 'origin' || key === 'location') data = item[key].name;

            let container = document.querySelector(`.modal .container-fluid .${key}`);
            
            if (container) {
                if (key === 'image') {
                    container.src = data;
                } else {
                    container.innerText = data;
                }         
            }
        }
    }

    const myModal = new Modal('#characterModal');
    myModal.show();
    document.querySelector('.loader').classList.add('visually-hidden');
}

function updatePageNumber() {
    console.log(page);

    document.querySelector('.page-link.page').innerText = page;
}

document.getElementById('myBtn').addEventListener('click', toTop);

function toTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

//pagination
document.querySelector('.next').addEventListener('click', toNext);
document.querySelector('.previous').addEventListener('click', toPrev);

async function toNext(e) {
    e.preventDefault();
    window.removeEventListener('scroll', showNextPageOnScroll);

    if (page > 0) {
        document.querySelector('.page-item').classList.remove('disabled');
        document.querySelector('#prev').disabled = false;
    }

    page++;

    const charactersData = await getApiData(`/character/?page=${page}`);
    renderCards(charactersData, true);
    updatePageNumber();

    if (page === maxNumPages) {
        e.target.closest('.page-item').classList.add('disabled');
        e.target.disabled = true;
    }

    setTimeout(() => window.addEventListener('scroll', showNextPageOnScroll), 150);
} 

async function toPrev(e) {
    e.preventDefault();
    window.removeEventListener('scroll', showNextPageOnScroll);
    
    if (page <= maxNumPages) {
        document.querySelector('.page-item').classList.remove('disabled');
        document.querySelector('#next').disabled = false;
    }
   
    page--;
    
    const charactersData = await getApiData(`/character/?page=${page}`);
    renderCards(charactersData, true);
    updatePageNumber();

    if (page === 1){
        e.target.closest('.page-item').classList.add('disabled');
        e.target.disabled = true;
    }

    setTimeout(() => window.addEventListener('scroll', showNextPageOnScroll), 150);
} 

//scroll down next page
window.addEventListener('scroll', showNextPageOnScroll);

async function showNextPageOnScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
        page++;

        const charactersData = await getApiData(`/character/?page=${page}`);
        renderCards(charactersData);
        
        updatePageNumber();
    }

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById('myBtn').style.display = "block";
    } else {
        document.getElementById('myBtn').style.display = "none";
    }
}

