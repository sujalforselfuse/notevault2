const express = require('express')
const mongoose=require('mongoose');
const app = express()
require('dotenv').config();

/* const connecttomongo=require('./db');//connecting to db server */
const port = process.env.PORT || 5000



var cors = require('cors')


app.use(cors())


/* connecttomongo(); */
app.use(express.json())
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose.connect(process.env.URI).then(()=>{console.log("db connected")}).catch((err)=>{console.log(err)});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})