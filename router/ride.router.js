const Router = require('express-promise-router');

const rideController = require('../controller/ride.ctrl');
const router = new Router()

router.use('/', (req, res, next) => {
    console.log('ride router...')
    next()
})

router.post('/', rideController.newRide);
router.post('/:rid', rideController.updateRideStatus);

router.get('/:rid', rideController.getRide);
router.get('/', rideController.getCurrentRide);
router.get('/all', rideController.getRides);

module.exports = router;