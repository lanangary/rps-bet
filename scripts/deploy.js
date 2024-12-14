const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const BetGame = await ethers.getContractFactory("BetGame");
    const betGame = await BetGame.deploy();
    console.log("BetGame contract deployed to:", betGame.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
