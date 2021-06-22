const Router = require('express-promise-router');

const rideController = require('../controller/ride.ctrl');
const router = new Router()

router.use('/', (req, res, next) => {
    console.log('ride router...')
    next()
})

router.post('/', rideController.newRide);
router.post('/d', rideController.acceptRideRequest);
router.post('/:rid', rideController.updateRideStatus);

router.get('/', rideController.getCurrentRide);
router.get('/all', rideController.getRides);
router.get('/d/', rideController.getCurrentRideForDriver);
router.get('/d/request', rideController.requestRideFromDriver);
router.get('/:rid', rideController.getRide);

module.exports = router;