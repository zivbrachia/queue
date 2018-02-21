'use strict'

const Queue2 = require('./queue2.js');
let queue2 = new Queue2(5).runQueue();

queue2.add(setPromise(5));
queue2.add(setPromise2(4));
queue2.add(setPromise(3));
queue2.add(setPromise2(2));
queue2.add(setPromise(1));

function setPromise(value) {
    return () => {
        return new Promise((resolve, reject) => {
            // some code here...
            setTimeout(() => {
                writeSuccess(value);
                resolve({ "text": value + " " + "setPromise1" });
            }, value * 1000);
        });
    }
}

function setPromise2(value) {
    return () => {
        return new Promise((resolve, reject) => {
            // some code here...
            let err = new Error(value + " stPromise2");
            writeFailure(value);
            reject(err);
        });
    }
}

function writeSuccess(value) {
    console.log(Date.now() + " success " + value);
}

function writeFailure(value) {
    console.log(Date.now() + " failure " + value)

}