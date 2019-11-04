const Blockchain = require('../blockchain');
//const walletAddress = require('../blockchain/block');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });

console.log('first block', blockchain.chain[blockchain.chain.length-1]);

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

for (let i=0; i<20; i++){
    prevTimestamp = blockchain.chain[blockchain.chain.length -1].timestamp;

    blockchain.addBlock({ data: `block ${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length-1];

    nextTimestamp = nextBlock.timestamp; 
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num) => (total + num))/times.length;

    console.log(`Time to mine block ${i}: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average Time: ${average}ms`);
    console.log(`Block: ${i}`, blockchain.chain[blockchain.chain.length-1]);
    //console.log(blockchain.chain[hash]);
}