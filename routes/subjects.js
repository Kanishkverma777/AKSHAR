const router = require('express').Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/subjectsController');

router.get('/', ctrl.getAll);

router.get('/:paperId/:schemeId', ctrl.getById);

router.post(
  '/',
  [
    body('paper_id').isString().notEmpty().isLength({ max: 6 }),
    body('scheme_id').isString().notEmpty().isLength({ max: 12 }),
    body('paper_code').isString().notEmpty().isLength({ max: 10 }),
    body('paper_name').isString().notEmpty().isLength({ max: 100 }),
    body('course_id').isString().notEmpty(),
    body('year_semester').isInt({ min: 1 }),
    body('credits').isInt({ min: 0 }),
    body('type_id').isInt().withMessage('Must be a valid lookup_id for PAPER_TYPE'),
    body('exam_id').isInt().withMessage('Must be a valid lookup_id for EXAM_TYPE'),
    body('mode_id').isInt().withMessage('Must be a valid lookup_id for PAPER_MODE'),
    body('paper_group').optional({ nullable: true }).isString(),
    body('paper_sub_group').optional({ nullable: true }).isString(),
    body('kind_id').isInt().withMessage('Must be a valid lookup_id for PAPER_KIND'),
    body('minor_max_marks').isInt({ min: 0 }),
    body('major_max_marks').isInt({ min: 0 }),
    body('total_max_marks').isInt({ min: 0 }),
    body('pass_marks').isInt({ min: 0 }),
  ],
  validate,
  ctrl.create
);

router.put(
  '/:paperId/:schemeId',
  [
    body('paper_code').isString().notEmpty().isLength({ max: 10 }),
    body('paper_name').isString().notEmpty().isLength({ max: 100 }),
    body('course_id').isString().notEmpty(),
    body('year_semester').isInt({ min: 1 }),
    body('credits').isInt({ min: 0 }),
    body('type_id').isInt(),
    body('exam_id').isInt(),
    body('mode_id').isInt(),
    body('paper_group').optional({ nullable: true }).isString(),
    body('paper_sub_group').optional({ nullable: true }).isString(),
    body('kind_id').isInt(),
    body('minor_max_marks').isInt({ min: 0 }),
    body('major_max_marks').isInt({ min: 0 }),
    body('total_max_marks').isInt({ min: 0 }),
    body('pass_marks').isInt({ min: 0 }),
  ],
  validate,
  ctrl.update
);

router.delete('/:paperId/:schemeId', ctrl.remove);

module.exports = router;
