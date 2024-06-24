console.log("bonjour !")
let works
async function GetWorks() {
    const reponse = await fetch(`http://localhost:5678/api/works`)
    works = await reponse.json()
}

main()

async function main() {
    await GetWorks()
    creationFilters()
    creerProjet()
}
/*
*fonction pour récupérer l'ID maximal des traveaux
*/
function maxCategoryID() {
    let maxID = 0
    for (let i = 0; i < works.length; i++) {
        if (works[i].category.id > maxID)
            maxID = works[i].category.id
    }
    return maxID
}

/*
 *fonction pour récupérer les noms des catégories
 */
function categoryName(id) {
    for (let i = 0; i < works.length; i++) {
        if (works[i].category.id === id)
            return works[i].category.name
    }
}

/*
*fonction pour créer les boutons qui servent au filtrage des catégories
*traveaux
*/
function creationFilters() {
    let btnFilters = document.querySelector(".btncontainer")
    for (let i = 0; i <= maxCategoryID(); i++) {
        let btn = document.createElement("button")
        btn.type = "button"
        btn.setAttribute("categoryid", i)
        btn.classList.add("btn")
        btn.innerText = categoryName(i)
        btn.addEventListener("click", function () {
            document.querySelector(".gallery").innerHTML = ""
            //gallery a été clear
            if (i === 0) {
                //si pas de filtrer (0=tous) alors on relance la fonction pour creer la page
                creerProjet()
            } else {
                //sinon on filtre en fonction de l'id
                filtre(i)
            }
            
            //on met à jour l'état des boutons en changeant la class en "selected"
            document.querySelector(".btnselected").classList.remove("btnselected")
            this.classList.add("btnselected")
        })
        if (i === 0) {
            btn.innerText = "Tous"
            btn.classList.add("btnselected")
        }
        btnFilters.appendChild(btn)
    }
}

/*
*fonction pour filtrer les traveaux, 
*/
function filtre(categoryid) {
    const gallery = document.querySelector(".gallery")
    for (let i = 0; i < works.length; i++) {
        const work = works[i]
        //le if fait le filtre pck il va ignorer les elements qui n'ont pas l'id voulu
        if (work.category.id !== categoryid) continue
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


//fonction pour créer la liste des projets depuis l'API
function creerProjet() {
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
