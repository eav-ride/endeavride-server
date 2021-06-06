const Router = require('express-promise-router');

const userController = require('../controller/user.ctrl');
const router = new Router()

router.use('/', (req, res, next) => {
    console.log('driver auth router...')
    next()
})

router.post('/', userController.authenticate);
router.post('/register', userController.register);

router.get('/', userController.getMyInfo);

module.exports = router;