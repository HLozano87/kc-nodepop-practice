import { body, validationResult } from 'express-validator'
import Product from '../models/Product.js'

export const validateParams = [

  body('name')
    .matches(/^([a-zA-Z]+|\w+\d)(\s([a-zA-Z]+|\w+\d))*$/)
    .isString()
    .withMessage('El nombre del producto es obligatorio, y debe ser valido. Ej: Producto 1 o Producto.'),
  body('price')
    .custom( value => value > 0 ).withMessage('El precio debe ser un número mayor a 0'),
  body('image').optional().isString().withMessage('La URL de la imagen debe ser válida'),
  body('tags')
    .isString()
    .withMessage('Las etiquetas deben ser un arreglo de strings'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('form', { errors: errors.array().map(e => e.msg) })
    }
    next()
  }
]

export const index = (req, res, next) => {
  res.render('new-product')
}

export const createProduct = async (req, res, next) => {
  try {
    const randomImage = `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`;
    const { name, price, image, tags } = req.body
    const userId = req.session.userId

    const productImage = image || randomImage
    const product = new Product({ name, price, image: productImage, tags, owner: userId })

    await product.save()
    console.log(product);
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.session.userId
    const productId = req.params.productId
    await Product.deleteOne({ _id: productId, owner: userId })

    res.redirect('/')
  } catch (error) {
    next(error)
  }
}