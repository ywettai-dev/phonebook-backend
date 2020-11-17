require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')
const { update } = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))

app.use(cors())

morgan.token('data', req => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
    Person.countDocuments({}, (err, count) => {
        if (err) {
            res.send(err)
        } else {
            const phonebookInfo =  `<p>Phonebook has info for ${count} people</p>
                                    <p>${new Date()}</p>`
            res.send(phonebookInfo)
        }
    })
})

app.get('/api/persons/:id', (req, res, next) => {
   Person.findById(req.params.id)
   .then(person => {
       if (person) {
           res.json(person)
       } else {
           res.status(404).end()
       }
   })
   .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => {
            res.json(savedAndFormattedPerson)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => updatedPerson.toJSON())
        .then(updatedAndFormattedPerson => {
            res.json(updatedAndFormattedPerson)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})