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
app.use(express.static('dist'))
app.use(express.json())

/* requestlogger middleware */
morgan.token('body', (req) => {
  return JSON.stringify({ "name": req.body.name, "number": req.body.number })
})
morgan.token('len', (req) => {
  return req.headers['content-length']
})
/* end of requestlogger middleware */

app.use(morgan(':method :url :status :len - :response-time ms :body'))

app.use(cors())



// error handler for middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError')
  {    
    return response.status(400).json({ error: error.message }) 
  }

  next(error)
}

/* start of route registrations */
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

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(c => {
    if (c) {
      response.json(c)
    } else {
      response.status(404).end()
    }
    mongoose.connection.close()
  })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
  .then(result =>{
    response.status(204).end()
  })
  .catch(error => next(error))
});


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    response.json(result)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) =>{
  const { name, number } = request.body

  Contact.findByIdAndUpdate(request.params.id, {name, number}, {new: true, runValidators: true, context: 'query' })
  .then(updateContact => {
    response.json(updateContact)
  })
  .catch(error => next(error))
})

app.use(errorHandler)
/* end of route registrations */

//set port number
const PORT = process.env.PORT

//bind app to port
app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`)
})