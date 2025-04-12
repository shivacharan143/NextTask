require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Todo Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments();

    res.json({
      todos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});