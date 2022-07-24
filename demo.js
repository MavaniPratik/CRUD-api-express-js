const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const path = require("path");
const fileContent = fs.readFileSync("index.html");
const app = express();
const port = 8000;

mongoose.connect("mongodb://localhost:27017/customer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const detail = new mongoose.Schema({
  name: String,
  email: String,
  city: String,
  feedback: String,
});
var data = mongoose.model("data", detail);
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("static"));
// app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.end(fileContent);
});
app.post("/postdata", (req, res) => {
  var myData = new data(req.body);
  myData
    .save()
    .then(() => {
      res.send("success...");
    })
    .catch(() => {
      res.status(400).send("not found");
    });
  // res.status(200).render("contect.pug", params);
});
app.get("/Feedback", (req, res) => {
  data
    .find({})
    .then((datas) => {
      res.send(JSON.stringify({ isSucceed: true, result: datas }));
    })
    .catch((err) => {
      console.log("error", err);
      res.status(404).send(JSON.stringify({ isSucceed: false, result: [] }));
    });
});
app.get("/Delete", (req, res) => {
  const removeItem = new data.remove({ _id: req.params._id });
  res.json(removeItem);
});
app.post("/update", (req, res) => {
  let getdata = new data(req.body);
  let data = req.params.id;

  let updateid = getdata[0].id;
  let updatename = getdata[0].name;
  let updateaddress = getdata[0].address;

  data
    .updateMany({ _id: updateid }, { name: updatename, address: updateaddress })
    .then((datas) => {
      res.send(datas, "delete data");
    })
    .catch(() => {
      res.status(404).send("can not get data.");
    });
});
app.listen(port);

