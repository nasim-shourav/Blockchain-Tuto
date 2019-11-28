const redis = require('redis');


const Blockchain = require('../blockchain');
const { MIN_BALANCE } = require('../config')
const Wallet = require('../wallet');


const bchain = new Blockchain();
const wallet = new Wallet.W();

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};


console.log("From pubsub.js:", wallet.publicKey)
class PubSub{
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();

        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }


    handleMessage(channel, message) {

    // if ( bal > MIN_BALANCE){

    //     }
        const bal = Wallet.W.calculateBalance({ chain: bchain.chain, address: wallet.publicKey });
        console.log(`Message received. Channel: ${channel}. Message: . and balance is ${bal}`);

            const parsedMessage = JSON.parse(message);

            switch(channel) {
                case CHANNELS.BLOCKCHAIN:
                    this.blockchain.replaceChain(parsedMessage, true, () => {
                        this.transactionPool.clearBlockchainTransactions({
                            chain: parsedMessage
                        });
                    });
                    break;
                case CHANNELS.TRANSACTION:
                    this.transactionPool.setTransaction(parsedMessage);
                    break;
                default:
                    return;
            }

    }

    subscribeToChannels(){


        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {


        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain() {

        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction){

        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

// const testPubSub = new PubSub();

// setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'fooooooooo'), 1000);

module.exports = PubSub;
