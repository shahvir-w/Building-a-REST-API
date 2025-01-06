require('dotenv').config();

const express = require('express')
const app = express();
const productRoute = require('./routes/product.route.js');

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log("connected to database");
    app.listen(3000, () => console.log('server is running'))
})
.catch(() => {
    console.log("connection failed")
})

//middleware
app.use(express.json());

//routes
app.use('/api/products', productRoute);

app.get('/', (req, res) => {
    res.send('Hello from Node API')
});