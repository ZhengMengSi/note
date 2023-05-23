var {
    getFinancialIndicatorList: financialIndicatorList,
    getAlertSettingsList: alertSettingList,
} = require('./test')

/* var res = alertSettingList.data.alertSettingsDtos.map(item => item.objType)
console.log(res.length);
console.log(res); */

var res = financialIndicatorList.data.map(item => item.fiName)
console.log(res.length);
console.log(res);