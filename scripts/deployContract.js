const hardhat = require('hardhat')
const { ethers } = hardhat

let Factory;
let factory;

async function deploy() {
    const [minter, redeemer, _] = await ethers.getSigners() 
    Factory = await ethers.getContractFactory("LazyNFT", minter);
    factory = await Factory.deploy(minter.address);
    console.log(factory.address);
}

deploy()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.log(err);
        process.exit(0)
    })