const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Connect to the database
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/channel', require('./routes/channelRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
