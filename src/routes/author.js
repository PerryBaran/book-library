const express = require('express');
const authorController = require('../controllers/author');

const router = express.Router();

router.route('/').post(authorController.create).get(authorController.readAll);

router
  .route('/:authorId')
  .get(authorController.readById)
  .patch(authorController.update)
  .delete(authorController.delete);

module.exports = router;
