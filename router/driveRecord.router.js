const Router = require('express-promise-router');

const recordController = require('../controller/driveRecord.ctrl');
const router = new Router()

router.use('/', (req, res, next) => {
    console.log('drive record router...')
    next()
})

router.post('/', recordController.newRide);

router.get('/:rid', recordController.getRecordByRid);
router.get('/a/:rid', recordController.getAllRecordsByRid);

module.exports = router;