const Sequelize = require('sequelize');
const sequelize = require('../database');

const Product = sequelize.define('products', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  photo: Sequelize.STRING,
  category_name: {
    type: Sequelize.STRING,
  },
  category_id: Sequelize.INTEGER,
  brand: Sequelize.STRING,
  brand_id: Sequelize.INTEGER,
  barcode: Sequelize.STRING,
  price: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  comment: {
    type: Sequelize.STRING(800),
  },
  hidden: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Product
