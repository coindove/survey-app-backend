const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 4000


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.get('/surveys', db.getSurveys)
app.get('/surveys/:id', db.getSurveyById)
app.post('/surveys', db.createSurvey)
app.put('/surveys/:id', db.updateSurvey)
app.delete('/surveys/:id', db.deleteSurvey)


app.get('/questions', db.getQuestions)
app.get('/questions/:id', db.getQuestionById)
app.post('/questions', db.createQuestion)
app.put('/questions/:id', db.updateQuestion)
app.delete('/questions/:id', db.deleteQuestion)

app.get('/answers', db.getAnswers)
app.get('/answers/:id', db.getAnswerById)
app.post('/answers', db.createAnswer)
app.put('/answers/:id', db.updateAnswer)
app.delete('/answers/:id', db.deleteAnswer)





app.get('/options', db.getOptions)
app.get('/options/id', db.getOptionById)
app.post('/options', db.createOption)
app.put('/options/:id', db.updateOption)
app.delete('/options/:id', db.deleteOption)


app.post('/register', db.Register)
 app.post('/login', db.Login)




app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

////////////////