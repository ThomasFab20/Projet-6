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

        imagesProjets.classList.add('active');

        imagesProjets.setAttribute('id', projets[image].category.name);

        galerie.appendChild(imagesProjets);

        imagesProjets.src = projets[image].imageUrl;
    }
}
    else{
        throw new Error('Impossible de récupérer la liste des projets');
}}

fetchProject();

window.onload = () => {
    let filters = document.querySelectorAll('.filter');

    for(let filter of filters){
        filter.addEventListener('click', function(){
            let tag = this.id;

            document.querySelector('.selected').classList.remove('selected');
            this.classList.add('selected');

            let images = document.querySelectorAll('.img-projet');

            for(let image of images){
                image.classList.replace('active', 'inactive')

                if(tag === image.id){
                    image.classList.replace('inactive', 'active');
                }
                if(tag === 'tous'){
                    image.classList.replace('inactive', 'active');
                }
            }

        });
    }
}




