const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/employeesController');

router.get('/', ctrl.getAll);

router.get('/:id', param('id').isInt(), validate, ctrl.getById);

router.post(
  '/',
  [
    body('emp_code').isString().notEmpty().isLength({ max: 10 }),
    body('emp_name').isString().notEmpty().isLength({ max: 100 }),
    body('email').optional({ nullable: true }).isEmail(),
    body('phone').optional({ nullable: true }).isString().isLength({ max: 15 }),
    body('designation').optional({ nullable: true }).isString(),
    body('dept_id').optional({ nullable: true }).isInt(),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    param('id').isInt(),
    body('emp_code').isString().notEmpty().isLength({ max: 10 }),
    body('emp_name').isString().notEmpty().isLength({ max: 100 }),
    body('email').optional({ nullable: true }).isEmail(),
    body('phone').optional({ nullable: true }).isString().isLength({ max: 15 }),
    body('designation').optional({ nullable: true }).isString(),
    body('dept_id').optional({ nullable: true }).isInt(),
    body('is_active').optional().isBoolean(),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', param('id').isInt(), validate, ctrl.remove);

module.exports = router;
