const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

let users = [];
let exercises = [];

// 生成唯一ID的简单函数
const generateId = () => Math.random().toString(36).substr(2, 9);

// 创建新用户
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = {
    username,
    _id: generateId(),
  };
  users.push(newUser);
  res.json(newUser);
});

// 获取所有用户列表
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 记录用户运动
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const user = users.find(u => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
    _id: generateId(),
    userId: _id,
  };
  
  exercises.push(exercise);

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id,
  });
});

// 获取用户运动日志
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find(u => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let userExercises = exercises.filter(ex => ex.userId === _id);

  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(ex => new Date(ex.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(ex => new Date(ex.date) <= toDate);
  }

  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: userExercises.length,
    log: userExercises.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: ex.date,
    })),
  });
});

// 启动服务器
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
