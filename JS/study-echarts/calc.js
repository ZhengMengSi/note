var {
    getFinancialIndicatorList: financialIndicatorList,
    getAlertSettingsList: alertSettingList,
    getGroupList: groupList,
} = require('./test')

/* var res = alertSettingList.data.alertSettingsDtos.map(item => item.objType)
console.log(res.length);
console.log(res); */

/* var res = financialIndicatorList.data.map(item => item.fiName)
console.log(res.length);
console.log(res); */

var res = groupList.data.groupRelationDtos.map(item => `${item.id}-${item.name}`)
console.log(res.length);
console.log(res);