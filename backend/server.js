require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const divisionRoutes = require('./routes/division');
const customerIssueRoutes = require('./routes/customerIssue'); // Ensure this matches the exact filename



const app = express()
app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Mounting the routes
app.use('/api/division', divisionRoutes); // All division routes will be prefixed with /api/division
app.use('/api/customerIssue', customerIssueRoutes); // All customer issue routes will be prefixed with /api/customerIssue


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })

  })
  .catch((error) => {
    console.log(error)
  })
