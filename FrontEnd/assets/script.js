import {token as authToken} from "./login.js";
import {userId} from "./login.js";

let galerie = document.querySelector('.gallery');

let image = -1;

async function fetchProjects(){
    let projet = await fetch('http://localhost:5678/api/works', {
    method: 'GET',
    headers:{
        "Accept": "application/json",
    }
})
    if (projet.ok === true){
    let projets = await projet.json()
    console.log(projets)

    for (let i = 0; i < projets.length; i++){
        image++;

// Création des images pour la galerie de la page d'accueil

        let imageFigure = document.createElement('figure');

        imageFigure.setAttribute('class', 'projets');
        
        imageFigure.setAttribute('id', projets[image].id)

        galerie.appendChild(imageFigure);

        let imagesProjets = document.createElement('img');

        imagesProjets.setAttribute('class', 'img-projet');

        imageFigure.classList.add('active');

        imageFigure.dataset.category = projets[image].category.name;

        imageFigure.appendChild(imagesProjets);

        imagesProjets.src = projets[image].imageUrl;

        let projectName = document.createElement('figcaption');

        projectName.setAttribute('class', 'project-name');

        projectName.innerText = projets[image].title;

        imageFigure.appendChild(projectName);

// Création des images pour la modal

        let modalFigure = document.createElement('figure');

        modalFigure.setAttribute('class', 'projets');

        modalFigure.classList.add('active');

        modalFigure.classList.add('modal-project')

        modalFigure.dataset.category = projets[image].category.name;

        modalFigure.setAttribute('id', projets[image].id);

        let modalImages = document.createElement('img');

        modalImages.src = projets[image].imageUrl;

        modalFigure.appendChild(modalImages)

        let editProject = document.createElement('figcaption');

        editProject.setAttribute('class', 'edit-project');

        editProject.innerText = 'éditer';

        modalFigure.appendChild(editProject);

        modalProjects.appendChild(modalFigure);

// Création des icônes

        let deleteIcon = document.createElement('i');

        deleteIcon.setAttribute('class', 'fa-solid');

        deleteIcon.classList.add('fa-trash-can');

        deleteIcon.setAttribute('id', projets[image].id);

        modalFigure.appendChild(deleteIcon);

        let moveIcon = document.createElement('i');

        moveIcon.setAttribute('class', 'fa-solid');

        moveIcon.classList.add('fa-arrows-up-down-left-right');

        moveIcon.classList.add('inactive');

        moveIcon.setAttribute('id', projets[image].id);

        modalFigure.appendChild(moveIcon);
    }

    const modalProject = document.querySelectorAll('.modal-project');
    const arrowIcon = document.querySelectorAll('.fa-arrows-up-down-left-right');

    for(let projet of modalProject){
        let tag = projet.id
        projet.addEventListener('mouseenter', function(){
            for(let icon of arrowIcon){
                if(icon.id === tag){
                    icon.classList.replace('inactive', 'active');
                }
            }
        });
        projet.addEventListener('mouseleave', function(){
            for(let icon of arrowIcon){
                if(icon.id === tag){
                    icon.classList.replace('active', 'inactive');
                }
            }
        })
    }
}
    else{
        throw new Error('Impossible de récupérer la liste des projets');
}}

window.onload = fetchProjects();

const filters = document.querySelectorAll('.filter');

for(let filter of filters){
    filter.addEventListener('click', function(){
        let tag = this.id;

        document.querySelector('.selected').classList.remove('selected');
        this.classList.add('selected');

        let projets = document.querySelectorAll('.projets');

        for(let projet of projets){
            projet.classList.replace('active', 'inactive')

            if(tag === projet.dataset.category){
                projet.classList.replace('inactive', 'active');
            }
            if(tag === 'tous'){
                projet.classList.replace('inactive', 'active');
            }
        }
    });
}


const user = {email: 'sophie.bluel@test.tld', password: 'S0phie'};
const userSophie = '1';
const editProjects = document.querySelector('#edit-projects');


async function editorMode(){
    let response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            });
            if(response.ok === true){
                let result = await response.json();
                localStorage.setItem('token', result.token)
            }
            else{
                throw new Error('Impossible de passer en mode éditeur')
            }
        }


const editorBanner = document.querySelector('.editor-banner');
const editButton = document.querySelectorAll('.edit');
const header = document.querySelector('header');

window.onload = () => {
    if (userId === userSophie){
        editorMode()
        const token = localStorage.getItem('token');
        if(authToken === token){

            editorBanner.classList.replace('inactive', 'active');

            for(let e of editButton){
                e.classList.replace('inactive', 'active');
            }
            
            header.setAttribute('class', 'header-margin');
            }
        }
}

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModal = document.querySelector('.modal-close');
const modalProjects = document.querySelector('.modal-projects');
const formCategories = document.querySelector('#category');




async function getCategories(){
    let response = await fetch('http://localhost:5678/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            });
            if(response.ok === true){
                let result = await response.json();

                for(let category of result){
                    let options = document.createElement('option');
                    options.value = category.name;
                    options.innerText = category.name;
                    formCategories.appendChild(options);
                }
            }
            else{
                throw new Error('Impossible de passer en mode éditeur')
            }
        }

function openModal(){
    modal.classList.replace('inactive', 'active');
    overlay.classList.replace('inactive', 'active');
    getCategories();
}

function modalClose(){
    modal.classList.replace('active', 'inactive');
    modalSubmit.classList.replace('active', 'inactive');
    overlay.classList.replace('active', 'inactive');
}

editProjects.addEventListener('click', openModal)

closeModal.addEventListener('click', modalClose)

overlay.addEventListener('click', function modalCloseOutside(e){
    if(e.target != modal){
        modalClose()
    }
})

const addPicture = document.querySelector('.add-picture');
const modalReturn = document.querySelector('.modal-return');
const modalSubmit = document.querySelector('.submit');
const modalCloseSubmit = document.querySelector('.modal-close-submit');

addPicture.addEventListener('click', function(){
    modal.classList.replace('active', 'inactive');
    modalSubmit.classList.replace('inactive', 'active');
})

modalReturn.addEventListener('click', function(){
    modal.classList.replace('inactive', 'active');
    modalSubmit.classList.replace('active', 'inactive');
})

modalCloseSubmit.addEventListener('click', function(){
    modalSubmit.classList.replace('active', 'inactive');
    overlay.classList.replace('active', 'inactive');
})




















