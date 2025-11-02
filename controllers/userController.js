const userService = require('../services/userService')

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
};

const createUser = async (req, res) => {
    try {
        const { name } = req.body;
        const newUser = await userService.createNewUser(name);
        res.status(201).json(newUser);
    }
    catch (err) {
        if(err.message == 'Name is Required'){
            res.status(400).json({ error: err.message});
        } else {
            res.status(500).json({ error: err.message});
        }
    }
};

module.exports = {
    getUsers,
    createUser
};