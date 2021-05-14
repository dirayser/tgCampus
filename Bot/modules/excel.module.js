'use strict';

const excel = require('exceljs');

class ExcelTable {

  constructor() {}

  async configureTable(ctx, groupList, cgID, userID, sendNeeded = true) { // creates and sends xlsx file
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Group List');
    worksheet.columns = getColumns(groupList);
    worksheet.addRows(getRows(groupList));
    await workbook.xlsx.writeFile(`${cgID}.xlsx`);
    ctx.telegram.sendDocument(userID, {
      source: `${cgID}.xlsx`,
      filename: 'list.xlsx',
    });
  }

  getColumns(groupList) { // gets columns for xlsx
    const student = groupList[0];
    const xlCols = student
      .map(arr => arr[0])
      .map(field => field.split('_').join(' '))
      .map((header, i) => (
        {
          header,
          key: header,
          width: i < 2  ? 20 : 10,
        }
      ));
    return xlCols;
  }

  getRows(groupList) { // gets rows for xlsx
    return groupList
      .map(array => array.map(pair => pair[1]));
  }

}


module.exports = ExcelTable;
