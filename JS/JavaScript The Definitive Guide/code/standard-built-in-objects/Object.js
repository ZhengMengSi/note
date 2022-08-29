Object;
Object.prototype;
Object.prototype.constructor;

let a = {
    x: {
        y: 1
    }
}
let b = Object.entries(a)
// Object.freeze(a)

a.x = 1;
Object.defineProperty(a, 'x', {
    value: 2
})
console.log(a)

console.log(1);
