## Lazy Minting

This project demonstrates Lazy Minting of NFTs

Try running some of the following tasks:

```shell
npx hardhat run ./script/deployContract.js
nodemon run ./script/uploadNFTMetadata.js
```
###### Open Postman
localhost:3000/api/uploadNFTMetadata

###### Body Params
{
    "uri": "pass the token uri here",
    "minPrice": "pass minimum price here"
}

###### Accessing Frontend
/frontend/index.html
