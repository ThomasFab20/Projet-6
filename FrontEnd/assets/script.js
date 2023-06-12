let galerie = document.querySelector('.gallery');

let image = -1;


async function fetchProject(){
    let projet = await fetch('http://localhost:5678/api/works', {
    method: 'GET',
    headers:{
        "Accept": "application/json",
    }
})
    if (projet.ok === true){
    let projets = await projet.json()
    console.log(projets);

    for (let i = 0; i < projets.length; i++){
        image++;

        let imagesProjets = document.createElement('img');

        imagesProjets.setAttribute('class', 'img-projet');

        galerie.appendChild(imagesProjets);

        imagesProjets.src = projets[image].imageUrl;
        
    }

}
    else{
        throw new Error('Impossible de récupérer la liste des projets');
}}

fetchProject();

