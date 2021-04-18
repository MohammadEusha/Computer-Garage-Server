
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID
const app = express()
app.use(cors())
app.use(bodyParser.json())


const port = 5000


require('dotenv').config()

console.log(process.env.DB_USER)

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eax0o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("computerRepair").collection("services");
    const reviewCollection = client.db("computerRepair").collection("reviews");
    const customerServiceCollection = client.db("computerRepair").collection("customerService");
    const adminsCollection = client.db("computerRepair").collection("admins");

    console.log('database Connected');


    app.post('/addService', (req, res) => {
        const newService = req.body
        console.log('adding services', newService)
        servicesCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })



    app.post('/addToCart', (req, res) => {
        const newAddToCart = req.body
        customerServiceCollection.insertOne(newAddToCart)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })

    app.get('/cart', (req, res) => {
        customerServiceCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.get('/allOrder', (req, res) => {
        customerServiceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })


    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body
        console.log('adding admin', newAdmin)
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/admins', (req, res) => {
        adminsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })


    app.post('/addReview', (req, res) => {
        const newReview = req.body
        console.log('adding services', newReview)
        reviewCollection.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.patch('/update/:id', (req, res) => {
        customerServiceCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { status: req.body.status }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })


    app.delete('/delete/:id', (req, res) => {
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)

            })
    })


});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)