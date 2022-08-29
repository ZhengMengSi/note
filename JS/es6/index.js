var obj = {};

function defineReactive(data, key, val) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get() {
            console.log('访问obj的a属性')
            return val;
        },
        set(v) {
            console.log('修改obj的a 属性', v)
            if (val === v) {
                return;
            }
            val = v
        }
    });
}

defineReactive(obj, 'a', 10)

console.log(obj.a)
obj.a = 9
console.log(obj.a)
