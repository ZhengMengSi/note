import h from './mysnabbdom/h';
import patch from './mysnabbdom/patch'

const myVnode1 = h('ul', {}, [
    h('li', {}, 'a'),
    h('li', {}, 'b'),
    h('li', {}, 'c'),
    h('li', {}, 'd'),
]);

// const myVnode1 = h('ul', {}, '你好');

var container = document.getElementById('container');
var btn = document.getElementById('btn');
patch(container, myVnode1);

const myVnode2 = h('section', {}, [
    h('h1', {}, '我是新的h1'),
    h('h2', {}, '我是新的h2'),
])

btn.onclick = function () {
    patch(myVnode1, myVnode2);
};


