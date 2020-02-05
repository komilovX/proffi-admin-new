const { Router } = require('express');
const router = Router()

const ctr = require('../controller/order.controller');
// api/orders/
router.get(
  '/',
  ctr.getAllOrder
)
router.get(
  '/canceled',
  ctr.getAllCanceledOrders
)
router.get(
  '/delivered',
  ctr.getAllDeliveredOrders
)
router.get(
  '/:id',
  ctr.findById
)

router.put(
  '/:id',
  ctr.changeStatus
)
router.post(
  '/new_order',
  ctr.newOrder
)


module.exports = router
