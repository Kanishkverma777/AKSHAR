const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/departmentsController');

router.get('/', ctrl.getAll);

router.get('/:id', param('id').isInt(), validate, ctrl.getById);

router.post(
  '/',
  [
    body('dept_code').isString().notEmpty().isLength({ max: 10 }),
    body('dept_name').isString().notEmpty().isLength({ max: 50 }),
    body('hod_emp_id').optional({ nullable: true }).isInt(),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    param('id').isInt(),
    body('dept_code').isString().notEmpty().isLength({ max: 10 }),
    body('dept_name').isString().notEmpty().isLength({ max: 50 }),
    body('hod_emp_id').optional({ nullable: true }).isInt(),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', param('id').isInt(), validate, ctrl.remove);

module.exports = router;
