const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/academicSessionsController');

router.get('/', ctrl.getAll);

router.get('/:year', param('year').isInt(), validate, ctrl.getById);

router.post(
  '/',
  [
    body('acad_year').isInt({ min: 1900 }),
    body('session_name').isString().notEmpty().isLength({ max: 20 }),
    body('start_date').isISO8601(),
    body('end_date').isISO8601(),
    body('is_current').optional().isBoolean(),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:year',
  [
    param('year').isInt(),
    body('session_name').isString().notEmpty().isLength({ max: 20 }),
    body('start_date').isISO8601(),
    body('end_date').isISO8601(),
    body('is_current').optional().isBoolean(),
  ],
  validate,
  ctrl.update
);

router.delete('/:year', param('year').isInt(), validate, ctrl.remove);

module.exports = router;
