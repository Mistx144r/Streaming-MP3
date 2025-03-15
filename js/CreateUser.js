document.addEventListener("DOMContentLoaded", function () {
    let CreateNewMusicButton = document.getElementById("SubmitButton");
    let SeePassword = document.getElementById("checkboxpassword");
    let EmailInput = document.getElementById("EmailInputID");
    let UsernameInput = document.getElementById("UsernameInputID");
    let PasswordInput = document.getElementById("PasswordInputID");

    SeePassword.addEventListener('click', function () {
        if (PasswordInput.type == "password") {
            PasswordInput.type = "Text"
        } else {
            PasswordInput.type = "password"
        }
    });

    UsernameInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^0-9a-z-A-Z ]/g, "").replace(/ +/, "")
    });

    document.querySelector(".form").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = {
            username: document.getElementById("UsernameInputID").value,
            email: document.getElementById("EmailInputID").value,
            password: document.getElementById("PasswordInputID").value
        };

        fetch("/register/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.status == 200) {
                    alert("Conta Criada Com Sucesso!")
                    window.location.href = "/login";
                } else {
                    alert("Conta Já Existe!")
                }
            })
            .catch(error => console.error("Erro:", error));
    });
});