const express = require('express');
const genreController = require('../controllers/genre');

const router = express.Router();

router.route('/').post(genreController.create).get(genreController.readAll);

router
  .route('/:genreId')
  .get(genreController.readById)
  .patch(genreController.update)
  .delete(genreController.delete);

module.exports = router;
