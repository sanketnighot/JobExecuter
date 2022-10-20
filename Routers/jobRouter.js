const router = require('express').Router();
const {executeJob} = require('../Controller/jobController');

router.route('/executeJob').post(executeJob);
module.exports = router;