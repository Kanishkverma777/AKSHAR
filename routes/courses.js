const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/coursesController');

router.get('/', ctrl.getAll);

router.get('/:id', ctrl.getById);

router.post(
  '/',
  [
    body('course_id').isString().notEmpty().isLength({ max: 3 }),
    body('course_name').isString().notEmpty().isLength({ max: 100 }),
    body('course_short_name').isString().notEmpty().isLength({ max: 20 }),
    body('prog_id').optional({ nullable: true }).isString(),
    body('dept_id').optional({ nullable: true }).isInt(),
    body('uss_name').isString().notEmpty(),
    body('uss_shortname').isString().notEmpty(),
    body('annual_sem_trimester').isInt(),
    body('min_duration_in_years').isInt({ min: 1 }),
    body('max_duration_in_years').isInt({ min: 1 }),
    body('total_semester_annual').isInt({ min: 1 }),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    body('course_name').isString().notEmpty().isLength({ max: 100 }),
    body('course_short_name').isString().notEmpty().isLength({ max: 20 }),
    body('prog_id').optional({ nullable: true }).isString(),
    body('dept_id').optional({ nullable: true }).isInt(),
    body('uss_name').isString().notEmpty(),
    body('uss_shortname').isString().notEmpty(),
    body('annual_sem_trimester').isInt(),
    body('min_duration_in_years').isInt({ min: 1 }),
    body('max_duration_in_years').isInt({ min: 1 }),
    body('total_semester_annual').isInt({ min: 1 }),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
