const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
});

async function loadProfile() {
    const token = localStorage.getItem("token");

    const nameUser = document.getElementById("name-user");
    const profileEmail = document.getElementById("profile-email");
    const profileRole = document.getElementById("profile-role");
    const profileBirthDate = document.getElementById("profile-birth-date");
    const profileLoadMessage = document.getElementById("profileLoadMessage");

    const profileNameInput = document.getElementById("profile-name");
    const profileEmailInput = document.getElementById("profile-email-input");
    const profileRoleInput = document.getElementById("profile-role-input");
    const profileBirthDateInput = document.getElementById("profile-birth-date-input");

    if (!token) {
        if (profileLoadMessage) {
            profileLoadMessage.textContent = "No hay sesión activa. Inicia sesión nuevamente.";
        }
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            if (profileLoadMessage) {
                profileLoadMessage.textContent = result.message || "No se pudo cargar el perfil.";
            }

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            }
            return;
        }

        const user = result.data;

        const fullName = user.full_name || "Sin nombre";
        const email = (user.email || "").toLowerCase();
        const role = user.role || "Sin rol";
        const birthDate = user.fecha_nacimiento || "";

        if (nameUser) nameUser.textContent = capitalizeWords(fullName);
        if (profileEmail) profileEmail.textContent = email;
        if (profileRole) {
            profileRole.textContent = role;
            profileRole.className = `badge badge-${role}`;
        }
        if (profileBirthDate) {
            profileBirthDate.textContent = birthDate
                ? formatDate(birthDate)
                : "No registrada";
        }

        if (profileNameInput) profileNameInput.value = fullName;
        if (profileEmailInput) profileEmailInput.value = email;
        if (profileRoleInput) profileRoleInput.value = role;
        if (profileBirthDateInput) profileBirthDateInput.value = birthDate;

    } catch (error) {
        if (profileLoadMessage) {
            profileLoadMessage.textContent = "Error de conexión con el servidor.";
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);

    if (isNaN(date)) return "Fecha inválida";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function capitalizeWords(text) {
    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}