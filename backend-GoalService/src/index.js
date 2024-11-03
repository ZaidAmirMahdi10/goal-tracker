// src/index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Testing route
app.get('/', (req, res) => {
  res.send('Welcome to the Goal Service');
});


app.post('/goals', async (req, res) => {
  const { title, startDate, deadline, description, progress, userId } = req.body; // Add userId

  console.log({ title, startDate, deadline, description, progress, userId }); // Log incoming data

  // Validate date format if necessary
  if (!Date.parse(startDate) || !Date.parse(deadline)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const newGoal = await prisma.goal.create({
      data: {
        title,
        startDate: new Date(startDate), // Convert to Date object
        deadline: new Date(deadline), // Convert to Date object
        description,
        progress: progress !== undefined ? progress : 0, // Default progress if undefined
        userId: parseFloat(userId) 
      }
    });
    res.json(newGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create goal.' });
  }
});


app.patch('/goals/:id/completed', async (req, res) => {
  const { id } = req.params;
  const { completed, progress } = req.body; // Get the completed and progress values from the request body

  try {
    const updatedGoal = await prisma.goal.update({
      where: { id: parseInt(id) }, // Ensure you are using the correct ID type
      data: {
        completed: completed, // Update completed status
        progress: progress,   // Update progress
      },
    });

    console.log("Goal updated in backend:", updatedGoal); // Log to confirm update
    res.json(updatedGoal); // Send the updated goal back
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

app.patch('/goals/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body; // Get the new progress from the request body
  
  try {
    const updatedGoal = await prisma.goal.update({
      where: { id: parseInt(id) },
      data: { progress }, // Update the progress
    });

    console.log(`Goal with ID ${id} progress updated to:`, updatedGoal); // Log success message
    res.json(updatedGoal);
  } catch (error) {
    console.error(`Failed to update progress for goal with ID ${id}:`, error); // Log any errors
    res.status(500).json({ error: "Failed to update goal progress" });
  }
});

app.get('/pagedgoals', async (req, res) => {
  const userId = parseFloat(req.query.userId); // Get userId from query
  const page = parseInt(req.query.page) || 1; // Get the current page from the query, default to 1
  const limit = 5; // Number of goals per page
  const offset = (page - 1) * limit; // Calculate offset for pagination

  try {
    // Ensure userId is provided and valid
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: userId }, // Filter goals by userId
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        deadline: true,
        completed: true,
        progress: true,
      },
    });

    const totalGoals = await prisma.goal.count({ where: { userId: userId } }); // Count total goals for pagination
    res.json({
      goals,
      totalPages: Math.ceil(totalGoals / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching paged goals:", error);
    res.status(500).json({ error: 'Failed to fetch goals.' });
  }
});

app.get('/goals', async (req, res) => {
  const { userId } = req.query; // Assume userId is passed as a query parameter
  const goals = await prisma.goal.findMany({
    where: { userId: parseFloat(userId) } // Filter by userId
  });
  res.json(goals);
});

app.get('/goals/:id', async (req, res) => {
  const { id } = req.params;
  const goal = await prisma.goal.findUnique({ where: { id: parseInt(id) } });
  if (!goal) {
    return res.status(404).json({ error: 'Goal not found.' });
  }
  res.json(goal);
});

app.put('/goals/:id', async (req, res) => {
  const { id } = req.params;
  const { title, startDate, deadline, description, progress, userId } = req.body;

  // Check if the goal belongs to the user
  const existingGoal = await prisma.goal.findUnique({ where: { id: parseInt(id) } });
  if (existingGoal.userId !== parseFloat(userId)) {
    return res.status(403).json({ error: 'You do not have permission to update this goal.' });
  }

  const updatedGoal = await prisma.goal.update({
    where: { id: parseInt(id) },
    data: { title, startDate, deadline, description, progress },
  });
  res.json(updatedGoal);
});

app.delete('/goals/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // Assume userId is passed in the body

  const existingGoal = await prisma.goal.findUnique({ where: { id: parseInt(id) } });
  if (existingGoal.userId !== parseFloat(userId)) {
    return res.status(403).json({ error: 'You do not have permission to delete this goal.' });
  }

  await prisma.goal.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
});


const PORT = process.env.PORT || 3009;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`User service running on http://0.0.0.0:${PORT}`);
});
