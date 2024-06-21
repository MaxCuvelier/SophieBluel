console.log("bonjour !")
let works
async function GetWorks () {
const reponse = await fetch(`http://localhost:5678/api/works`)
works = await reponse.json()
}


async function creerProjet () {
    await GetWorks()
    const gallery = document.querySelector(".gallery")
    for (let i = 0; i < works.length; i++) {
        const work = works[i]
        const worksElement = document.createElement("figure")
        const imgElement = document.createElement("img")
        imgElement.src = work.imageUrl
        const titreElement = document.createElement("figcaption")
        titreElement.innerText = work.title
        worksElement.appendChild(imgElement)
        worksElement.appendChild(titreElement)
        gallery.appendChild(worksElement)
    }
}

creerProjet()