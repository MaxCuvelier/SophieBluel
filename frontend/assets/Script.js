console.log("bonjour !")
let works
async function GetWorks() {
    const reponse = await fetch(`http://localhost:5678/api/works`)
    works = await reponse.json()
}

main() 
console.log(works)
async function main() {
    await GetWorks()
    if(localStorage.getItem("Token")) {
        CreationModal()
    } else {
        creationFilters()
    }
    creerProjet()
}
/*
*fonction pour récupérer l'ID maximal des travaux
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
*fonction pour passer la page en mode admin
*/
async function admin() {
    const adminbar = document.createElement("div")
    adminbar.classList.add("adminbar")
    adminbar.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Mode édition`
    document.body.insertBefore(adminbar, document.body.firstChild)
    const MesProjets = document.querySelector(".projetsTitre")
    MesProjets.innerHTML += `<a href=""><i class="fa-solid fa-pen-to-square"></i> modifier</a>`
    MesProjets.classList.add("btn-modal")
}

/*
*fonction pour créer les boutons qui servent au filtrage des catégories
*travaux
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
                //si pas de filtres (0=tous) alors on relance la fonction pour creer la page
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
//CreationModal()
async function CreationModal() {
    await GetWorks()
    await admin()
    const modal = document.querySelector(".gallery-modal")
    for (let i = 0; i < works.length; i++) {
        const work = works[i]
        const worksModal = document.createElement("figure")
        worksModal.classList.add('figure-modal')
        const imgModal = document.createElement("img")
        const poubelle = document.createElement("span")
        poubelle.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
        poubelle.classList.add('poubelle')
        imgModal.classList.add("img-modal")
        imgModal.src = work.imageUrl
        worksModal.appendChild(imgModal)
        worksModal.appendChild(poubelle)
        modal.appendChild(worksModal)
    }
    
    const afficherModal = document.querySelector(".btn-modal")
    afficherModal.addEventListener('click', (e) => {
       openModal(e)
    })
}
let modal = null

async function openModal(e) {
    e.preventDefault()
    const modalDisplay = document.getElementById("modal1")
    modalDisplay.classList.remove('display-none')
    modalDisplay.removeAttribute('aria-hidden')
    modalDisplay.setAttribute('aria-modal', 'true')
    modalDisplay.classList.add('modal')
    modal = modalDisplay
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

async function closeModal(e) {
    if(modal === null) return
    e.preventDefault()
    modal.classList.remove('modal')
    modal.classList.add('display-none')
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}
async function stopPropagation(e) {
    e.stopPropagation()
}

/*
*fonction pour filtrer les travaux, 
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
