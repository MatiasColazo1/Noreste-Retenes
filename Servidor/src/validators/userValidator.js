const UserDAO = require('../daos/user.daos');

const checkDuplicateFields = async (userData) => {
    const errors = [];

    const existingCuit = await UserDAO.findByCuit(userData.cuit);
    if (existingCuit) {
        errors.push("El CUIT ya está registrado.");
    }

    const existingEmail = await UserDAO.findByEmail(userData.email);
    if (existingEmail) {
        errors.push("El email ya está registrado.");
    }

    return errors;
};

module.exports = {
    checkDuplicateFields
};
