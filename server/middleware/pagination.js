const Op = require('sequelize').Op;
const Brands = require('../models/brand.model');
const Products = require('../models/product.model');
const Remainder = require('../models/remainder.model');
const Supply = require('../models/supply.model');
const Users = require('../models/user.model');
const Orders = require('../models/orders.model');
module.exports = function (model) {
  return async (req, res, next) => {
   try {
    switch (model) {
      case 'brand':
        const brands = await Brands.findAll({order: [['name','ASC']], raw: true})
        res.result = calculus(brands, req)
        next()
        break;
      case 'products':
        const products = await Products.findAll({order: [['name','ASC']], raw: true})
        res.result = calculus(products, req)
        next()
        break;
      case 'remainder':
        const remainder = await Remainder.findAll({order: [['residue','ASC']], raw: true})
        res.result = calculus(remainder, req)
        next()
        break;
      case 'supply':
        const supply = await Supply.findAll({order: [['date','DESC']], raw: true})
        res.result = calculus(supply, req)
        next()
        break;
      case 'users':
        const users = await Users.findAll({order: [['first_name','ASC']], raw: true})
        res.result = calculus(users, req)
        next()
        break;
      case 'activeUsers':
        const activeUsers = await Users.findAll({where: {orders: {[Op.ne]: 0} }, order: [['first_name','ASC']], raw: true})
        res.result = calculus(activeUsers, req)
        next()
        break;
      case 'deliveredOrders':
        const deliveredOrders = await Orders.findAll({where: {status: 4}, raw: true})
        res.result = calculus(deliveredOrders, req)
        next()
        break;
      case 'canceledOrders':
        const canceledOrders = await Orders.findAll({where: {status: -1}, raw: true})
        res.result = calculus(canceledOrders, req)
        next()
        break;
      default:
        break;
    }
   } catch (e) {
     res.status(500).json(e)
   }
}

function calculus(model, req) {
    let page = req.query.page
    let limit = +req.query.limit
    const result = {}
    const startIndex = (+page-1) * limit
    const endIndex = +page*limit
    result.data = model.slice(startIndex, endIndex)
    result.size = model.length
    return result
  }
}
