require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const customerIssueRoutes = require('../backend/routes/customerIssue.js');
const divisionRoutes = require('../backend/routes/division.js')

const app = express()
app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/customerIssue', customerIssueRoutes);
app.use('/api/division', divisionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })

  })
  .catch((error) => {
    console.log(error)
  })
