const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');

const secret = "yourStrongSecret"; // Use a stronger secret
const maxAge = 60 * 60;

const generateJWT = (id) => {
    return jwt.sign({ id }, secret, { expiresIn: maxAge });
};

const authenticateUser = async (req, res) => {
    console.log('Authentication request has been arrived');
    const token = req.cookies.jwt; // assign the token named jwt to the token const
    //console.log("token " + token);
    let authenticated = false; // a user is not authenticated until proven the opposite
    try {
        if (token) { //checks if the token exists
            //jwt.verify(token, secretOrPublicKey, [options, callback]) verify a token
            await jwt.verify(token, secret, (err) => { //token exists, now we try to verify it
                if (err) { // not verified, redirect to login page
                    console.log(err.message);
                    console.log('Token is not verified');
                    res.send({ "Authenticated": authenticated }); // authenticated = false
                } else { // token exists and it is verified 
                    console.log('Author is authenticated');
                    authenticated = true;
                    res.send({ "Authenticated": authenticated }); // authenticated = true
                }
            })
        } else { //applies when the token does not exist
            console.log('author is not authinticated');
            res.send({ "authenticated": authenticated }); // authenticated = false
        }
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    }
};

const signupUser = async (req, res) => {
    try {
        console.log("A signup request has arrived");
        const { username, email, password } = req.body;

        // Check if the password meets strength requirements
        if (!isPasswordStrong(password)) {
            return res.status(400).json({ error: "Password does not meet strength requirements" });
        }

        // Check if the username or email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            // If a user with the same username or email exists, handle the error
            throw new Error("Username or email already exists");
        }

        // If no existing user found, proceed with user creation
        const salt = await bcrypt.genSalt();
        const bcryptPassword = await bcrypt.hash(password, salt);

        const authUser = await pool.query(
            "INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, bcryptPassword]
        );

        if (authUser.rows.length === 0) {
            // If the INSERT didn't return any rows, handle the error
            throw new Error("User not created");
        }

        const token = generateJWT(authUser.rows[0].id);
        res.cookie('jwt', token, { maxAge: 6000000, httpOnly: true });
        res.status(201).json({ user_id: authUser.rows[0].id });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        console.log("A login request has arrived");
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "User is not registered" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = generateJWT(user.rows[0].id);
        res.cookie('jwt', token, { maxAge: 6000000, httpOnly: true });
        res.status(201).json({ user_id: user.rows[0].id });
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ error: "Error during login" });
    }
};

const logoutUser = (req, res) => {
    console.log('Logout request arrived');
    res.status(202).clearCookie('jwt').json({ "Msg": "cookie cleared" }).send();
};

const isPasswordStrong = (password) => {
    if (password.length < 8) {
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    if (!/\d/.test(password)) {
        return false;
    }
    return true;
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Delete user and associated posts and categories
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error deleting user and associated data' });
    }
};

module.exports = {
    authenticateUser,
    signupUser,
    loginUser,
    logoutUser,
    deleteUser, 
};


