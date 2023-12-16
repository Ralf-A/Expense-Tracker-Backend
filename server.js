const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Require controllers
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/api', expenseRoutes);
app.use('/api', categoryRoutes);
app.use('/auth', forgotPasswordRoutes);

app.listen(port, () => {
    console.log("Server is listening to port " + port);
});
