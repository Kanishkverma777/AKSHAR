const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/lookupsController');

router.get('/', ctrl.getAll);

router.get('/:id', param('id').isInt(), validate, ctrl.getById);

router.post(
  '/',
  [
    body('category').isString().notEmpty(),
    body('code').isInt(),
    body('label').isString().notEmpty(),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    param('id').isInt(),
    body('category').isString().notEmpty(),
    body('code').isInt(),
    body('label').isString().notEmpty(),
    body('is_active').optional().isBoolean(),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', param('id').isInt(), validate, ctrl.remove);

module.exports = router;
