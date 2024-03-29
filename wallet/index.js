const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } =require('../util');

class Wallet {
    
    constructor () {
        this.balance = STARTING_BALANCE;
        
        this.keyPair = ec.genKeyPair();
 
        this.publicKey = this.keyPair.getPublic().encode('hex');

    }
    
 
    sign(data) {
        return this.keyPair.sign(cryptoHash(data))
    }
 
    createTransaction({ recipient, amount, chain }) {
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
        }
 
        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }
 
        return new Transaction({ senderWallet: this, recipient, amount });
    }
 
    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputTotal = 0;
 
        for (let i=chain.length-1; i>0 ; i--) {
            const block = chain[i];
 
            for (let transaction of block.data) {
                if (transaction.input.address === address){
                    hasConductedTransaction = true;
                }
 
                const addressOutput = transaction.outputMap[address];
 
                if (addressOutput) {
                    outputTotal = outputTotal + addressOutput;
                }
            }
 
            if (hasConductedTransaction){
                break;
            }
        }
        let BC = hasConductedTransaction ? outputTotal : STARTING_BALANCE + outputTotal;
        
        return BC;
    }
 

};
 
const walletAddress = Wallet.calculateBalance({chain: this, address: this});
module.exports = { WA: walletAddress,
                    W: Wallet }  ;
// wallet1.calculateBalance({chain:this.chain, address:this.address});


//exports.walletAddress = wallet1.address;


// calculateBalance({chain: this.chain , address: this.address});


//console.log(Wallet.calculateBalance({ chain: this.chain, address: this.address}));