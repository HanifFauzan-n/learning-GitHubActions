const { z } = require('zod');

const registerShema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long "),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});

const loginShema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

module.exports = {
    registerShema,
    loginShema
};
