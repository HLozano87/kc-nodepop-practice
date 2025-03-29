import User from '../models/User.js'

export const index = (req, res, next) => {
  res.locals.error = ''
  res.locals.email = ''
  res.render('login')
}

export async function loginUser (req, res, next) {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      res.locals.error = 'Email and password required.'
      return res.render('login')
    }

    const user = await User.findOne({ email: email })
    
    if (!user || !(await user.comparePassword(password))) {
      res.locals.error = 'Credentials not valid.'
      res.locals.email = email
      return res.render('login')
    }
    req.session.userId = user.id

    res.redirect('/')
  } catch (error) {
    next(error)
    return
  }
  
}

export function logout(req, res, next) {
  req.session.destroy(err => {
    if (err) {
      next(err)
      return
    }
    res.redirect('login')
  })
}