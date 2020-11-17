const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = 
    `mongodb+srv://adminTai:${password}@fullstackopen2020.qtuyb.mongodb.net/phonebook-backend?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(res => {
        console.log('phonebook:')
        res.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length > 3) {
    const person = new Person({
        name: name,
        number: number
    })
    
    person.save().then(res => {
        console.log(`Added ${name} ${number} to phonebook!`)
        mongoose.connection.close()
    })
}