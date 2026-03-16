const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect("mongodb+srv://ashwinpreamkumar:Ashwin2007@cluster.mongodb.net/taskDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

// Task Schema
const taskSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  userId: String
})

const Task = mongoose.model("Task", taskSchema)


// GET tasks for specific user
app.get("/tasks/:userId", async (req, res) => {

  const tasks = await Task.find({ userId: req.params.userId })

  res.json(tasks)

})


// ADD new task
app.post("/tasks", async (req, res) => {

  const newTask = new Task({
    task: req.body.task,
    completed: false,
    userId: req.body.userId
  })

  await newTask.save()

  const tasks = await Task.find({ userId: req.body.userId })

  res.json(tasks)

})


// DELETE task
app.delete("/tasks/:id/:userId", async (req, res) => {

  await Task.findByIdAndDelete(req.params.id)

  const tasks = await Task.find({ userId: req.params.userId })

  res.json(tasks)

})


// EDIT task / TOGGLE completion
app.put("/tasks/:id/:userId", async (req, res) => {

  const task = await Task.findById(req.params.id)

  task.task = req.body.task ?? task.task
  task.completed = req.body.completed ?? task.completed

  await task.save()

  const tasks = await Task.find({ userId: req.params.userId })

  res.json(tasks)

})


// Server Port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
