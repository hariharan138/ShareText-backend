const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb+srv://harii:RYFvmXgAGeQwfjtT@mydb.vcxyb.mongodb.net/?retryWrites=true&w=majority&appName=MyDB";
const client = new MongoClient(uri);

client.connect()
    .then(() => {
        console.log("Connected to MongoDB Atlas");

        const database = client.db("Database");
        const collection = database.collection("chunks");

        // API Endpoint to insert data
        app.post("/data", async (req, res) => {
            try {
                const { text } = req.body;
                const result = await collection.insertOne({ text });
                res.status(201).json({ id: result.insertedId });
            } catch (err) {
                console.error("Error inserting data:", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        app.get('/', (req, res) => {
      res.send('Hello, World!');
        });
        // API Endpoint to fetch data
        app.get("/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const objectId = new ObjectId(id);
                const data = await collection.findOne({ _id: objectId });
                if (data) {
                    res.json(data.text);
                    
                } else {
                    res.status(404).json({ message: "Data not found" });
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        app.listen(4000, () => {
            console.log("Backend server running at http://localhost:4000");
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
