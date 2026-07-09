const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/courseSchemesController');

router.get('/', ctrl.getAll);

router.get('/:id', ctrl.getById);

router.post(
  '/',
  [
    body('scheme_id').isString().notEmpty().isLength({ max: 12 }),
    body('course_id').isString().notEmpty(),
    body('acad_year').optional({ nullable: true }).isInt(),
    body('semester_annual').isInt(),
    body('min_duration_in_years').isInt({ min: 1 }),
    body('max_duration_in_years').isInt({ min: 1 }),
    body('total_semester_annual').isInt({ min: 1 }),
    body('min_credits').isInt({ min: 0 }),
    body('max_credits').isInt({ min: 0 }),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    body('course_id').isString().notEmpty(),
    body('acad_year').optional({ nullable: true }).isInt(),
    body('semester_annual').isInt(),
    body('min_duration_in_years').isInt({ min: 1 }),
    body('max_duration_in_years').isInt({ min: 1 }),
    body('total_semester_annual').isInt({ min: 1 }),
    body('min_credits').isInt({ min: 0 }),
    body('max_credits').isInt({ min: 0 }),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
