const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User'); // Update path if needed
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/TaskManager';
const secretKey = 'your_secret_key_here'; // Hardcoded secret key
const client = new OAuth2Client('493906680508-07evjgesmlano1r3rsnb4sac6bgfgk6g.apps.googleusercontent.com'); // Replace with your actual client ID

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Google authentication route
app.post('/auth/google', async (req, res) => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: '493906680508-07evjgesmlano1r3rsnb4sac6bgfgk6g.apps.googleusercontent.com' // Replace with your actual client ID
        });

        const payload = ticket.getPayload();
        const userId = payload.sub; // User ID from Google

        // Check if user already exists
        let user = await User.findOne({ username: payload.email });

        if (!user) {
            // Create a new user if not found
            user = new User({
                firstName: payload.given_name,
                lastName: payload.family_name,
                username: payload.email,
                password: 'N/A' // Password not required for Google sign-in
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.use('/auth', authRoutes);
app.use('/tasks', protect, taskRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
