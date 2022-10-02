import vnode from './vnode';

// 忽略了源码中的重载功能
// 调用必须是以下形态之一：
// 形态1：h('div', {}, '文字')
// 形态2：h('div', {}, [])
// 形态3：h('div', {}, h())
export default function (sel, data, c) {
    // 检查参数个数
    if (arguments.length != 3) {
        throw new Error('对不起，h函数只能传入三个参数');
    }
    // 检查参数c的类型
    if (typeof c == 'string' || typeof c == 'number') {
        // 说明现在调用h函数是形态1
        return vnode(sel, data, undefined, c, undefined);
    } else if (Array.isArray(c)) {
        let children = [];
        // 说明现在调用h函数是形态2
        for (let i = 0; i < c.length; i++) {
            // 检查c[i]必须是一个对象
            if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel'))) {
                throw new Error('传入的数组参数第三个参数类型不对');
            }
            children.push(c[i]);
        }
        // 循环结束，就说明children收集结束
        return vnode(sel, data, children, undefined, undefined);
    } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
        // 说明现在调用h函数是形态3
        // 传入的c是唯一的children
        let children = [c];
        return vnode(sel, data, children, undefined, undefined);
    } else {
        throw new Error('传入的第三个参数类型不对');
    }
}

