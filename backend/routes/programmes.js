const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/programmesController');

router.get('/', ctrl.getAll);

router.get('/:id', ctrl.getById);

router.post(
  '/',
  [
    body('prog_id').isString().notEmpty().isLength({ max: 10 }),
    body('prog_name').isString().notEmpty().isLength({ max: 50 }),
    body('prog_short_name').isString().notEmpty().isLength({ max: 20 }),
    body('regulatory_body_name').optional({ nullable: true }).isString(),
    body('regulatory_body_shortname').optional({ nullable: true }).isString(),
    body('min_duration_in_years').isInt({ min: 1 }),
    body('max_duration_in_years').isInt({ min: 1 }),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    body('prog_name').isString().notEmpty().isLength({ max: 50 }),
    body('prog_short_name').isString().notEmpty().isLength({ max: 20 }),
    body('regulatory_body_name').optional({ nullable: true }).isString(),
    body('regulatory_body_shortname').optional({ nullable: true }).isString(),
    body('min_duration_in_years').isInt({ min: 1 }),
    body('max_duration_in_years').isInt({ min: 1 }),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
