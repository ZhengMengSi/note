import {sum} from "./sum";
// import count from './count';

console.log('hello main')
console.log(sum(1,2,3,4))

let btn = document.getElementById('btn')
btn.onclick = function () {
    // console.log(count(2, 1))
    // import 动态导入：会将动态导入的文件代码分割（拆分成单独的模块），在使用的时候自动加载
    import('./count')
        .then((res) => {
            console.log('模块加载成功', res)
            console.log(res.default(2, 1))
        })
        .catch((err) => {
            console.log('模块加载失败', err)
        })
}
