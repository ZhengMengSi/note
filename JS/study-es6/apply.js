Function.prototype.myCall = function (context) {
    context.fn = this
    let args = [...arguments].slice(1)
    let r = context.fn(...args)
    delete context.fn
    return r
};

var a = 1, b = 2;
var obj ={a: 10,  b: 20}
function test(key1, key2){
    console.log(this[key1] + this[key2])
}
test('a', 'b') // 3
test.myCall(obj, 'a', 'b') // 30
