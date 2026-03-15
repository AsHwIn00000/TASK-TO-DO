const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://ashwinpreamkumar:Ashwin2007@first.3h30pys.mongodb.net/taskDB?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

const taskSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
})

const Task = mongoose.model("Task", taskSchema)

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find()
  res.json(tasks)
})

app.post("/tasks", async (req, res) => {

  const newTask = new Task({
    task: req.body.task,
    completed: false
  })

  await newTask.save()

  const tasks = await Task.find()

  res.json(tasks)
})

app.delete("/tasks/:id", async (req, res) => {

  await Task.findByIdAndDelete(req.params.id)

  const tasks = await Task.find()

  res.json(tasks)

})

app.put("/tasks/:id", async (req, res) => {

  const task = await Task.findById(req.params.id)

  task.task = req.body.task ?? task.task
  task.completed = req.body.completed ?? task.completed

  await task.save()

  const tasks = await Task.find()

  res.json(tasks)

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
