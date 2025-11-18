const userService = require('../services/userService')

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);

    } catch (error) {
        console.log("Error",error);
        res.status(500).json({error: error.message});
    }
    
};


const register = async (req,res) => {
    try{
        const {name, email, password} = req.body;
        const user = await userService.registerUser(name, email, password);
        res.status(201).json(user);

    }
    catch (err) {
        if(err.message === "Email is already in use"){
            res.status(400).json({error: err.message});
        } else {
            res.status(500).json({error: err.message});
        }
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json(result);
    }
    catch (err) {
        console.log("Err",err);
        if(err.message === "Invalid credential") {
            res.status(401).json({error: err.message});
        }
        else {
            res.status(500).json({error:err.message});
        }
    }
}

module.exports = {
    getUsers,
    register,
    login
};