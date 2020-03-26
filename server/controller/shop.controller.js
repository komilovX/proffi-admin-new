// api/shop/carusel
const fs = require('fs');
const path = require('path');
const ShopPhotos = require('../models/shop_carusel.model')
const ShopCategory = require('../models/shop_category.model')
const Products = require('../models/product.model')

module.exports.findAllCarusel = async (req, res) => {
  try {
    const carousels = await ShopPhotos.findAll({raw: true})
    res.json(carousels)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
module.exports.createCarusel = async (req, res) => {
  try {
    const carousel = await ShopPhotos.create({
      photo: `/${req.file.filename}`,
      product_id: req.body.product_id,
      product_name: req.body.product_name
    })
    res.json(carousel)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
module.exports.findCaruselById = async (req, res) => {
  try {
    const carousel = await ShopPhotos.findByPk(+req.params.id)
    if(!carousel) {
      res.status(404).json({message: 'Not found'})
    }
    else {
      const data = {}
      const products = await Products.findAll({attributes: ['id', 'name']})
      data.products = products
      data.carousel = carousel
      res.json(data)
    }
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.updateCaruselById = async (req, res) => {
  const carousel = await ShopPhotos.findByPk(+req.params.id)
  let photo = carousel.photo.replace('/','')
  let way = path.resolve(__dirname, `../../static/uploads/${photo}`)
  try {
    if (req.file) {
      await ShopPhotos.update({
        photo: `/${req.file.filename}`,
        product_id: req.body.product_id,
        product_name: req.body.product_name
      },{
        where: {id: req.params.id}
      })
      res.json({message: 'updated'})
      fs.unlinkSync(way)
    }
    else {
      await ShopPhotos.update({
        product_id: req.body.product_id,
        product_name: req.body.product_name
      },{
        where: {id: req.params.id}
      })
      res.json({message: 'updated'})
    }
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.deleteCaruselById = async (req, res) => {
  const carousel = await ShopPhotos.findByPk(+req.params.id)
  let photo = carousel.photo.replace('/','')
  let way = path.resolve(__dirname, `../../static/uploads/${photo}`)
  try {
    await ShopPhotos.destroy({
      where: {id: req.params.id}
    })
    res.json({message: 'deleted'})
    fs.unlinkSync(way)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

// api/shop/category

module.exports.findAllCategories = async (req, res) => {
  try {
    const categories = await ShopCategory.findAll({raw: true})
    res.json(categories)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
module.exports.createCategory = async (req, res) => {
  try {
    const category = await ShopCategory.create({
      title: req.body.title,
      products: req.body.products
    })
    res.json(category)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.findCategoryById = async (req, res) => {
  try {
    const category = await ShopCategory.findByPk(+req.params.id)
    if(!category) {
      res.status(404).json({message: 'Not found'})
    }
    else {
      const data = {}
      const products = await Products.findAll({
        raw: true
      })
      data.products = products
      data.category = category
      res.json(data)
    }
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.updateCategoryById = async (req, res) => {
  try {
    await ShopCategory.update({
      title: req.body.title,
      products: req.body.products
    },{
      where: {id: req.params.id}
    })
    res.json({message: 'updated'})
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
module.exports.deleteCategoryById = async (req, res) => {
  try {
    await ShopCategory.destroy({
      where: {id: req.params.id}
    })
    res.json({message: 'deleted'})
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

