/**
 * Import modules
 */
import path from 'path'

import express from 'express'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import connectMongoose from './lib/connectMongoose.js'

import * as homeController from './controllers/homeController.js'
import * as productController from './controllers/productController.js'
import * as loginController from './controllers/loginController.js'
import * as sessionManager from './lib/sessionManager.js'

await connectMongoose()
console.log('Connected to MongoDB')
const app = express()


// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

// Locals variables
app.locals.titleApp = 'Nodepop'

/**
 * Use middlewares
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Middlewares to sessionUsers
app.use(sessionManager.sessionUser)
app.use(sessionManager.useSessionUsersInViews)

/**
 * Routes definitions
 */
app.get('/', homeController.index)

// Login
app.get('/login', loginController.index)
app.post('/login', loginController.loginUser)
app.get('/logout', loginController.logout)

// Products User Auth
app.get('/user/new', sessionManager.guard, productController.index)
app.post('/user/new', sessionManager.guard, productController.validateParams, productController.createProduct)
app.post('/user/delete/:productId', sessionManager.guard, productController.deleteProduct)


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
  res.status(err.status || 500)
  res.render('error')
})

export default app
