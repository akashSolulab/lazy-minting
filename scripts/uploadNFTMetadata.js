// imports
var express =  require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const NFTSchema = require('./NFTMetadataModel');
const db = require('./NFTMetadataModel');
const {ethers} = require('ethers');
const cors = require('cors');
const { LazyMinter } = require('../lib/LazyMinter');
const artifact = require('../artifacts/contracts/Lazy.sol/LazyNFT.json');
require('dotenv').config()

// intializing express.js
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended: true}));

// connecting to mongodb
mongoose.connect(`${process.env.MONGODB_URL}`, {useNewUrlParser: true}, {useUnifiedTopology: true})

// connecting to ethereum provider
const provider = new ethers.providers.AlchemyProvider('rinkeby', process.env.ALCHEMY_API_KEY);

// smartcontract variable declaration
const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
const abi = artifact.abi;

// intializing tokenId iterator
let tokenId = 0;

/**
 * POST Request: uploading metadata to db along with it's signature 
 * Body params: uri (string)
 */
app.post('/api/uploadNFTMetadata', async (req, res) => {

  // Request body params
  let uri = req.body.uri
  let minPrice = req.body.minPrice

  // converting price from ETH to WEI
  let parseMinPrice = ethers.utils.parseEther(`${minPrice}`).toString()

  // generating a signer
  const signer = new ethers.Wallet(process.env.SIGNER_PRIV_KEY, provider);

  // creating lazy mint contract instance
  const contractInstance = new ethers.Contract(contractAddress, abi, signer)

  // creating new voucher instance(from LazyMinter library)
  let voucher = new LazyMinter({contract: contractInstance, signer: signer});

  // signing the voucher
  let sig = await voucher.createVoucher(tokenId,parseMinPrice,uri);

  // inserting NFT voucher to db
  let NFTMetadata = new NFTSchema({
    tokenId: tokenId,
    tokenURI: uri,
    minPrice: parseMinPrice,
    signature: sig.signature
  })

  // iterating tokenId
  tokenId++;

  // save the NFT voucher
  let finalData = await NFTMetadata.save()
  res.json(finalData)
  console.log("metadata uploaded successfully");
})

/**
 * GET Request: get data from db
 */
app.get('/api/getMetadataDetail', (req, res) => {

  NFTSchema.find({})
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      res.json(err)
    })
})


const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
})
