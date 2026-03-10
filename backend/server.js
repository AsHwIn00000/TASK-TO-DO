const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/taskDB")
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

app.listen(3000, () => {
  console.log("Server running on port 3000")
})