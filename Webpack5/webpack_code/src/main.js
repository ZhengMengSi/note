// import "core-js"; // 完整引入
// import "core-js/es/promise";
import count from "./js/count";
import sum from "./js/sum";
// import {square} from "./js/math";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./stylus/index.styl";
import "./css/iconfont.css";

const result = count(2, 7);
console.log(result);
console.log(sum(1,2,3,4, 6));
// console.log(square(1))

document.getElementById('btn').onclick = function () {
    // eslint不识别import()，需要在.eslitrc.js中做额外配置
    import(/*webpackChunkName: "math"*/ './js/math').then((res) => {
        console.log(res);
        let {square} = res;
        console.log(square(2))
    })
};

if (module.hot) {
    module.hot.accept("./js/count");
    module.hot.accept("./js/sum");
}

new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, 1000)
})

const arr = [1,2,3,4]
console.log(arr.includes(1))

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
