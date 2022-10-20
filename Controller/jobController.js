const _ = require('lodash') 
const axios = require('axios');
require('dotenv').config();
const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");

const rpcURL = process.env.RPCURL;
const Tezos = new TezosToolkit(rpcURL);

Tezos.setProvider({
    signer: new InMemorySigner(process.env.PVTKEY),
});


// const distributeFunding = async () => {
//     let upcoming_funding_time;
//     let current_time = Date.parse(new Date().toUTCString())
//     await axios.get("https://api.ghostnet.tzkt.io/v1/contracts/KT1Fg8n2ngkH6goke5ievWAqDaPgL6C51pqX/storage")
//         .then( async (storage) => {
//         upcoming_funding_time = Date.parse(new Date(storage.data.upcoming_funding_time).toUTCString())
//         funding_period = parseInt(storage.data.funding_period)
//         console.log(upcoming_funding_time, current_time)
//         const diff = upcoming_funding_time - current_time
//         console.log("------------>  Diff: ", diff)
//         if ((diff) <= 25000 ) {
//             await Tezos.contract
//             .at(process.env.VMMCONTRACT)
//             .then((contract) => {
//                 contract.methods.distributeFunding().send().then(()=>{
//                 console.log("Zenith :~ 🚀", "Txn Sent")
//             })
//             .catch((error) => {
//                 console.log("Zenith :~ 🚀", "Error");
//                 console.log(error)
//                 distributeFunding();
//             });
//             })
//         } else {
//             console.log("Zenith :~ 🚀", "Not the funding time")
//         }
//     }).catch((error)=>{
//         console.log("err")
        
//     });
// }

const liquidatePosition = async () => {
    const storage = await axios.get("https://api.ghostnet.tzkt.io/v1/contracts/KT1F2Yj6aCFDCxBAQeW9jyfdH4VoLeMG9wTg/storage")
    const positions = storage.data.positions
    for (let address in positions) {
            console.log(address, positions[address].position)
            try {
                await Tezos.contract
                        .at(process.env.VMMCONTRACT) 
                        .then((contract) => {
                            contract.methods.liquidate(address).send().catch((error) => {
                                console.log("Zenith :~ 🚀", "Error");
                                console.log(error)
                            });
                        }).then(()=>{
                            console.log("Zenith :~ 🚀", "Liqudted")
                        }).catch((error) => {
                            console.log("Zenith :~ 🚀", "Error");
                            console.log(error)
                        });

            } catch (error) {
                console.log("Zenith :~ Err")
                console.log(error)
            }
                    
     } 
}

module.exports.executeJob = async (req, res) => {
    // await distributeFunding().then(()=> {
    //     console.log("Zenith :~ 🚀", "Job executed 1 of 2")
    // });
    await liquidatePosition().then(()=> {
        console.log("Zenith :~ 🚀", "Job executed 2 of 2")
    });
    console.log(new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
    // res.send("Done")
}