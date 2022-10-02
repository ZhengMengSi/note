Function.prototype.customBind = function (context, ...bindArgs) {
    const self = this

    return function (...args) {
        const newArgs = bindArgs.concat(args)
        console.log(self)
        return self.apply(context, newArgs)
    }
}

function fn(a, b, c) {
    console.info(this,a,b,c)
}

const fn1 = fn.customBind({x: 100}, 10)
fn1(20,30)

