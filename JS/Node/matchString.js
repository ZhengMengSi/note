// 1.读取文件
// 2.遍历字符
// 3.生成表格

const fs = require('fs');
const XLSX = require('xlsx');
const mysql= require('mysql');

/**
 * 匹配两个文件中的字符串
 * @param {string} filename1 基础文件
 * @param {string} filename2 匹配文件
 * @param {'excel'|'csv'|'sql'} [format] 导出格式
 * @param {string} [exportName] 导出文件名
 */
function matchString(filename1, filename2, format = 'excel', exportName = '中日语') {
  fs.readFile(filename1, 'utf8', (err, chData) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readFile(filename2, 'utf8', (err, jaData) => {
      let chMap = splitString(chData)
      let jaMap = splitString((jaData))

      if (format === 'csv') {
        let str = ',中文,英文';
        for (let [key, value] of chMap) {
          let jaValue = jaMap.get(key) || ''
          str += `${key},${value},${jaValue}\n`
        }
        fs.writeFile(`${exportName}.csv`, str, function (p) {
          console.log(p);
        })
      } else if (format === 'excel') {
        let arr = [['','中文','日语']];
        for (let [key, value] of chMap) {
          let jaValue = jaMap.get(key) || ''
          arr.push([key, value, jaValue])
        }

        const worksheet = XLSX.utils.aoa_to_sheet(arr);
        // 新建一个工作簿
        const workbook = XLSX.utils.book_new();//创建虚拟workbook
        /* 将工作表添加到工作簿,生成xlsx文件(book,sheet数据,sheet命名)*/
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        /* 输出工作表， 由文件名决定的输出格式(book,xlsx文件名称)*/
        XLSX.writeFile(workbook, `${exportName}.xlsx`);
      } else if (format === 'sql') {
        let str = 'insert into chandja(`key`, `ch`, `js`) values ';
        for (let [key, value] of chMap) {
          let jaValue = jaMap.get(key) || '';
          str += `("${key}","${value}","${jaValue}"),`
        }
        str = str.substring(0, str.length - 1)
        str += ';'

        const connection = mysql.createConnection({
          host: 'localhost',
          port:3306,
          user: 'root',
          password: 'root',
        });
        connection.connect();
        connection.query('use dbtest2;')
        connection.query(str, (err, res) => {

          if(err) {

            console.log(err)

            return

          }

          // console.log(res)

        })
        connection.end();
      }
    });
  });
}

function splitString(str) {
  // 以回车和换行来分割字符串
  let arr = str.split('\n')
  let arr2 = arr.filter(item => item.includes('='))
  let arr3 = arr2.map(item => item.split('='))
  // 去除了重复
  let arr4 = new Map(arr3)
  return arr4;
}

matchString('i18n-去重-忽略大小写.properties', 'i18n_ja.properties', 'sql', '中日语')
