const router = require('express').Router();
const {executeJob, getBookedLands} = require('../Controller/jobController');

router.route('/getBookedLands').get(getBookedLands);
module.exports = router;