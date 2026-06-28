/**
 * Perfect Pet House — ตัวรับคะแนนแบบทดสอบ บันทึกลง Google Sheet
 *
 * วางโค้ดนี้ใน Apps Script ของ Google Sheet ที่ต้องการเก็บคะแนน
 * (Extensions → Apps Script) แล้ว Deploy เป็น Web app
 *
 * ดูขั้นตอนละเอียดในไฟล์: วิธีต่อ-google-sheet.md
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // กันการเขียนชนกันเมื่อหลายคนส่งพร้อมกัน
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('คะแนน');
    if (!sheet) {
      sheet = ss.insertSheet('คะแนน');
    }
    // ใส่หัวตารางถ้ายังว่าง
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['เวลาที่ทำ', 'ชื่อ', 'คะแนน', 'เต็ม', 'เปอร์เซ็นต์', 'ผลลัพธ์', 'คำตอบข้อเขียน (ข้อ 15)']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      d.name || '',
      d.score,
      d.total,
      d.percent + '%',
      d.result || '',
      d.written || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ทดสอบว่า Web app ทำงาน (เปิด URL ในเบราว์เซอร์จะเห็นข้อความนี้)
function doGet() {
  return ContentService.createTextOutput('Perfect Pet House quiz endpoint is running ✓');
}
