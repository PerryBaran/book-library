const express = require('express');
const readerController = require('../controllers/reader');

const router = express.Router();

router.route('/').post(readerController.create).get(readerController.readAll);

router
  .route('/:readerId')
  .get(readerController.readById)
  .patch(readerController.update)
  .delete(readerController.delete);

module.exports = router;
