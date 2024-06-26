const submit = document.getElementById("submit")
submit.addEventListener("click", async function (event) {
    event.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const response = await fetch(`http://localhost:5678/api/users/login`, {
        method: "POST", 
        body: JSON.stringify({
            email, password
        }),
        headers: {"Content-Type": "application/json"}
    })
    if (response.status === 200)
        {
            const token = (await response.json()).token
            localStorage.setItem("Token", token);
            window.location.replace("index.html");
        }
        else {
            localStorage.clear()
            alert("Erreur dans l’identifiant ou le mot de passe")
        }
})
