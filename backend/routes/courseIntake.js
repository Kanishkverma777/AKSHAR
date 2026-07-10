const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/courseIntakeController');

router.get('/', ctrl.getAll);

router.get(
  '/:courseId/:acadYear',
  [param('acadYear').isInt()],
  validate,
  ctrl.getById
);

router.post(
  '/',
  [
    body('course_id').isString().notEmpty(),
    body('acad_year').isInt({ min: 1900 }),
    body('approved_intake').isInt({ min: 0 }),
    body('total_admitted').optional({ nullable: true }).isInt({ min: 0 }),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:courseId/:acadYear',
  [
    param('acadYear').isInt(),
    body('approved_intake').isInt({ min: 0 }),
    body('total_admitted').optional({ nullable: true }).isInt({ min: 0 }),
  ],
  validate,
  ctrl.update
);

router.delete(
  '/:courseId/:acadYear',
  [param('acadYear').isInt()],
  validate,
  ctrl.remove
);

module.exports = router;
