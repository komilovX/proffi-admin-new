const { Router } = require('express');
const router = Router()
const upload = require('../middleware/upload')
const ctr = require('../controller/send_message.controller')


//  /api/send_message
router.get(
  '/',
  ctr.findAllMessages
)
router.post(
  '/',
  upload.single('image'),
  ctr.createMessage
)
router.post(
  '/send',
  ctr.sendMessageNow
)
router.get(
  '/:id',
  ctr.findById
)
router.put(
  '/:id',
  ctr.updateById
)
router.delete(
  '/:id',
  ctr.deleteById
)



module.exports = router
