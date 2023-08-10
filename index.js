const express = require("express"); // Import library

const app = express(); // Create instance
const port = 8000; // Define port
app.use(express.json()); // to parse json input from body
app.get("/", function (req, res) {
  res.json({
    message: "Hello",
  });
});
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
let db;
console.log("Connecting to mongodb");
const client = new MongoClient(url);
// Database Name
const dbName = "smartPhones";

async function main() {
  await client.connect();
  console.log("Connected succesfully to server");
  db = client.db("smartPhones");
}
main();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.listen(port, function (err) {
  if (err) {
    console.log("Failed to listen on port ", port);
  } else console.log(`app running at: http://localhost:${port}/`);
});

/// API to post smartphone Data in database
const {
  addSmartPhone,
  searchingPhone,
  getBrands,
  getModels,
  getPhonesByPrice,
} = require("./phones");
app.post("/addingSmartphones", async function (req, res) {
  let mySmartPhones = await addSmartPhone(db, req.body);
  res.json({
    status: 200,
    message: "Phones Added Successfully",
  });
});

app.get("/searchingPhones", async function (req, res) {
  let { brandId, model, from, to,storage } = req.query;
  from = parseInt(from);
  to = parseInt(to);
  storage= parseInt(storage)

  const gettingPhones = await searchingPhone(db, brandId, model, from, to,storage);
  res.json({
    status: 200,
    message: "here is your phone",
    data: gettingPhones,
  });
});




app.get("/getBrandOnly", async function (req, res) {
  let brand = await getBrands(db);
  res.json({
    status: 200,
    message: "Here is your brands",
    data: brand,
  });
});

// to get model names by giving brand

app.get("/getModelsOnly", async function (req, res) {
  const { brand } = req.query;
  const modelResult = await getModels(db, brand);
  res.json({
    status: 200,
    message: "here is your models",
    data: modelResult,
  });
});

app.get("/priceFilter", async function (req, res) {
  let { from, to } = req.query;
  from = parseInt(from);
  to = parseInt(to);

  let priceResult = await getPhonesByPrice(db, from, to);
  res.json({
    status: 200,
    message: "These are the phones of your budget",
    data: priceResult,
  });
});
