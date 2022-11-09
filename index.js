const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());

// MongoDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ryrpoqq.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('alexPhotography').collection('services');
        const reviewCollection = client.db('alexPhotography').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/serviceshome', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const serviceshome = await cursor.limit(3).toArray();
            res.send(serviceshome);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // review

        app.get('/reviews', async (req, res) => {
            // console.log(req.query.email);

            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const update = req.body;
            // console.log(update);
            const option = { upsert: true };
            const updatedReview = {
                $set: {
                    client: update.client,
                    photo: update.photo,
                    message: update.message
                }

            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option);
            res.send(result);

        });


        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })



    }
    finally {

    }
}

run().catch(error => console.error(error));



app.get('/', (req, res) => {
    res.send('Alex Photography server is running')
});

app.listen(port, () => {
    console.log(`Alex Photography server running on ${port}`)
})