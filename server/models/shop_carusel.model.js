const Sequelize = require("sequelize");
const sequelize = require("../database");

const ShopPhotos = sequelize.define("shop_photo", {
  image_small: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image_large: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = ShopPhotos;
