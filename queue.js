'use strict'

class Queue {
    constructor(maxConcurrent, maxQueue) {
        this.pending = [];
        this.processing = 0;
        this.maxQueue = maxQueue || Infinity;
        this.maxConcurrent = maxConcurrent || Infinity;
        this.runningQueue = false;
        this.subQueuesCounter = {};
        this.subQueuesStop = new Set();
    }

    setCallback(callback) {
        this.callback = callback;
    }

    setRunningQueue(status) {
        if (this.runningQueue !== status) {
            this.runningQueue = status;
        }
    }

    stopQueue() {
        this.setRunningQueue(false);
        return this;
    }

    stopSubQueue(subQueueId) {
        this.subQueuesStop.add(subQueueId);
        return this;
    }

    runQueue() {
        this.setRunningQueue(true);
        this.deQueue();
        return this;
    }

    resetSubQueueCounter(subQueueId) {
        delete this.subQueuesCounter[subQueueId];
    }

    incrementSubQueueCounter(subQueueId) {
        if (typeof this.subQueuesCounter[subQueueId] === "undefined") {
            this.subQueuesCounter[subQueueId] = 0;    
        }
        this.subQueuesCounter[subQueueId] = this.subQueuesCounter[subQueueId] + 1;
        return this.subQueuesCounter[subQueueId];
    }

    decrementSubQueueCounter(subQueueId) {
        if ((typeof subQueueId === "undefined") || (typeof this.subQueuesCounter[subQueueId] === "undefined")) {
            return 0;
        }
        if (this.subQueuesCounter[subQueueId] === 0) {
            this.resetSubQueueCounter(subQueueId);
            return 0;
        }    

        this.subQueuesCounter[subQueueId] = this.subQueuesCounter[subQueueId] - 1;

        if (this.subQueuesCounter[subQueueId] === 0) {
            this.resetSubQueueCounter(subQueueId);
            return 0;
        }
        return this.subQueuesCounter[subQueueId];
    }

    getSubQueueCounter(subQueueId) {
        if ((typeof subQueueId === "undefined") || (typeof this.subQueuesCounter[subQueueId] === "undefined")) {
            return 0;
        }
        return this.subQueuesCounter[subQueueId];
    }

    add(item, subQueueId, callbackHandler) {
        if (this.pending.length < this.maxQueue) {
            let queueItem = {
                "async": item,
                "callback": callbackHandler,
                "subQueueId": subQueueId
            };
            this.pending.push(queueItem);
            if (subQueueId) {
                this.incrementSubQueueCounter(subQueueId);
            }
        } else {
            throw new Error("Queue limit reached");
        }
        if (this.runningQueue === true) {
            this.runQueue();
        }
        return this;
    }

    deQueue() {
        let self = this;
        if (this.runningQueue === false) {
            return false;
        }

        if (this.processing >= this.maxConcurrent) {
            return false;
        }

        let queueItem = this.pending.shift();
        if (!queueItem) {
            return false;
        }

        if (this.subQueuesStop.has(queueItem.subQueueId)) {
            let subQueueCounter = this.decrementSubQueueCounter(queueItem.subQueueId);
            if (subQueueCounter === 0) {
                this.subQueuesStop.delete(queueItem.subQueueId);
            }
            this.deQueue();
            return false;
        }

        this.processing = (this.processing + 1);
        
        queueItem.async.then(function (result) {
            self.processing = (self.processing - 1);  // main queue
            let subQueueCounter = self.decrementSubQueueCounter(queueItem.subQueueId);
            if (queueItem.callback) {
                Promise.resolve()
                    .then(function () {
                        queueItem.callback(result, subQueueCounter);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
            self.deQueue();
        });
    }
}

module.exports = Queue;
