const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require("cors");
const authJwt = require('./helpers/jwt');
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((err) => console.log("Service Worker Failed", err));
}

app.use(express.static(path.join(__dirname)));

//ROUTES
const categoriesRoutes = require("./routers/categories");
const productsRoutes = require("./routers/products");   
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");

//MIDDLEWARE
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan('tiny'));
app.use(cors());
app.options("*", cors());
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

const api = process.env.API_URL;

//UTILIZATION
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes)

//DATABASE
mongoose.connect(process.env.CONNECTION_STRING,{
    dbName: 'adfurniture'
})
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log(err);
})

//SERVER
app.listen(2000, () => {
    console.log('Server is running on port 2000');
    console.log(api)
})


//FRONTEND
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/lark-dash", (req, res) => {
    res.sendFile(path.join(__dirname, "lark-dash.html"));
});


// SAVING THE PROGRAM LOGS
const logDirectory = path.join(__dirname, "logs");
const logFile = path.join(logDirectory, "morgan.log");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}
const logStream = fs.createWriteStream(logFile, { flags: "a" });
app.use(morgan("tiny", { stream: logStream }));
