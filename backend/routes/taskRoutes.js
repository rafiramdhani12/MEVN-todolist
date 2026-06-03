import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const router = express.Router();

// Middleware to check for userId header (simple auth for now)
const checkUser = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ message: "User ID required" });
    req.userId = userId;
    next();
};

// GET Task Statistics using Aggregation Pipeline
router.get('/stats', checkUser, async (req, res) => {
    try {
        const stats = await Task.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
            {
                $facet: {
                    statusCounts: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    priorityCounts: [
                        { $group: { _id: "$priority", count: { $sum: 1 } } }
                    ],
                    totalTasks: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        // Formatting the response for easier frontend consumption
        const result = {
            total: stats[0].totalTasks[0]?.count || 0,
            pending: 0,
            active: 0,
            completed: 0,
            low: 0,
            medium: 0,
            high: 0
        };

        stats[0].statusCounts.forEach(s => {
            result[s._id] = s.count;
        });
        
        stats[0].priorityCounts.forEach(p => {
            result[p._id] = p.count;
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all tasks for specific user
router.get('/', checkUser, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create task for specific user
router.post('/', checkUser, async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description || '',
        priority: req.body.priority || 'low',
        status: req.body.status || 'active',
        user: req.userId
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task (verify ownership)
router.put('/:id', checkUser, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found or unauthorized" });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete task (verify ownership)
router.delete('/:id', checkUser, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deletedTask) return res.status(404).json({ message: "Task not found or unauthorized" });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;