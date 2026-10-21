/**
 * Declaring Our Tech Futures — "Add your voice" form → Google Sheet.
 *
 * Setup (once):
 *  1. Put the target sheet's ID in SPREADSHEET_ID below.
 *  2. Create an Apps Script project (script.google.com or the sheet's Extensions → Apps Script),
 *     replace the editor's contents with this file and save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me      Who has access: Anyone
 *     Authorize when prompted, then copy the Web app URL (ends in /exec).
 *  4. Paste that URL into FORM_ENDPOINT at the top of main.js, commit and push.
 *
 * After editing this script later, use Deploy → Manage deployments → Edit → Version: New version,
 * so the same /exec URL keeps working.
 */

// The "Email Collection Spreadsheet" this script writes to (the long ID in its URL).
var SPREADSHEET_ID = '1qwcY3zwJ74Cq_CgBbp6gvyhz5Kg_x_qP1V4EWIaOLZc';
var SHEET_NAME = 'Submissions';
var HEADERS = ['Timestamp', 'Name', 'Email', 'Organization', 'Message', 'Wants updates', 'Page'];

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Honeypot: real visitors never see or fill the "website" field; bots usually do.
  if (p.website) return json_({ ok: true });

  var name = clean_(p.name, 200);
  var email = clean_(p.email, 320);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json_({ ok: false, error: 'invalid' });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    sheet.appendRow([
      new Date(),
      name,
      email,
      clean_(p.org, 300),
      clean_(p.message, 5000),
      p.updates === 'yes' ? 'Yes' : 'No',
      clean_(p.page, 500)
    ]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

// Lets you open the /exec URL in a browser to confirm the deployment is live.
function doGet() {
  return json_({ ok: true, service: 'dotf-form' });
}

// Trim, cap length, and stop spreadsheet formula injection (values starting with = + - @).
function clean_(v, max) {
  v = String(v == null ? '' : v).trim().slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
