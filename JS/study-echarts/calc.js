var {
    getFinancialIndicatorList: financialIndicatorList,
    getAlertSettingsList: alertSettingList,
    getGroupList: groupList,
    profitLoss,
} = require('./test')

/* var res = alertSettingList.data.alertSettingsDtos.map(item => item.objType)
console.log(res.length);
console.log(res); */

/* var res = financialIndicatorList.data.map(item => item.fiName)
console.log(res.length);
console.log(res); */

/* var res = groupList.data.groupRelationDtos.map(item => `${item.id}-${item.name}`)
console.log(res.length);
console.log(res); */

var res = profitLoss.data.subjectBalanceList.map(
    item => `${item.cafDesciption}-${item.cafCode}-${item.sedidxProfitLossCategory}`
)
console.log(res.length);
console.log(res);