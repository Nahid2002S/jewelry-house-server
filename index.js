const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//JW8GrHSrGxbBsabG


const uri = "mongodb+srv://jewelry-house:JW8GrHSrGxbBsabG@cluster0.ildctqt.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jewelryCollections = client.db("jewelryDB").collection('jewelry');
    const userCollections = client.db("jewelryDB").collection('users');

    app.post('/jewelry', async(req, res) =>{
        const jewelry = req.body;
        const result = await jewelryCollections.insertOne(jewelry);
        res.send(result);
    })

    app.get('/jewelry', async(req, res) => {
        const result = await jewelryCollections.find().toArray();
        res.send(result);
    })

    app.get('/jewelry/:email', async(req, res) =>{
        const email = req.params.email;
        const query = {ownerEmail : email};
        const result = await jewelryCollections.find(query).toArray();
        res.send(result);
    })

    app.post('/users', async(req, res) =>{
        const users = req.body;

        const query = {email : users.email}
        const existingUser = await userCollections.findOne(query);
        if(existingUser){
          return res.send({message : 'user already exist'})
        }

        const result = await userCollections.insertOne(users);
        res.send(result);
    })

    app.patch('/users/owner/:email', async(req, res) =>{
      const email = req.params.email;
      const filter = {email : email}
      const updateDoc = {
        $set: {
          role: 'owner'
        },
      };

      const result = await userCollections.updateOne(filter, updateDoc);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Jewelry House Is Running');
})

app.listen(port, () =>{
    console.log(`Jewelry House Is Running On Port ${port}`)
})