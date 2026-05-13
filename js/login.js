document.getElementById("login-card").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("input-email").value.trim();
    const password = document.getElementById("input-password").value.trim();
    const errorMessage = document.getElementById("errorLoginMessage");
    const submitButton = document.querySelector("#login-card button[type='submit']");

    errorMessage.textContent = "";
    errorMessage.classList.remove("show");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "" || password === "") {
        errorMessage.textContent = "Los campos son obligatorios.";
        errorMessage.classList.add("show");
        return;
    }

    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Ingresa un correo electrónico válido.";
        errorMessage.classList.add("show");
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Ingresando...";

        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok || !result.ok || !result.data) {
            errorMessage.textContent = result.message || "Correo o contraseña incorrectos.";
            errorMessage.classList.add("show");
            return;
        }

        const user = result.data.user;
        const token = result.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "user") {
            window.location.href = "dashboard-cliente.html";
        } else if (user.role === "coach") {
            window.location.href = "dashboard-coach.html";
        } else if (user.role === "admin") {
            window.location.href = "dashboard-admin.html";
        } else {
            errorMessage.textContent = "Rol de usuario no reconocido.";
            errorMessage.classList.add("show");
        }
    } catch (error) {
        console.error("ERROR FETCH:", error);
        errorMessage.textContent = "No se pudo conectar con el servidor.";
        errorMessage.classList.add("show");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Iniciar sesión";
    }
});