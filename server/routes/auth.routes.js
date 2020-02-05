const { Router } = require('express')
const router = Router()

const { createUser, loginSystem, findAll, getById, updateById, deleteById } = require('../controller/auth.controller')

router.post('/login', loginSystem)
router.post(
  '/create',
  createUser
)
router.get(
  '/admins',
  findAll
)
router.get(
  '/admin/:id',
  getById
)
router.put(
  '/admin/:id',
  updateById
)
router.delete(
  '/admin/:id',
  deleteById
)

module.exports = router
