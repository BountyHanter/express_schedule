var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Добавьте эти строки
var { Pool } = require('pg');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Настройки подключения к базе данных PostgreSQL
var pool = new Pool({
  user: 'denis', // Ваше имя пользователя
  host: 'localhost',
  database: 'web_js', // Название вашей базы данных
  password: '14101999', // Ваш пароль
  port: 5432,
});

// API-эндпоинт для получения расписания
app.get('/api/schedule', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM schedule'); // Измените на имя вашей таблицы
    res.json({ schedule: rows });
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Server error');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
