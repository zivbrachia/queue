'use strict'

// trigger the promise when you want and not when you create it
async function triggerPromise(promiseCallback) {
    try {
        let valueObj = await promiseCallback();
        return valueObj;
    } catch (err) {
        throw err;
    }
}
// send promise callback argument with specific parameters
let value = 5;
triggerPromise(async () => {
    try {
        let valueObj = await promise(value);
        resolve(valueObj);
    } catch (err) {
        reject(err);
    }
});

// just to have something
function isValidValue(value) {
    if (value > 5)
        return true;
    return false;
}

// The actual promise
function promise(value) {
    return new Promise(function (resolve, reject) {
        if (isValidValue(value)) {
            resolve({ "text": value + " Bigger Then 5" });
        } else {
            reject(new Error(value + " Smaller then 5"));
        }
    });
}

// resolve catcher
function resolve(valueObj) {
    console.log(valueObj);
}

// reject catcher
function reject(err) {
    console.log(err.message);
}
