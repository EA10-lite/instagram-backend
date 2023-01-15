
const bcrypt = require("bcrypt");

module.exports.hash_password =  async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

module.exports.compare_password = async (password, encrypted_password) => {
    return bcrypt.compare(password, encrypted_password);
}