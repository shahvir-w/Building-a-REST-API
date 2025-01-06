const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/product.model.js')
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://shahvir:uHkRqXOM9QiDcOv6@cluster0.7uz6z.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("connected to database");
    app.listen(3000, () => console.log('server is running'))
})
.catch(() => {
    console.log("connection failed")
})

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
app.get('/api/products/:id', getProduct, (req, res) => {
    res.json(res.product)
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

// update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body)
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete a product
app.delete('/api/products/:id', getProduct, async (req,res) => {
    try {
        await res.product.deleteOne();
        res.status(200).json({message: "deleted product"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// middleware to get product by ID
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(404).json({message: 'Cannot find product'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.product = product;
    next();
}