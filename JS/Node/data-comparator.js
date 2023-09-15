let xlsx = require('node-xlsx').default;

let excelNames = [
    "管理报表-Managerial P&L.xlsx",
    // "管理报表-Managerial P&L-Admin.xlsx",
    // "管理报表-Managerial P&L-BJ.xlsx",
    // "管理报表-Managerial P&L-CD.xlsx",
    // "管理报表-Managerial P&L-CQ.xlsx",
    // "管理报表-Managerial P&L-NJ.xlsx",
    // "管理报表-Managerial P&L-SHGG.xlsx",
    // "管理报表-Managerial P&L-SHJA Kerry.xlsx",
    // "管理报表-Managerial P&L-SZ.xlsx",
    // "管理报表-Managerial P&L-TMALL.xlsx",
    // "管理报表-Managerial P&L-WH.xlsx",
]

function dataComparator() {
    excelNames.map(item => {
        // 工作表
        const workSheets1 = xlsx.parse(`./e1/${item}`);
        const workSheets1Data = workSheets1[0].data.filter(item => item.length);
        const workSheets2 = xlsx.parse(`./e2/${item}`);
        const workSheets2Data = workSheets2[0].data.filter(item => item.length);
        let dataMap2 = {}
        workSheets2Data.forEach(item => dataMap2[item[1]] = item);

        // 表1和表2存在的不同，以表1为准
        let diff = workSheets1Data.filter(item => {
            let [subject, rowIndex, date1, date2, date3, date4, ytd] = item;
            if (!dataMap2[rowIndex]) {
                return true;
            }
            let [Csubject, CrowIndex, Cdate3, Cdate4, Cytd] = dataMap2[rowIndex];
            if (subject !== Csubject || date3 !== Cdate3 || date4 !== Cdate4 || ytd !== Cytd) {
                return true;
            }
            return false;
        })
        console.log(diff);
    });
}

dataComparator();








