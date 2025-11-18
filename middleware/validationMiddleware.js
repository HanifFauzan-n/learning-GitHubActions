const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        console.log("ERROR TERTANGKAP:", err);
        console.log("JENIS ERROR:", err.constructor.name);
        console.log("ADA ISSUES?", err.issues); // Ini pasti akan muncul Array
        console.log("ADA ERRORS?", err.errors);
        const zodIssues = err.issues || err.errors;

        if (zodIssues) {
            // 2. Jika iya, ambil pesannya saja
            const errorMessages = zodIssues.map((issue) => issue.message);

            return res.status(400).json({
                error: "Invalid input",
                details: errorMessages
            });
        }
        else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
};

module.exports = validate;