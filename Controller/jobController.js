const _ = require('lodash') 
const axios = require('axios');
require('dotenv').config();
const {Map} = require('../Models/mapModel');

const checkBooking = async () => {
    const tileCopy = await Map.find({status: "BOOKED"});
    if (tileCopy) {

        return res.status(200).send(tileCopy);
    } else {
        return res.status(404).send({message: 'No Booking Now'})
    }
}

module.exports.executeJob = async (req, res) => {
    const tileCopy = await Map.find({status: "BOOKED"});
    if (tileCopy.length != 0) {
        for (land in tileCopy) {
            const landData = await Map.findOne({x: tileCopy[land].x, y: tileCopy[land].y});
            
            let current_time = Date.parse(new Date().toUTCString())
            let land_time = Date.parse(new Date(landData.updatedAt).toUTCString())
            if ((current_time - land_time) > 60000) {
                console.log((current_time - land_time), landData)
                const landUpdate = await Map.findOneAndUpdate({x: tileCopy[land].x, y: tileCopy[land].y}, {status: ""}).then((newData)=>{
                    if (newData.status === "") {
                        console.log("Updated")
                    }
                })
            }
        }
    }
}

module.exports.getBookedLands = async (req, res) => {
    const tileCopy = await Map.find({status: "BOOKED"});
    if (tileCopy.length != 0) {
        return res.status(200).send(tileCopy);
    } else {
        return res.status(404).send({message: 'No Booking Now'})
    }
}