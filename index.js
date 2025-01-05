const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/product.model.js')
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello from Node API')
});

// get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// get a specific product
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// add a product
app.post('/api/products', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
    })
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

mongoose.connect("mongodb+srv://shahvir:uHkRqXOM9QiDcOv6@cluster0.7uz6z.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("connected to database");
    app.listen(3000, () => console.log('server is running'))
})
.catch(() => {
    console.log("connection failed")
})