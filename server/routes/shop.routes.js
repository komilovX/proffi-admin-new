const { Router } = require("express");
const upload = require("../middleware/upload");
const router = Router();
const ctr = require("../controller/shop.controller");

// api/shop/carusel
router.get("/carusel", ctr.findAllCarusel);

router.post(
  "/carusel",
  upload.fields([
    { name: "image_small", maxCount: 1 },
    { name: "image_large", maxCount: 1 }
  ]),
  ctr.createCarusel
);

router.get("/carusel/:id", ctr.findCaruselById);

router.put(
  "/carusel/:id",
  upload.fields([
    { name: "image_small", maxCount: 1 },
    { name: "image_large", maxCount: 1 }
  ]),
  ctr.updateCaruselById
);

router.delete("/carusel/:id", ctr.deleteCaruselById);

// api/shop/category

router.get("/category", ctr.findAllCategories);

router.post("/category", ctr.createCategory);

router.get("/category/:id", ctr.findCategoryById);

router.put("/category/:id", ctr.updateCategoryById);

router.delete("/category/:id", ctr.deleteCategoryById);

module.exports = router;
