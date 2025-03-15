document.addEventListener("DOMContentLoaded", function () {
    let logoutbutton = document.getElementById("logout-button");

    logoutbutton.addEventListener('click', function () {
        localStorage.removeItem("token");
        alert("Você deslogou da conta!");
        window.location.href = "/login";
    })
});