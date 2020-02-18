const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
  try {

  } catch (e) {
    res.status(500).json(e)
  }
})


module.exports = router
