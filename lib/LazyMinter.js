const {ethers} = require('ethers')

const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
const SIGNING_DOMAIN_VERSION = "1"

class LazyMinter {
    constructor({contract, signer}) {
        this.contract = contract
        this.signer = signer
    }

    async createVoucher(tokenId, minPrice, uri) {
        const voucher = {tokenId, minPrice, uri}
        // const domain = this._signDomain()
        // let getDomain = await domain;
        // console.log("domain: ", getDomain);

        const domain = {    
            name: "LazyNFT-Voucher",
            version: "1",
            verifyingContract: this.contract.address,
            chainId: 4
        }
        console.log("contract address: ", domain.verifyingContract);
        const types = {
            NFTVoucher: [
                {name: "tokenId", type: "uint256"},
                {name: "minPrice", type: "uint256"},
                {name: "uri", type: "string"}
            ]
        }
        // console.log("types: ", types);
        const signature = await this.signer._signTypedData(domain, types, voucher)
        // console.log(this.signer);
        console.log(signature);
        return {
            ...voucher,
            signature
        }
    }

    // async _signDomain() {
        
    //     if(this._domain != null) {
    //         return this._domain
    //     }
    //     const chainId = await this.contract.getChainID()
    //     console.log("chainId: ", chainId.toString());
    //     this._domain = {
    //         name: SIGNING_DOMAIN_NAME,
    //         version: SIGNING_DOMAIN_VERSION,
    //         // verifyingContract: this.contract.address,
    //         // chainId,
    //     }
    //     return this._domain
    // }
}

module.exports = {
    LazyMinter
}