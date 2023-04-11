const dayjs = require('dayjs')
let data = '2020-02-01T00:00:00.000+0800'
console.log(dayjs(data.slice(0, 10)).format('YYYY-M'));