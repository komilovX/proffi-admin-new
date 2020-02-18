const { Router } = require('express');
const router = Router()
const pagination = require('../middleware/pagination');
const supplier = require('../controller/supplier.controller');
const supply = require('../controller/supply.controller');
const store = require('../controller/store.controller');


// /api/storage/supplier

router.post(
  '/supplier',
  supplier.createSupplier
)
router.get(
  '/supplier',
  supplier.findAllSupplier
)
router.get(
  '/supplier/:id',
  supplier.findSupplierById
)
router.put(
  '/supplier/:id',
  supplier.updateSupplierById
)
router.put(
  '/supplier/delete/:id',
  supplier.deleteSupplierById
)

// /api/storage/supply

router.post(
  '/supply',
  supply.createSupply
)
router.get(
  '/supply',
  pagination('supply'),
  supply.findAllSupply
)
router.get(
  '/supply/calculations',
  pagination('remainder'),
  supply.findAllCalculations
)
router.put(
  '/supply/calculations',
  supply.changeResidue
)
router.get(
  '/supply/details',
  supply.findAllDetailsForSupply
)
router.get(
  '/supply/:id',
  supply.findSupplyById
)
router.put(
  '/supply/:id',
  supply.updateById
)
router.put(
  '/supply/delete/:id',
  supply.deleteSupplyById
)
router.put(
  '/supply/limit/:id',
  supply.updateLimitById
)
// /api/storage/store
router.post(
  '/store',
  store.createStore
)
router.get(
  '/store',
  store.findAllStore
)
router.get(
  '/store/:id',
  store.findStoreById
)
router.put(
  '/store/:id',
  store.updateById
)
router.put(
  '/store/delete/:id',
  store.deleteById
)

module.exports = router
