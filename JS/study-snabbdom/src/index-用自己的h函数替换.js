import h from './mysnabbdom/h'
import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    // h,
} from "snabbdom";

const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

var myVnode1 = h('div', {}, [
    h('p', {}, '11'),
    h('p', {}, [
        h('span', {}, 'A')
    ]),
    h('p', {}, h('span', {}, 'A')),
]);

const myVnode3 = h('ul', {}, [
    h('li', {},'苹果'),
    h('li', {},[
        h('div', {},[
            h('p', {},'经济'),
            h('p', {}, h('span', {},'经济')),
        ])
    ]),
])

console.log(myVnode3);
var container = document.getElementById('container');
patch(container, myVnode3);



