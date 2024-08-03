//import express
require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')


//set the app to reference express
const app = express()

//middleware to ensure that request.body is not undefined
app.use(express.json())
app.use(cors())
morgan.token('body', (req) => {
  return JSON.stringify({ "name": req.body.name, "number": req.body.number })
})
morgan.token('len', (req) => {
  return req.headers['content-length']
})

app.use(morgan(':method :url :status :len - :response-time ms :body'))
app.use(express.static('dist'))


app.get('/api/persons', (request, response) => {
  Contact.find({}).then(c => {
    response.json(c)
  })
})


app.get('/info', (request, response) => {
  const date = new Date()
  Contact.find({}).then(c =>{
    const text = `<p>Phonebook has info for ${c.length} people</p> <p>${date}</p>`
    response.send(text)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(c => {
    if (c) {
      response.json(c)
    } else {
      response.status(404).end()
    }
    mongoose.connection.close()
  })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

/*
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
});*/


app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined || body.number === undefined){
    return response.status(400).json({error: 'both name and number must be entered'})
  }
  
  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    response.json(result)
  })
})
//set port number
const PORT = process.env.PORT

//bind app to port
app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`)
})