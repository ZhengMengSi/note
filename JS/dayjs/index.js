const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
let data = '2021-02'
dayjs.extend(isBetween)
console.log(dayjs(data).isBetween('2021-02', '2021-02', null, '[]'));