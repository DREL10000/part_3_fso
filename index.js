//import express
const express = require('express')
const morgan = require('morgan')



//set the app to reference express
const app = express()

//middleware to ensure that request.body is not undefined
app.use(express.json())
morgan.token('body', (req)=>{
  return JSON.stringify({"name": req.body.name, "number": req.body.number})
})
morgan.token('len', (req) => {
  return req.headers['content-length']
})

app.use(morgan(':method :url :status :len - :response-time ms :body'))

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

app.get('/info', (request, response) => {
  const date = new Date()
  const text = `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`
  response.send(text)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
});


const retRand = () => {
  return Math.floor(Math.random() * 10000);
}


// ensures that there is no duplicates id
const checkIn = (rand) => {
  for (const i in persons) {
    if (Number(persons[i].id) === rand) {
      return true
    }
  }
  return false;
}

const generateId = () => {
  const Ids = persons.length > 0 ? persons.map(n => Number(n.id)) : 0
  let rand = 0
  if (Ids === 0) {
    return 0
  }
  else {
    do {
      rand = retRand()
    } while (checkIn(rand))
    return rand;
  }
}




app.post('/api/persons', (request, response) => {
  const body = request.body
  const id = generateId()
  const names = persons.map(p => p.name)

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'content missing'
    })
  }
  // checks to see if name exists in array already
  for (const i in names) {
    if (persons[i].name.toLowerCase() === body.name.toLowerCase()) {
      return response.status(404).json({
        error: 'name must be unique'
      })
    }
  }

  const person = {
    "id": String(id),
    "name": body.name,
    "number": body.number,
  }

  persons = persons.concat(person)
  response.json(person)

})
//set port number
const PORT = 3001

//bind app to port
app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`)
})