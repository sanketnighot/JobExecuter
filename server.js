require('dotenv/config');
const app = require('./app');
const {executeJob} = require('./Controller/jobController');
var cron = require('node-cron');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
require('dotenv/config');
mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=> {
        console.log('Connected to LOL MongoDb Server ...')
    }).catch((err) =>{
        console.log(`MongoDb Connection Failed: ${err}`);
    });

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT} ...`);
});

cron.schedule('*/10 * * * * *', () => {
    executeJob();
    console.log("Job Executed", "⌛️" ,new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
  });