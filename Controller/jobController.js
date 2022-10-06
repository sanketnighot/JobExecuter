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


const distributeFunding = async () => {
    let previous_funding_time;
    let upcoming_funding_time;
    let funding_period;
    let current_time = Date.parse(new Date().toUTCString())
    await axios.get("https://api.ghostnet.tzkt.io/v1/contracts/KT1WbA2H87o2RT9sTT4UaEgUAUgq6ZQhynbP/storage")
        .then( async (storage) => {
        previous_funding_time = Date.parse(new Date(storage.data.previous_funding_time).toUTCString())
        upcoming_funding_time = Date.parse(new Date(storage.data.upcoming_funding_time).toUTCString())
        funding_period = parseInt(storage.data.funding_period)
        console.log(upcoming_funding_time, current_time)
        if ((upcoming_funding_time - current_time) <= 60000 ) {
            await Tezos.contract
            .at(process.env.VMMCONTRACT)
            .then((contract) => {
                contract.methods.distributeFunding().send();
            }).then(()=>{
                console.log("Zenith :~ 🚀", "Txn Sent")
            })
            .catch((error) => {
                console.log("Zenith :~ 🚀", "Error");
                console.log(error)
            });
        } else {
            console.log("Zenith :~ 🚀", "Not the funding time")
        }
    }).catch((error)=>{
        console.log(error)
        distributeFunding();
        
    });
}

const liquidatePosition = async () => {
    const storage = await axios.get("https://api.ghostnet.tzkt.io/v1/contracts/KT1WbA2H87o2RT9sTT4UaEgUAUgq6ZQhynbP/storage")
    const positions = storage.data.positions
    for (let address in positions) {
        if (parseInt(positions[address].position) === 1) {
            x = Math.abs(storage.data.vmm.vUSD_amount - (storage.data.vmm.invariant*1000000/(storage.data.vmm.token_amount + positions[address].position_value)))
            final_value = positions[address].collateral_amount - x
            if (final_value > 0) {
            margin_ratio = Math.abs(final_value) * 1000000/positions[address].vUSD_amount
                if (margin_ratio < 85000) {
                    await Tezos.contract
                        .at(process.env.VMMCONTRACT) 
                        .then((contract) => {
                            contract.methods.liquidate(address).send();
                        }).then(()=>{
                            console.log("Zenith :~ 🚀", "Liqudted")
                        })
                        .catch((error) => {
                            console.log("Zenith :~ 🚀", "Error");
                            console.log(error)
                        });
                } else {
                    console.log("Zenith :~ 🚀", "No position to liquidate")
                }
            }

        } else if (parseInt(positions[address].position) === 2){
            x = storage.data.vmm.invariant*1000000/Math.abs(storage.data.vmm.token_amount - positions[address].position_value) - storage.data.vmm.vUSD_amount
            final_value = positions[address].collateral_amount - Math.abs(x)
            if (final_value > 0){
                margin_ratio = Math.abs(final_value) * 1000000/positions[address].vUSD_amount
                if (margin_ratio < 85000) {
                    await Tezos.contract
                        .at(process.env.VMMCONTRACT) 
                        .then((contract) => {
                            contract.methods.liquidate(address).send();
                        }).then(()=>{
                            console.log("Zenith :~ 🚀", "Liquidated")
                        })
                        .catch((error) => {
                            console.log("Zenith :~ 🚀", "Error");
                            console.log(error)
                        });
                } 
            }
        }
      }
    
    
}

module.exports.executeJob = async (req, res) => {
    await distributeFunding().then(()=> {
        console.log("Zenith :~ 🚀", "Job executed 1 of 2")
    });
    await liquidatePosition().then(()=> {
        console.log("Zenith :~ 🚀", "Job executed 2 of 2")
    });
    console.log(new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
    res.send("Done")
}