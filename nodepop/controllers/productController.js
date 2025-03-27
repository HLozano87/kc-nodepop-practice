import Product from '../models/Product.js'

export const index = (req, res, next) => {
  res.render('new-product')
}

export const createProduct = async (req, res, next) => {
  try {
    const randomImage = `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`;
    const { name, price, image, tags } = req.body
    const productImage = image || randomImage
    const product = new Product({ name, price, image: productImage, tags })

    await product.save()
    console.log(product);
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}