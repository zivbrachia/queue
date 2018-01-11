'use strict'

const fetch = require('node-fetch');
const path = require('path');

class ActionToQueue {
    constructor(subQueueId) {
        this.subQueueId = subQueueId;
    }

    buildAction() {
      return new Promise(function (resolve, reject) {
          resolve(this.subQueueId);
        });
    }
}

/**
 * actionsResult will map the results from "callbackQueueHandler" by sub queue id
 */
let actionsResult = {};

/**
 * this function will act as a callback function the queue will activate when each queue item will return with result.
 * @param {*} result - async result after queue use promise object
 * @param {*} subQueueCounter - integer, will show how much item is pending in queue for the same sub queue id
 */
function callbackQueueHandler(result, subQueueCounter) {
    if (subQueueCounter === 0) {
        console.log("end sub queue " + new Date());
    }
    actionsResult[result.production.domain_id].push(result);
}

module.exports = ActionToQueue;
module.exports.callbackQueueHandler = callbackQueueHandler;
module.exports.actionsResult = actionsResult
