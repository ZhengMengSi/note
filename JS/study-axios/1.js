// 第一题
/*let a = 1
let b = {}
setTimeout(() => {
    a = 2
    b.b = 2
}, 100)

console.log(a)
console.log(b)

setTimeout(() => {
    console.log(a)
    console.log(b)
}, 500)*/

// 1 {} 2 {b:2}

// 第二题
// console.log([] == false)

// 第三题有把握

// 第四题
// var length = 10
//
// function test() {
//     // console.log(this)
//     console.log(this.length)
// }
//
// var obj = {
//     length: 5,
//     fun: function (fn) {
//         fn()
//         arguments[0]()
//     }
// }
//
// obj.fun(test, 1)

// 10 2


// console.log([1,2,3,4,5].map(item => item > 3))

// (async () => {
//     console.log(1);
//
//     setTimeout(() => {
//         console.log(2);
//     }, 0)
//
//     await new Promise((resolve, reject) => {
//         console.log(3);
//         // resolve()
//     }).then(() => {
//         console.log(4);
//     })
//
//     console.log(5);
// })()

// 1 3 4 5 2

function test(val) {
    this.num = val
}

var obj = {}

var bar = test.bind(obj)
bar(2)

console.log(obj.num)  // 2

var baz = new bar(3)
console.log(obj.num) // 2
console.log(baz.num) // 3

