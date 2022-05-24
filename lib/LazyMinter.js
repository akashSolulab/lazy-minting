const {ethers} = require('ethers')

class LazyMinter {
    constructor({contract, signer}) {
        this.contract = contract
        this.signer = signer
    }

    async createVoucher(tokenId, minPrice, uri) {
        const voucher = {tokenId, minPrice, uri}

        const domain = {    
            name: "LazyNFT-Voucher",
            version: "1",
            verifyingContract: this.contract.address,
            chainId: 4
        }
        
        const types = {
            NFTVoucher: [
                {name: "tokenId", type: "uint256"},
                {name: "minPrice", type: "uint256"},
                {name: "uri", type: "string"}
            ]
        }
        
        const signature = await this.signer._signTypedData(domain, types, voucher)
        
        console.log(signature);
        return {
            ...voucher,
            signature
        }
    }
}

module.exports = {
    LazyMinter
}