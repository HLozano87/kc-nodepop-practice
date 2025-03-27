import Product from "../models/Product.js"

/* GET home page. */
export const index = async (req, res, next) => {
  try {
    const products = await Product.find()
    res.locals.products = products
    res.render('index', { products })
  } catch (error) {
    next(error)
  }
}

