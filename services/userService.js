const userRepository = require('../repositories/userRepository');

const getAllUsers = async () => {
    return await userRepository.findAll();
};

const createNewUser = async (name) => {
    if(!name){
        throw new Error("Name is Required");
    }
    return await userRepository.create(name);
};

module.exports = {
    getAllUsers,
    createNewUser
};