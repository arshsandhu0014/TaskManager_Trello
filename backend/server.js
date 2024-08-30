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

// Set up CORS to allow only your frontend's origin
const allowedOrigins = ['https://task-manager-trello-2yri.vercel.app']; // Replace with your actual frontend URL
app.use(cors({
    origin: function(origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TaskManager';
const secretKey = process.env.JWT_SECRET || 'your_secret_key_here';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '493906680508-07evjgesmlano1r3rsnb4sac6bgfgk6g.apps.googleusercontent.com';
const client = new OAuth2Client(googleClientId);

mongoose.connect(MONGODB_URI).then(() => {
    console.log('MongoDB database connection established successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Google authentication route
app.post('/auth/google', async (req, res) => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: googleClientId // Use environment variable
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
        console.error('Error verifying Google token:', error);
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
