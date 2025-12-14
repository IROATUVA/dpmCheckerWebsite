function doGet(e) {
  // Get the Google Sheet - REPLACE 'YOUR_SHEET_ID' with your actual Sheet ID (the long string between /d/ and /edit)
  const SHEET_ID = 'YOUR_SHEET_ID';
  const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name
  
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  // Get parameters from the request
  const venmoName = e.parameter.venmoName || '';
  const fullName = e.parameter.fullName || '';
  
  // Get all data starting from row 2 (skip header)
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  
  // Search for matching record
  let found = false;
  let displayName = '';
  
  for (let i = 0; i < data.length; i++) {
    const sheetVenmoName = data[i][0].toString().trim();
    const sheetFullName = data[i][1].toString().trim();
    
    // Check if Venmo name matches (case-insensitive)
    if (sheetVenmoName.toLowerCase() === venmoName.toLowerCase()) {
      // If full name is provided, check if it matches
      if (fullName) {
        if (sheetFullName && sheetFullName.toLowerCase() === fullName.toLowerCase()) {
          found = true;
          displayName = sheetFullName || sheetVenmoName;
          break;
        }
      } else {
        // No full name provided, just match on Venmo name
        found = true;
        displayName = sheetFullName || sheetVenmoName;
        break;
      }
    }
  }
  
  // Return JSON response
  const response = {
    found: found,
    displayName: displayName
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
