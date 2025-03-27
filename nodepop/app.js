/**
 * Import modules
 */
import express from 'express'
import createError from 'http-errors'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import * as homeController from './controllers/homeController.js'


const app = express()


// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

// Locals variables
app.locals.title = 'Nodepop'

/**
 * Use middlewares
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

/**
 * Routes definitions
 */
app.get('/', homeController.index)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('Ocurrió un error: ', err.message);
})

export default app
