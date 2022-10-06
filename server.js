require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app');
mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=> {
        console.log('Zenith :~ 🚀 Connected to Zenith MongoDb Server ...')
    }).catch((err) =>{
        console.log(`Zenith :~ ⚠️ MongoDb Connection Failed: ${err}`);
    });


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Zenith :~ 🚀 Server Running`);
});