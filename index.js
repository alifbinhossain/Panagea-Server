const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

/* -------------------------- MONGO DB CLIENT SETUP ------------------------- */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwgkc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function server() {
  try {
    await client.connect();

    const database = client.db("panagea_DB");
    const tourCollection = database.collection("tours");
    const orderCollection = database.collection("orders");

    //REQUEST TO GET ALL TOURS
    app.get("/tours", async (req, res) => {
      const result = await tourCollection.find({}).toArray();

      res.send(result);
    });

    //REQUEST TO GET ONE SPECIFIC TOUR
    app.get("/tour/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tourCollection.findOne(query);

      res.send(result);
    });

    //REQUEST GET FROM HOME TOURS
    app.get("/home/tours", async (req, res) => {
      const query = { category: "popular" };
      const result = await tourCollection.find(query).toArray();
      res.send(result);
    });

    //REQUEST POST FOR PLACE ORDER
    app.post("/tour/booking", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

server().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from assignment server");
});

app.listen(port, () => {
  console.log("Server running on", port);
});
