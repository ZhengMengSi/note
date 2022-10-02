class Foo {
    constructor(name) {
        this.name = name
        this.city = '北京'
    }

    getName() {
        return this.name
    }

}

function Foo1(name) {
    this.name = name
    this.city = '北京'
}
Foo.prototype.getName = function () {
    return this.name
}

const f = new Foo('张梦思')
console.log(f)

// console.log(typeof Foo)
// console.log(typeof Foo1)
console.log(typeof f)
