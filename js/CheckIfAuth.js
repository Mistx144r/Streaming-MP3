document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    const publicPages = ["/login", "/register"]; // Páginas públicas
    const protectedPages = ["/dashboard"]; // Páginas protegidas

    if (token && publicPages.includes(currentPath)) {
        // Usuário logado tentando acessar login -> manda pro dashboard
        window.location.href = "/dashboard";
    } else if (!token && protectedPages.includes(currentPath)) {
        // Usuário não logado tentando acessar página protegida -> manda pro login
        window.location.href = "/login";
    }
});
