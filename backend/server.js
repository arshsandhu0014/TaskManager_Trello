const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { register, login } = require('./controllers/authController'); 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/TaskManager';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});



// Mount authentication routes
app.post('/register', register);
app.post('/login', login);


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
