const express = require('express');
const bookController = require('../controllers/book');

const router = express.Router();

router.route('/').post(bookController.create).get(bookController.readAll);

router
  .route('/:bookId')
  .get(bookController.readById)
  .patch(bookController.update)
  .delete(bookController.delete);

module.exports = router;
