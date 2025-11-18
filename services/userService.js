const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async () => {
    return await userRepository.findAll();
};


const registerUser = async (name,email,password) => {
    const existingUser = await userRepository.findByEmail(email);
    if(existingUser) {
        throw new Error("Email is already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await userRepository.create(name, email, passwordHash);
    console.log(newUser);
    return newUser;
};

const loginUser = async (email,password) => {
    const user = await userRepository.findByEmail(email);
    if(!user){
        throw new Error("Invalid credential");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error("Invalid credential");
    }

    const payload = {
        id: user.id,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return {token};
}

module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
};