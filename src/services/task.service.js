const Task = require('../models/Task');

class TaskService {
  // Create a new task
  async createTask(taskData, userId) {
    const task = await Task.create({
      ...taskData,
      createdBy: userId,
      assignedTo: taskData.assignedTo || userId, // Assign to creator if not specified
    });

    return await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
  }

  // Get tasks with pagination and filters
  async getTasks(userId, userRole, query) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sortBy = '-createdAt',
    } = query;

    // Build filter
    const filter = { isDeleted: false };

    // Role-based filtering
    if (userRole !== 'admin') {
      // Regular users can only see their assigned tasks
      filter.assignedTo = userId;
    }

    // Add optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    return {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get single task by ID
  async getTaskById(taskId, userId, userRole) {
    const task = await Task.findOne({ _id: taskId, isDeleted: false })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return null;
    }

    // Check permissions
    if (userRole !== 'admin' && task.assignedTo._id.toString() !== userId.toString()) {
      throw new Error('Not authorized to access this task');
    }

    return task;
  }

  // Update task
  async updateTask(taskId, updateData, userId, userRole) {
    const task = await Task.findOne({ _id: taskId, isDeleted: false });

    if (!task) {
      return null;
    }

    // Check permissions
    if (userRole !== 'admin' && task.assignedTo.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this task');
    }

    // Update task
    Object.assign(task, updateData);
    await task.save();

    return await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
  }

  // Delete task (soft delete)
  async deleteTask(taskId, userId, userRole) {
    const task = await Task.findOne({ _id: taskId, isDeleted: false });

    if (!task) {
      return null;
    }

    // Check permissions - only admin or task creator can delete
    if (userRole !== 'admin' && task.createdBy.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this task');
    }

    task.isDeleted = true;
    await task.save();

    return task;
  }

  // Get task statistics (admin only)
  async getTaskStats() {
    const stats = await Task.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      byStatus: stats,
      byPriority: priorityStats,
    };
  }
}

module.exports = new TaskService();
