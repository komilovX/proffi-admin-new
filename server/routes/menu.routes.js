const {Router} = require('express')
const upload = require('../middleware/upload');
const router = Router()

const ctr = require('../controller/menu.controller');

// /api/menu/category

router.post(
  '/category',
  upload.single('image'),
  ctr.createCategory
)
router.get(
  '/category',
  ctr.findAllCategories
)
router.get(
  '/category/sort',
  ctr.findAllSortedCategories
)
router.get(
  '/category/:id',
  ctr.findCategoryById
)
router.put(
  '/category/:id',
  upload.single('image'),
  ctr.updateCategoryById
)
router.delete(
  '/category/:id',
  ctr.deleteCategoryById
)
router.put(
  '/category/hide/:id',
  ctr.hideCategoryById
)

// /api/menu/products

router.post(
  '/product',
  upload.single('image'),
  ctr.createProduct
)
router.get(
  '/product',
  ctr.findAllProducts
)
router.get(
  '/product/:id',
  ctr.findProductById
)
router.put(
  '/product/:id',
  upload.single('image'),
  ctr.updateProductById
)
router.delete(
  '/product/:id',
  ctr.deleteProductById
)
router.put(
  '/product/hide/:id',
  ctr.hideProductById
)

module.exports = router
