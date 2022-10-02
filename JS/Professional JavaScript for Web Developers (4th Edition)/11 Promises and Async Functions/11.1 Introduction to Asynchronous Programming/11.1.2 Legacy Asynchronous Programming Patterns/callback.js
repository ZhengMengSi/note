// function double(value, callback) {
//     setTimeout(() => callback(value * 2), 1000);
// }
//
// double(3, (x) => console.log(`I was given: ${x}`));

// 2.失败处理
/*function double(value, success, failure) {
    setTimeout(() => {
        try {
            if (typeof value !== 'number') {
                throw 'Must provide number as first argument';
            }
            success(2 * value);
        } catch (e) {
            failure(e);
        }
    }, 1000);
}

const successCallback = (x) => console.log(`Success: ${x}`);
const failureCallback = (e) => console.log(`Failure: ${e}`);

double(3, successCallback, failureCallback);
double('b', successCallback, failureCallback);*/

// 3.嵌套异步回调
function double(value, success, failure) {
    setTimeout(() => {
        try {
            if (typeof value !== 'number') {
                throw 'Must provide number as first argument';
            }
            success(2 * value);
        } catch (e) {
            failure(e);
        }
    }, 1000);
}

const successCallback = (x) => {
    double(x, (y) => console.log(`Success: ${y}`));
};
const failureCallback = (e) => console.log(`Failure: ${e}`);

double(3, successCallback, failureCallback);
double('b', successCallback, failureCallback);



