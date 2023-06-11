const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(express.json()); // for parsing application/json

const uri = process.env.MONGODB_URI;
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }
    console.log('Connected...');
    db = client.db();
});

// Create a new todo
app.post('/todos', (req, res) => {
    const newTodo = { task: req.body.task, completed: false };
    db.collection('todos').insertOne(newTodo, (err, result) => {
        if (err) throw err;
        res.status(201).json(result.ops[0]);
    });
});

// Get all todos
app.get('/todos', (req, res) => {
    db.collection('todos').find().toArray((err, items) => {
        if (err) throw err;
        res.status(200).json(items);
    });
});

// Update a todo
app.put('/todos/:id', (req, res) => {
    const query = { _id: new MongoClient.ObjectId(req.params.id) };
    const newValues = { $set: { task: req.body.task, completed: req.body.completed } };
    db.collection('todos').updateOne(query, newValues, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Todo updated successfully" });
    });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
    const query = { _id: new MongoClient.ObjectId(req.params.id) };
    db.collection('todos').deleteOne(query, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Todo deleted successfully" });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
