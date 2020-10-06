const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(cors())

morgan.token('data', req => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const totalPeople = persons.length
    const accessDateTime = new Date()
    res.send(`
    <p>Phonebook has info for ${totalPeople} people</p>
    <p>${accessDateTime}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

const generateId = () => {
    const id = Math.floor(Math.random() * 10000000)
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    // check name missing
    // check name already exists
    if (!body.name) {
        return res.status(400).json({
            error: 'name must fill, it is missing'
        })
    } else if (persons.map(person => person.name).indexOf(body.name) > -1) {
        return res.status(409).json({
            error: 'name must be unique'
        })
    } else {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number,
        }

        persons = persons.concat(person)

        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})