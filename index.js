const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// user  - job-task
// pass -- Ibyn1tLovTiOKoM1



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6irp4bx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)

        const usersCollection = client.db('Normative').collection('user')
        const bannerCollection = client.db('Normative').collection('banners')

        // user api
        app.post('/users', async (req, res) => {
            const userData = req.body
            console.log(userData)
            const result = await usersCollection.insertOne(userData)
            res.send(result)
        })


        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })


        app.get('/user/:email', async (req, res) => {
            const email = req.params.email
            const result = await usersCollection.findOne({ email })
            res.send(result)
          })
      


        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;

            // if (email !== req.decoded.email) {
            //   return res.status(403).send({ message: 'forbidden access' })
            // }

            const query = { email: email };
            const user = await usersCollection.findOne(query);
            // console.log(user)
            let admin = false;
            if (user) {
                // console.log('called')
                admin = user?.role == 'admin';
            }
            // console.log(admin)
            res.send({ admin })

        })


        //   make admin
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)

        })


        //   add banner 
        app.post('/addBanner', async (req, res) => {
            const bannerData = req.body
            const result = await bannerCollection.insertOne(bannerData)
            res.send(result)
        })


        app.get('/banner', async (req, res) => {
            const result = await bannerCollection.find().toArray()
            res.send(result)
        })



        app.patch('/banners/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    isActive: req.body.isActive
                }
            }
            // console.log(updateDoc)
            const result = await bannerCollection.updateOne(filter, updateDoc)
            res.send(result)

        })

        app.get('/bannerDisplay', async (req, res) => {
            const result = await bannerCollection.find().toArray()
            res.send(result)
          })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('This program is running!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})