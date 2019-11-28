const hexToBinary = require ('hex-to-binary');
const { GENESIS_DATA, MINE_RATE, THRESHOLD_BALANCE } = require('../config'); 
const { cryptoHash } = require('../util');
const  Wallet = require('../wallet');
const Blockchain = require('./blockchain');

const blockchain = new Blockchain();
const wallet = new Wallet.W();

class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }){
         this.timestamp = timestamp;
         this.lastHash = lastHash;
         this.hash = hash;
         this.data = data;
         this.nonce = nonce;
         this.difficulty = difficulty;
    }

    static genesis(){
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }){
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;   
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty));

        return new this({ timestamp, lastHash, data, difficulty, nonce, hash });
    }

   
    static adjustDifficulty({ originalBlock,timestamp }) {
        const { difficulty } = originalBlock;
        const walletBalace = Wallet.W.calculateBalance({chain: blockchain.chain, address: wallet.publicKey});
        
        if (difficulty < 1) return 1;

        //if ((timestamp - originalBlock.timestamp) > MINE_RATE ) return difficulty - 1;

        //return difficulty + 1;
        
        
        // if (difficulty < 1 ) return 1;
    
        if ((timestamp - originalBlock.timestamp) > MINE_RATE ) {
            if ( walletBalace < THRESHOLD_BALANCE ){
                return difficulty + 1 ;
            } else { 
                return difficulty -1 ; 
            }    
        } else {
            return difficulty + 1;
        }
    
    
        
    }


}


module.exports = Block;







