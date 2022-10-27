module.exports = {
    // 继承eslit规则
    extends: ['eslint:recommended'],
    env: {
        node: true, // 启用node中的全局变量
        browser: true // 启用浏览器中全局变量
    },
    parserOptions: {
        ecmaVersion: 6, // es6
        sourceType: "module" // es module
    },
    rules: {
        'no-var': 2, // 不能使用var定义变量
    },
    // plugins: ["import"], // 解决动态导入语法报错
}
