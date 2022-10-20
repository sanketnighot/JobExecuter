require('dotenv/config');
const app = require('./app');
const {executeJob} = require('./Controller/jobController');
var cron = require('node-cron');
const PORT = process.env.PORT || 3001;

cron.schedule('*/10 * * * * *', () => {
    executeJob();
    console.log("Job Executed", "⌛️" ,new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
  });


app.listen(PORT, () => {
    console.log(`Zenith :~ 🚀 Server Running`);
});