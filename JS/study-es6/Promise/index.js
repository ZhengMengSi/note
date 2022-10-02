// console.log(Promise)
// console.log(typeof Promise)

// const promise = new Promise(function (resolve, reject) {
//     console.log(resolve)
//     console.log(reject)
// })
//
// promise.then(function (value) {
//
// }, function (error) {
//
// })

// function timeout(ms) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve, ms, 'done')
//     })
// }
//
// timeout(100).then((value) => {
//     console.log(value)
// })

// Promise新建后就会立即执行
// let promise = new Promise(function (resolve, reject) {
//     console.log('Promise')
//     resolve()
// })
//
// promise.then(function () {
//     console.log('resolved.')
// })
//
// console.log('Hi!')

// 异步加载图片
/*function loadImageAsync(url) {
    return new Promise(function (resolve, reject) {
        const image = new Image()

        image.onload = function () {
            resolve(image)
        }

        image.onerror = function () {
            reject(new Error('Could not load image at ' + url))
        }

        image.src = url
    })
}*/

// Ajax
// const getJSON = function (url) {
//     const promise = new Promise(function (resolve, reject) {
//         const handler = function () {
//             // console.log(this) // 下面的client
//             if (this.readyState !== 4) {
//                 return;
//             }
//             if (this.status === 200) {
//                 resolve(this.response)
//             } else {
//                 reject(new Error(this.statusText))
//             }
//         }
//         const client = new XMLHttpRequest()
//         client.open('GET', url)
//         client.onreadystatechange = handler
//         client.responseType = 'json'
//         client.setRequestHeader('Accept', 'application/json')
//         client.send()
//     })
//
//     return promise
// }
//
// var p1 = getJSON('posts.json')
//
// var p2 = p1.then(function (json) {
//     console.log('Contents: ', json)
//     return getJSON(json.name)
// }, function (error) {
//     console.error('出错了', error)
// })
//
// var p3 = p2.then(function (tsconfig) {
//     console.log('resolved: ', tsconfig)
// }, function (err) {
//     console.log('rejected: ', err)
// })


// const p1 = new Promise(function (resolve, reject) {
//     setTimeout(() => reject(new Error('fail')), 3000)
// })
//
// // p2状态依赖p1，就在于resolve和reject函数参数
// const p2 = new Promise(function (resolve, reject) {
//     // setTimeout(() => resolve(p1), 1000)
//     resolve(p1)
// })
//
// const p3 = new Promise(function (resolve, reject) {
//     // setTimeout(() => resolve(p1), 1000)
//     resolve(p2)
// })
//
// p3
//     .then(result => console.log(result))
//     .catch(error => console.error(error))
// Error: fail



// function fetchX(param) {
//     console.log('接收参数：', param)
//     return new Promise(function (resolve, reject) {
//         setTimeout(function (param) {
//             resolve(param+param);
//         },3000, param)
//     })
// }
//
// var fetchA = fetchX('A')
//
// var fetchB = fetchA.then(function (res) {
//     console.log('fetchA得到的结果：',res)
//     return fetchX(res)
// })
//
// var fetchC = fetchB.then(function (res) {
//     console.log('fetchB得到的结果：',res)
//     // fetchC code...
// })

// fulfilled 链式调用
// Promise.resolve().then(() => {
//     console.log(0);
//     return Promise.resolve(4)
// }).then((res) => {
//     console.log(res);
// })
//
// Promise.resolve().then(() => {
//     console.log(1)
// }).then(() => {
//     console.log(2);
// }).then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(5);
// })


Promise.resolve().then(() => {
    console.log(1)
    return Promise.resolve()
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})

Promise.resolve().then(() => {
    console.log(10)
}).then(() => {
    console.log(20)
}).then(() => {
    console.log(30)
}).then(() => {
    console.log(40)
})


















