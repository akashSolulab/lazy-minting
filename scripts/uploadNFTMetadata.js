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
mongoose.connect("mongodb+srv://akash:doctorwho101@cluster0.vxbiy.mongodb.net/lazy", {useNewUrlParser: true}, {useUnifiedTopology: true})

// connecting to ethereum provider
const provider = new ethers.providers.AlchemyProvider('rinkeby', process.env.ALCHEMY_API_KEY);

// generating a signer
const signer = new ethers.Wallet(process.env.SIGNER_PRIV_KEY, provider);
console.log(signer.address);

// smartcontract variable declaration
const contractAddress = '0x6B99D120c660260fad24217E4F75f21486653e05';
const abi = artifact.abi;

// creating lazy mint contract instance
const contractInstance = new ethers.Contract(contractAddress, abi, signer)

// intializing tokenId iterator
let tokenId = 0;

/**
 * POST Request: uploading metadata to db along with it's signature 
 * Body params: uri (string)
 */
app.post('/api/uploadNFTMetadata', async (req, res) => {
  let uri = req.body.uri

  // creating new voucher instance(from LazyMinter library)
  let voucher = new LazyMinter({contract: contractInstance, signer: signer});
  console.log(signer.address);

  // signing the voucher
  let sig = await voucher.createVoucher(tokenId, uri);
  console.log(sig);

  // inserting NFT voucher to db
  let NFTMetadata = new NFTSchema({
    _id: new mongoose.Types.ObjectId(),
    tokenId: sig.tokenId,
    tokenURI: sig.uri,
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
