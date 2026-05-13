document.querySelector(".signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("input-name").value.trim();
    const lastName = document.getElementById("input-last-name").value.trim();
    const birthday = document.getElementById("input-birthday").value;
    const email = document.getElementById("input-email").value.trim().toLowerCase();
    const password = document.getElementById("input-password").value.trim();
    const rePassword = document.getElementById("input-re-password").value.trim();
    const message = document.getElementById("signupMessage");
    const submitButton = document.getElementById("signup-button");

    message.textContent = "";
    message.classList.remove("show", "success", "error");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !lastName || !birthday || !email || !password || !rePassword) {
        message.textContent = "Todos los campos son obligatorios.";
        message.classList.add("show", "error");
        return;
    }

    if (!emailRegex.test(email)) {
        message.textContent = "Ingresa un correo electrónico válido.";
        message.classList.add("show", "error");
        return;
    }

    if (password.length < 8) {
        message.textContent = "La contraseña debe tener al menos 8 caracteres.";
        message.classList.add("show", "error");
        return;
    }

    if (password !== rePassword) {
        message.textContent = "Las contraseñas no coinciden.";
        message.classList.add("show", "error");
        return;
    }

    const full_name = `${name} ${lastName}`;

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Registrando...";

        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name,
                email,
                password,
                birth_date: birthday
            })
        });

        const result = await response.json();

        console.log("STATUS REGISTER:", response.status);
        console.log("RESULT REGISTER:", result);

        if (!response.ok || !result.ok) {
            message.textContent = result.message || "No se pudo completar el registro.";
            message.classList.add("show", "error");
            return;
        }

        message.textContent = "Usuario registrado correctamente. Ahora puedes iniciar sesión.";
        message.classList.add("show", "success");

        this.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error("ERROR REGISTER:", error);
        message.textContent = "No se pudo conectar con el servidor.";
        message.classList.add("show", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
    }
});