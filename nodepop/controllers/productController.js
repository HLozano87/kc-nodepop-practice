import { body, validationResult } from 'express-validator'
import Product from '../models/Product.js'

export const validateParams = [

  body('name').isString().withMessage('El nombre del producto es obligatorio'),
  body('price').isNumeric({ min: 0 }).withMessage('El precio debe ser un número mayor a 0'),
  body('image').optional().isString().withMessage('La URL de la imagen debe ser válida'),
  body('tags').isString().withMessage('Las etiquetas deben ser un arreglo de strings'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return ({ errors: errors.array() })
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
    const productImage = image || randomImage
    const product = new Product({ name, price, image: productImage, tags })

    await product.save()
    console.log(product);
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    await Product.deleteOne({ _id: id })  // TODO deleteOne owner:id
    
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}