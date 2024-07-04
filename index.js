//import express
const express = require('express')

//set the app to reference express
const app = express()

//middleware to ensure that request.body is not undefined
app.use(express.json())

persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//set port number
const PORT = 3001

//bind app to port
app.listen(PORT, () => {
    console.log(`the server is running on port ${PORT}`)
})