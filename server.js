const express = require("express");
const dotenv = require("dotenv").config();
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorHandler");

const connectDb = require("./config/dbConnection")

connectDb()

const app = express();

app.use(express.json()); // Colocar antes del errorHandler

app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);


app.use(errorHandler); // Colocar después de las rutas

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Running on port:", PORT);
});
