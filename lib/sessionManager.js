import session from 'express-session'
import MongoStore from 'connect-mongo'
import { config } from 'dotenv'

config()

const SECRET_SESSION = process.env.SECRET_SESSION || 'Secret'
const TIME_LIFE_SESSION = parseInt(process.env.TIME_LIFE_SESSION, 10) ?? (2 * 24 * 60 * 60 * 1000) // 2 Days
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/nodepop'

export const sessionUser = session({
    name: 'nodepop-sessionUsers',
    secret: SECRET_SESSION,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: TIME_LIFE_SESSION
    },
    store: MongoStore.create({
      mongoUrl: MONGO_URL
    })
})

export function useSessionUsersInViews(req, res, next) {
  res.locals.session = req.session
  next()
}

export function guard(req, res, next) {
  if (!req.session.userId) {
    res.redirect(`/login?redir=${req.url}`)
    return
  }
  next()
}