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
let example = setPromise(10)
console.log(example);
example.then(function (value) {
   console.log(value);  
});
//runTrigger();


async function runTrigger() {
    let valueObjs = [];
    let valueObj;
    try {
        valueObj = await triggerPromise(setPromise(10));
        valueObjs.push(valueObj);
        valueObj = await triggerPromise(setPromise(9));
        valueObjs.push(valueObj);
        valueObj = await triggerPromise(setPromise(8));
        valueObjs.push(valueObj);
        valueObj = await triggerPromise(setPromise(7));
        valueObjs.push(valueObj);
        valueObj = await triggerPromise(setPromise(6));
        valueObjs.push(valueObj);
        valueObj = await triggerPromise(setPromise(5));
        valueObjs.push(valueObj);
    } catch (err) {
        console.log(err.message);
    }
    
}

function setPromise(value) {
    return async () => {
        console.log("first");
        return new Promise((resolve, reject) => {
            console.log("second");
            // some code here...
            if (isValidValue(value)) {
                resolve({ "text": value + " Bigger Then 5" });
                console.log(value + " Bigger Then 5");
            } else {
                reject(new Error(value + " Smaller then 5"));
                console.log(value + " Smaller then 5");
            }
        })
    }
}

// just to have something
function isValidValue(value) {
    if (value > 5)
        return true;
    return false;
}

// The actual promise
// function promise(value) {
//     return new Promise(function (resolve, reject) {
//         if (isValidValue(value)) {
//             resolve({ "text": value + " Bigger Then 5" });
//         } else {
//             reject(new Error(value + " Smaller then 5"));
//         }
//     });
// }
