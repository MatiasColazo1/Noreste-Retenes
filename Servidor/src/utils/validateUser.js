const validateUser = (userData) => {

    const errors = [];
 
    // Validar contraseña
    const password = userData.password;
    const passwordErrors = [];

    if (password.length < 8) {
        passwordErrors.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!/[A-Z]/.test(password)) {
        passwordErrors.push("La contraseña debe incluir al menos una letra mayúscula.");
    }
    if (!/[a-z]/.test(password)) {
        passwordErrors.push("La contraseña debe incluir al menos una letra minúscula.");
    }
    if (!/[0-9]/.test(password)) {
        passwordErrors.push("La contraseña debe incluir al menos un número.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
        passwordErrors.push("La contraseña debe incluir al menos un carácter especial (!@#$%^&*).");
    }

    if (passwordErrors.length > 0) {
        errors.push(...passwordErrors);
    }

    // Validar CUIT
    const cuit = userData.cuit;

    if (!/^\d{11}$/.test(cuit)) {
        errors.push("El CUIT debe tener exactamente 11 dígitos numéricos.");
    } else {
        const coef = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        const digitos = cuit.split('').map(Number);
        const verificador = digitos.pop();

        const suma = digitos.reduce((acc, val, i) => acc + val * coef[i], 0);
        const resto = suma % 11;
        const resultado = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;

        if (resultado !== verificador) {
            errors.push("El CUIT no es válido (dígito verificador incorrecto).");
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = validateUser;