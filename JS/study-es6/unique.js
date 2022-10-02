// 一、利用 ES6 Set 去重（ES6 中最常用）
// function unique (arr) {
//     return Array.from(new Set(arr))
// }
// var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
// console.log(unique(arr))
//[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]

// 二、利用 for 嵌套 for，然后 splice 去重（ES5 中最常用）
function unique(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i+1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                arr.splice(j, 1)
                j--
            }
        }
    }
    return arr
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))





