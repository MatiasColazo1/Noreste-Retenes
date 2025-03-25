// utils/validatePassword.js

const validatePassword = (password) => {
    const errors = [];

    // Validaciones para la contraseña
    if (password.length < 8) {
        errors.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("La contraseña debe incluir al menos una letra mayúscula.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("La contraseña debe incluir al menos una letra minúscula.");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("La contraseña debe incluir al menos un número.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push("La contraseña debe incluir al menos un carácter especial (!@#$%^&*).");
    }

    return {
        isValid: errors.length === 0,
        message: errors.join(" ")
    };
};

module.exports = validatePassword;
