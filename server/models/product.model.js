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
  cost: Sequelize.STRING,
  cost_netto: Sequelize.STRING,
  percent: Sequelize.STRING(4),
  comment: {
    type: Sequelize.STRING(800),
  },
  hidden: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Product
