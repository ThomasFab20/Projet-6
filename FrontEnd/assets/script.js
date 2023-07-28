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
}).catch(e => {
    console.log("Il y'a un problème !");
    console.log(e);
})
    if (projet.ok === true){
    let projets = await projet.json()

    for (let i = 0; i < projets.length; i++){
        image++;

// Création des images pour la galerie de la page d'accueil

        let imageFigure = document.createElement('figure');

        imageFigure.setAttribute('class', 'projets');
        
        imageFigure.setAttribute('id', projets[image].id);

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

        modalImages.setAttribute('class', 'projets-images')

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

    // Ajout de l'icône avec les flèches lors du hover

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

    // Ajout de la suppression de projet lors du clic sur les icônes de poubelle

    const deleteButton = document.querySelectorAll('.fa-trash-can');
    
    for(let button of deleteButton){
        let tag = button.id;
        button.addEventListener('click', async function(){
            for(let projet of modalProject){
                let id = projet.id;
                if(tag === id){
                    await fetch(`http://localhost:5678/api/works/${id}`,{
                        method: 'DELETE',
                        headers:{
                            'Authorization': `Bearer ${authToken}`
                        },
                }).catch(e => {
                    console.log("il y'a un problème !");
                    console.log(e);
                }).then(() =>{
                    projet.style.visibility='hidden'
                })
                }
            }
        })
    }
}
    else{
        throw new Error('Impossible de récupérer la liste des projets');
}}

// Appel de l'API pour récupérer tous les projets et les ajouter au HTML lors du chargement de la page

window.onload = fetchProjects();

// Mise en place du filtrage des projets lors du clic sur les différents filtres

// Appel de l'API pour récupérer les différentes catégories de projet puis les ajouter au formulaire d'ajout de projet

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
                    options.value = category.id;
                    options.name = "category";
                    options.innerText = category.name;
                    formCategories.appendChild(options);
                }
            }
            else{
                throw new Error('Impossible de passer en mode éditeur')
            }
        }

async function createFilter(){

    const filterList = document.querySelector('.filters');


    let response = await fetch('http://localhost:5678/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            });
            if(response.ok === true){
                let result = await response.json();

                for(let category of result){
                    const filter = document.createElement('button');

                    filter.classList.add('filter');

                    filter.setAttribute('id', category.name);

                    filter.innerText = category.name;

                    filterList.appendChild(filter)
                }
            }

    const filters = document.querySelectorAll('.filter')

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
}

window.onload = createFilter()

const user = {email: 'sophie.bluel@test.tld', password: 'S0phie'};
const userSophie = '1';
const editProjects = document.querySelector('#edit-projects');

// Récupération du token dans l'API afin de le comparer avec celui récupéré lors de l'authentification

async function tokenVerif(){
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

// Changement dans le HTML pour passer en mode éditeur et donner accès aux modales

window.onload = () => {
    if (userId === userSophie){
        tokenVerif()
        const token = localStorage.getItem('token');
        if(authToken === token){

            const filters = document.querySelector('.filters')

            filters.style.visibility='hidden';

            editorBanner.classList.replace('inactive', 'active');

            for(let e of editButton){
                e.classList.replace('inactive', 'active');
            }
            
            header.setAttribute('class', 'header-margin');
            }
        }
    getCategories()
}

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModal = document.querySelectorAll('.close');
const modalProjects = document.querySelector('.modal-projects');
const formCategories = document.querySelector('#category');


const formPicture = document.querySelector('#picture');
const imageDiv = document.querySelector('#preview-div');
const imagePreview = document.createElement('img');
const imageFormFile = document.querySelector('.fa-image');
const labelFormFile = document.querySelector('.picture-upload');
const sizeFormFile = document.querySelector('.file-max-size');

// Afficher les modales lors du clic sur le bouton modifier au dessus de la gallerie

function openModal(){
    modal.classList.replace('inactive', 'active');
    overlay.classList.replace('inactive', 'active');
}

// Cacher les modales lors du clic sur le bouton fermer ou en dehors de la modale puis rechargement de la page

function modalClose(){
    modal.classList.replace('active', 'inactive');
    modalSubmit.classList.replace('active', 'inactive');
    overlay.classList.replace('active', 'inactive');

    imageFormFile.classList.replace('hidden', 'active');
    labelFormFile.classList.replace('hidden', 'active');
    sizeFormFile.classList.replace('hidden', 'active');
    imageDiv.classList.replace('active', 'inactive');
    window.location.reload()
}

editProjects.addEventListener('click', openModal)

// Ajout de l'écouteur d'événement sur les boutons pour fermer les modales

for(let modal of closeModal){
    modal.addEventListener('click', async function(){
        modalClose();
    })
}

// Ajout de l'écouteur d'événement en dehors de la modale pour fermer les modales

overlay.addEventListener('click', function modalCloseOutside(e){
    if(e.target != modal){
        modalClose();
    }
})

const addPicture = document.querySelector('.add-picture');
const modalReturn = document.querySelector('.modal-return');
const modalSubmit = document.querySelector('.submit');
const modalCloseSubmit = document.querySelector('.modal-close-submit');

// Ajout de l'écouteur d'événement sur le bouton d'ajout de projet pour afficher la seconde modale

addPicture.addEventListener('click', function(){
    modal.classList.replace('active', 'inactive');
    modalSubmit.classList.replace('inactive', 'active');
})

// Ajout de l'écouteur d'événement pour revenir à la première modale grâce à la flèche

modalReturn.addEventListener('click', function(){
    modal.classList.replace('inactive', 'active');
    modalSubmit.classList.replace('active', 'inactive');

    imageFormFile.classList.replace('hidden', 'active');
    labelFormFile.classList.replace('hidden', 'active');
    sizeFormFile.classList.replace('hidden', 'active');
    imageDiv.classList.replace('active', 'inactive');
})

modalCloseSubmit.addEventListener('click', function(){
    modalSubmit.classList.replace('active', 'inactive');
    overlay.classList.replace('active', 'inactive');
})

// Ajout de l'écouteur d'événement sur le formulaire de sélection d'image pour afficher une prévisualisation lors de la séléction

formPicture.addEventListener('change', function(event){
    const image = URL.createObjectURL(event.target.files[0]);

    imagePreview.src = image;
    imagePreview.setAttribute('class', 'preview');

    imageDiv.appendChild(imagePreview);

    imageFormFile.classList.add('hidden');
    labelFormFile.classList.add('hidden');
    sizeFormFile.classList.add('hidden');

    imageDiv.classList.replace('inactive', 'active');

    console.log(imagePreview)
})


const postButton = document.querySelector('#project-submit');
const postForm = document.querySelector('#add-project-form');
const formTitle = document.querySelector('#title');
const errorMessage = document.querySelector('.error-message');

// Ajout de l'écouteur d'événement sur le formulaire d'ajout de projet pour vérifier la complétion de tous les champs

postForm.addEventListener('change', function(){
    if((formPicture.value != '') && (formTitle.value != '') && (formCategories.value != '')){
        errorMessage.innerText = '';
        postButton.classList.replace('p-submit-unvalid', 'p-submit-valid')
    }
});

postButton.addEventListener('click', function(){
    if((formPicture.value == '') || (formTitle.value == '') || (formCategories.value == '')){
        errorMessage.innerText = "Merci de remplir tous les champs ci-dessus";
        postButton.classList.replace('p-submit-neutral', 'p-submit-unvalid');
        postButton.classList.replace('p-submit-valid', 'p-submit-unvalid');
    }
})

// Déclaration de la fonction pour envoyer les informations du nouveau projet à l'API et le stocker dans la base de données

async function submitForm(){
    if((formPicture.value != '') && (formTitle.value != '') && (formCategories.value != '')){
        const formData = new FormData(postForm);

        await fetch('http://localhost:5678/api/works', {
                method:'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formData
            });

        postForm.submit();
    }
}

// Modification du comportement du formulaire pour qu'il exécute notre fonction d'ajout de projet

postForm.addEventListener('submit', function(form){
    form.preventDefault();
    submitForm();
});





















