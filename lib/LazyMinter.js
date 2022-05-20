const {ethers} = require('ethers')

const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
const SIGNING_DOMAIN_VERSION = "1"

class LazyMinter {
    constructor({contract, signer}) {
        this.contract = contract
        this.signer = signer
    }

    async createVoucher(tokenId, uri) {
        const voucher = {tokenId, uri}
        const domain = this._signDomain()
        const types = {
            NFTVoucher: [
                {name: "tokenId", type: "uint256"},
                {name: "uri", type: "string"}
            ]
        }
        const signature = await this.signer._signTypedData(domain, types, voucher)
        // console.log(this.signer);
        // console.log(signature);
        return {
            ...voucher,
            signature
        }
    }

    async _signDomain() {
        if(this._domain != null) {
            return this._domain
        }
        const chainId = await this.contract.getChainID()
        this._domain = {
            name: SIGNING_DOMAIN_NAME,
            version: SIGNING_DOMAIN_VERSION,
            verifyingContract: this.contract.address,
            chainId,
        }
        return this._domain
    }
}

module.exports = {
    LazyMinter
}