document.addEventListener("DOMContentLoaded", function () {
    let SeePassword = document.getElementById("checkboxpassword");
    let EmailInput = document.getElementById("EmailInputID");
    let PasswordInput = document.getElementById("PasswordInputID");

    SeePassword.addEventListener('click', function () {
        if (PasswordInput.type == "password") {
            PasswordInput.type = "Text"
        } else {
            PasswordInput.type = "password"
        }
    });

    document.querySelector(".form").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = {
            email: document.getElementById("EmailInputID").value,
            password: document.getElementById("PasswordInputID").value
        };

        fetch("/login/trylogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Server response:", data);

                if (data.token) {
                    localStorage.setItem("token", data.token);
                    alert("Login realizado com sucesso!");
                    window.location.href = "/dashboard";
                } else {
                    alert(data.error);
                }
            })
            .catch(error => console.error("Erro:", error));
    });
});