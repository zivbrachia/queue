'use strict'

let express = require('express');
let bodyParser = require("body-parser");
let router = express.Router();

const ActionToQueue = require("action_to_queue.js");
const Queue = require('queue.js');
let queue = new Queue(5).runQueue();

router.use(bodyParser.json());

router.get('/stop', function (req, res) {
    queue.stopQueue();
    res.json({"message" : "Queue stopped"});
});

router.get('/stop/:subQueueId', function (req, res) {
    queue.stopSubQueue(req.params.subQueueId);
    res.json({"message" : "Sub Queue " +  req.params.subQueueId + " stopped"});
});

router.get('/start', function (req, res) {
    queue.runQueue();
    res.json({"message" : "Queue started"});
});

router.get('/:subQueueId', function (req, res) {
    res.json("TODO");
});

router.post('/', function (req, res) {
    let data = req.body;
    Promise.resolve().then(function () {
        queue.resetSubQueueCounter(subQueueId);
        delete ActionToQueue.ActionsResult[subQueueId];

        let asyncAction = new ActionToQueue(subQueueId);
        // insert to queue the async object, sub queue id and the callback to activate after async object returned
        queue.add(asyncAction, subQueueId, ActionToQueue.callbackQueueHandler);
    });
    res.json("building");
    }).catch(function (err) {
        res.json({"error":err);
    });
});

module.exports = router;
