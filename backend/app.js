const express = require('express')
const dotenv = require('dotenv')
const todosRouter = require('./routes/todos')
const {initializeDB} = require('./db/db')

dotenv.config()

const app = express()
app.use(express.json())

initializeDB()

app.use('/todos', todosRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
