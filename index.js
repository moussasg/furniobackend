const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors');
const app = express()
const cookieParser = require('cookie-parser'); /// trés essentielles trés trés
const mongoose = require('mongoose');
const authController = require('./src/controllers/authController')
const {checkUser } = require('./src/controllers/authController')
dotenv.config();
app.use(cors({  
  origin: 'https://furnio-frontend-ebkgtobww-moussasg.vercel.app',  // url front-end
  methods: 'GET, POST',
  credentials: true, // Allow credentials
}));// Set up CORS headers manually
app.use((req, res, next) => {
res.header('Access-Control-Allow-Origin', 'https://furnio-frontend-ebkgtobww-moussasg.vercel.app');// url front-end
res.header('Access-Control-Allow-Methods', 'GET, POST');
res.header('Access-Control-Allow-Headers', 'Content-Type');
res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.json());
app.use(cookieParser());
app.get('*', checkUser);
app.post('/Home', authController.signup_post);
app.post('/Signin', authController.login_post);
app.get('/', (req, res) => {
  return res.send('Hello From Backend!')
})
const PORT = process.env.PORT
const connectToMongo = async () => {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  };
  connectToMongo();
 app.listen(PORT , () => {
  console.log(`listening at port ${PORT}`)
})



