const Sequelize = require('sequelize');
const sequelize = require('../database');

const ShopCategory = sequelize.define('shop_category', {
  title: Sequelize.STRING,
  products: Sequelize.STRING,
})

module.exports = ShopCategory
