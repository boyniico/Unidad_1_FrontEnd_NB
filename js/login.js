const usuarios = [
    { email: "sebastian@sportclub.com", password: "1234", nombre: "Sebastián", apellido: "Rojas", rol: "cliente" },
    { email: "valentina@sportclub.com", password: "5678", nombre: "Valentina", apellido: "Muñoz", rol: "cliente" },

    { email: "coach1@sportclub.com", password: "coach123", nombre: "Martín", apellido: "González", rol: "coach" },
    { email: "coach2@sportclub.com", password: "coach456", nombre: "Camila", apellido: "Herrera", rol: "coach" },

    { email: "admin1@sportclub.com", password: "admin123", nombre: "Nicolás", apellido: "Bustamante", rol: "admin" },
    { email: "admin2@sportclub.com", password: "admin456", nombre: "Fernanda", apellido: "Soto", rol: "admin" }
];

document.getElementById("login-card").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("input-email").value.trim();
    const password = document.getElementById("input-password").value.trim();
    const errorMessage = document.getElementById("errorLoginMessage");

    if (email === "" || password === "") {
        errorMessage.textContent = "Los campos son obligatorios.";
        errorMessage.classList.add("show");
        return;
    }

    const usuarioEncontrado = usuarios.find(usuario =>
        usuario.email === email && usuario.password === password
    );

    if (!usuarioEncontrado) {
        errorMessage.textContent = "Correo o contraseña incorrectos.";
        errorMessage.classList.add("show");
        return;
    }

    errorMessage.textContent = "";
    errorMessage.classList.remove("show");

    localStorage.setItem("user", JSON.stringify(usuarioEncontrado));

    if (usuarioEncontrado.rol === "cliente") {
        window.location.href = "dashboard-cliente.html";
    } else if (usuarioEncontrado.rol === "coach") {
        window.location.href = "dashboard-coach.html";
    } else if (usuarioEncontrado.rol === "admin") {
        window.location.href = "dashboard-admin.html";
    }
});