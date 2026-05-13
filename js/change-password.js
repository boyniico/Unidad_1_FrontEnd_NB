const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("changePasswordForm");

    if (form) {
        form.addEventListener("submit", handleChangePassword);
    }
});

async function handleChangePassword(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    const currentPasswordInput = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const message = document.getElementById("changePasswordMessage");

    clearPasswordState(currentPasswordInput, newPasswordInput, confirmPasswordInput, message);

    const currentPassword = currentPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    let hasError = false;

    if (!currentPassword) {
        setInputError(currentPasswordInput);
        showMessage(message, "La contraseña actual es obligatoria.", "error");
        hasError = true;
    }

    if (!newPassword) {
        setInputError(newPasswordInput);
        showMessage(message, "La nueva contraseña es obligatoria.", "error");
        hasError = true;
    } else if (newPassword.length < 8) {
        setInputError(newPasswordInput);
        showMessage(message, "La nueva contraseña debe tener mínimo 8 caracteres.", "error");
        hasError = true;
    }

    if (!confirmPassword) {
        setInputError(confirmPasswordInput);
        showMessage(message, "Debes confirmar la nueva contraseña.", "error");
        hasError = true;
    } else if (newPassword !== confirmPassword) {
        setInputError(confirmPasswordInput);
        showMessage(message, "Las contraseñas no coinciden.", "error");
        hasError = true;
    }

    if (hasError) return;

    if (!token) {
        showMessage(message, "No hay sesión activa. Inicia sesión nuevamente.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        });

        const result = await response.json();

        if (!response.ok) {
            showMessage(
                message,
                result.message || "No se pudo cambiar la contraseña.",
                "error"
            );
            return;
        }

        showMessage(message, "Contraseña actualizada correctamente.", "success");
        event.target.reset();
    } catch (error) {
        showMessage(message, "Error de conexión con el servidor.", "error");
    }
}

function setInputError(input) {
    input.classList.add("input-error");
}

function showMessage(element, text, type) {
    element.textContent = text;
    element.classList.remove("error", "success");
    element.classList.add("show", type);
}

function clearPasswordState(...elements) {
    elements.forEach((element) => {
        if (!element) return;

        if (element.tagName === "INPUT") {
            element.classList.remove("input-error");
        } else {
            element.textContent = "";
            element.classList.remove("show", "error", "success");
        }
    });
}