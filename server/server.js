const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/db");
const app = express();
const PORT = process.env.PORT || 4000;

// Configuration de la bdd

mongoose.set('useCreateIndex', true)
mongoose
        .connect(config.database, { useNewUrlParser: true, useUnifiedTopology: false,  })
        .then(() => {
            console.log('Connectée a la db')
        })
        .catch(err => {
            console.log('error :', { database_error: err})
        })

// Cors
app.use(cors())

// Body Parser
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(morgan('dev'))

app.get('/', (req, res) => {
    console.log('hello')
})

const userRoutes = require("./api/user/route/user"); //bring in our user routes
app.use("/user", userRoutes);


app.listen(PORT, () => {
    console.log(`app is running on ${PORT}`)
})