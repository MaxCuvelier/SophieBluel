console.log("bonjour !")
let works
async function GetWorks() {
    const reponse = await fetch(`http://localhost:5678/api/works`)
    works = await reponse.json()
}

const token = localStorage.getItem("Token")

main()
console.log(works)
async function main() {
    await GetWorks()
    if (localStorage.getItem("Token")) {
        admin()
        CreationModal()
        ajoutProjet()
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
    const btnLogout = document.querySelector(".btn-login")
    btnLogout.innerHTML = "logout"
    btnLogout.href = "index.html"
    btnLogout.addEventListener("click", () => {
        Logout()
    })
}

function Logout() {
    localStorage.removeItem("Token")
    main()
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

//fonction pour creer la liste des travaux sur la modal en cas de connexion en mode admin
async function CreationModal() {
    const modal = document.querySelector(".gallery-modal")
    modal.innerHTML = ""
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
        poubelle.addEventListener('click', function (event) {
            event.stopPropagation()
            supprimerProjet(work.id)
            console.log(`je vais supprrimer ${work.id}`)
        })
        modal.appendChild(worksModal)
    }

    const afficherModal = document.querySelector(".btn-modal")
    afficherModal.addEventListener('click', (e) => {
        openModal(e)
    })
}

let modal = null

//fonction pour ouvrir la première modal et activer la possibiliter de changer de modal
async function openModal(e) {
    e.preventDefault()
    CreationModal()
    const modalDisplay = document.getElementById("modal1")
    modalDisplay.classList.remove('display-none')
    modalDisplay.removeAttribute('aria-hidden')
    modalDisplay.setAttribute('aria-modal', 'true')
    modalDisplay.classList.add('modal')
    modal = modalDisplay
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    const btnAjouterPhoto = document.querySelector(".btn-ajouter-photo")
    btnAjouterPhoto.addEventListener('click', () => {
        changerModal(e)
    })
}

//fonciton pour changer de modal
async function changerModal(e) {
    e.preventDefault()
    const modalDisplay = document.getElementById("modal1")
    const modal2 = document.getElementById("modal2")
    const modalRetour = document.querySelector(".js-modal-retour")
    modalDisplay.classList.remove('modal')
    modalDisplay.setAttribute('aria-hidden', 'true')
    modalDisplay.removeAttribute('aria-modal', 'true')
    modalDisplay.classList.add('display-none')
    modal2.classList.remove('display-none')
    modal2.removeAttribute('aria-hidden')
    modal2.setAttribute('aria-modal', 'true')
    modal2.classList.add('modal')
    modal = modal2
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    modalRetour.addEventListener('click', () => {
        retourModal(e)
    })
}

//fonction pour retourner à la première modal
async function retourModal(e) {
    e.preventDefault()
    const modalDisplay = document.getElementById("modal1")
    const modal2 = document.getElementById("modal2")
    modal2.classList.add('display-none')
    modal2.setAttribute('aria-hidden', 'true')
    modal2.removeAttribute('aria-modal', 'true')
    modal2.classList.remove('modal')
    modalDisplay.classList.remove('display-none')
    modalDisplay.removeAttribute('aria-hidden')
    modalDisplay.setAttribute('aria-modal', 'true')
    modalDisplay.classList.add('modal')
    modal = modalDisplay
}


//fonciton pour fermer la modal en cours
async function closeModal(e) {
    if (modal === null) return
    modal.classList.remove('modal')
    modal.classList.add('display-none')
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
    clear()
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

function onFileSelected(event) {
    let selectedFile = event.target.files[0];
    let reader = new FileReader();

    let imgtag = document.getElementById("myimage");
    imgtag.title = selectedFile.name;
    let contenueBouton = document.querySelector(".input-photo")

    reader.onload = function (event) {
        imgtag.src = event.target.result;
        contenueBouton.querySelector("i").classList.add("display-none")
        contenueBouton.querySelector("label").classList.add("display-none")
        contenueBouton.querySelector("input").classList.add("display-none")
        contenueBouton.querySelector("p").classList.add("display-none")
        imgtag.classList.remove("display-none")
    };

    reader.readAsDataURL(selectedFile);
}

function clear() {
    let imgtag = document.getElementById("myimage");
    let contenueBouton = document.querySelector(".input-photo")
    contenueBouton.querySelector("i").classList.remove("display-none")
    contenueBouton.querySelector("label").classList.remove("display-none")
    contenueBouton.querySelector("input").classList.remove("display-none")
    contenueBouton.querySelector("p").classList.remove("display-none")
    imgtag.classList.add("display-none")
    document.getElementById('titre').value = ""
    document.getElementById('upload').value = ""
    document.getElementById('categorie').value = ""
}


//fonction pour créer la liste des projets depuis l'API
function creerProjet() {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
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

//fonction pour ajouter un projet sur l'API
async function ajoutProjet() {
    const envoyerProjet = document.getElementById('envoyer-projet')
    envoyerProjet.addEventListener('submit', async function (event) {
        event.preventDefault()
        const titreProjet = document.getElementById('titre').value
        const imgProjet = document.getElementById('upload')
        const categorieProjet = document.getElementById('categorie').value
        const contenueProjet = new FormData()
        contenueProjet.append('title', titreProjet)
        contenueProjet.append('category', categorieProjet)
        contenueProjet.append('image', imgProjet.files[0])
        console.log(contenueProjet)
        const response = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            body: contenueProjet,
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.status === 201) {
            await GetWorks()
            creerProjet()
            closeModal()
            clear()
        }
        else {
            alert("Une erreur est survenue")
        }
    })
}

async function supprimerProjet(workid) {
    const response = await fetch(`http://localhost:5678/api/works/${workid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.status === 204) {
        await GetWorks()
        creerProjet()
        CreationModal()
    }
    else {
        alert("Le projet n'a été supprimé")
    }
}