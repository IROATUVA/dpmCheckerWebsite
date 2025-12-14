# IRO Dues Payment & DPM Verification/Reimbursement System
A complete system for managing membership dues payments and verifying Dues-Paying Member (DPM) status for IRO/Giving Access to Reimbursement System
Created by Anirudh Chinthakindi (IRO Treasurer 2026)

## Table of Contents
- [Overview](#overview)
- [Components](#components)
- [Setup Instructions](#setup-instructions)
  - [1. DPM Checker Setup](#1-dpm-checker-setup)
  - [2. Google Apps Script Configuration](#2-google-apps-script-configuration)
- [Google Sheet Structure](#google-sheet-structure)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## Overview
This system consists of two main components:
1. **Dues Payment Page** - Allows members to pay dues via Venmo with pre-filled payment information
2. **DPM Verification Page** - Validates member payment status against a Google Sheet database and Gives Access to Reimbursement Form

## Components
- `venmo_site_CodeBlock.html` - Venmo payment interface
- `dpmChecker_site_CodeBlock.html` - DPM status checker interface
- `dpmChecker.gs` - Google Apps Script for backend verification

## Setup Instructions
#### Configuration
The payment page is pre-configured with:
- **Venmo Account**: `@IROatUVA`
- **Payment Options**: 
  - $10 for one semester
  - $15 for two semesters
- **Payment Note Format**: `[Member Name] IRO Dues`

**To modify payment amounts or Venmo account:**
- Open `venmo_site_CodeBlock.html`
- Find the section with `data-amount` attributes
- Update the amounts and descriptions as needed
- Find `const venmoUsername = 'IROatUVA';`
- Update to your Venmo username

### 1. DPM Checker Setup
#### Prerequisites
Before setting up the DPM Checker, you need:
1. A Google Sheet with your DPM records (see [Google Sheet Structure](#google-sheet-structure))
2. A Google Form for reimbursements
3. Access to Google Apps Script

#### Step 1: Prepare Your Google Sheet
1. Create or open your DPM tracking Google Sheet
2. Ensure it follows this structure:

```
| Column A: Name on Venmo          | Column B: Actual Member Name (if applicable) |
|----------------------------------|---------------------------------------------|
| Anirudh Chinthakindi             |                                             |
| PP Designs                       | Peter Parker                                |
| Saehee Perez                     |                                             |
```

**Important Notes:**
- Row 1 should contain headers
- Data starts in Row 2
- Column A: The name as it appears on Venmo (required)
- Column B: The member's actual name if different from Venmo (optional)

3. Get your **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_SHEET_ID]/edit
   ```
   Copy the long string between `/d/` and `/edit`

4. Note your **Sheet Name** (visible at the bottom of the sheet, usually "Sheet1" or "Sheet")
### 2. Google Apps Script Configuration

#### Step 1: Create the Apps Script
1. Open your DPM Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete any existing code in the editor
4. Copy and paste the entire contents of `dpmChecker.gs`
5. **Update the following lines:**
```javascript
const SHEET_ID = 'YOUR_SHEET_ID_HERE';  // Replace with your Sheet ID from Step 2
const SHEET_NAME = 'Sheet';             // Replace with your actual sheet name
```

6. Click **Save** (disk icon) and name your project (e.g., "IRO DPM Checker")
#### Step 2: Deploy the Apps Script
1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure the deployment:
   - **Description**: "IRO DPM Verification API" (or similar)
   - **Execute as**: Select **"Me"** (your email)
   - **Who has access**: Select **"Anyone"**
5. Click **Deploy**
6. **Authorize the script:**
   - Click **"Authorize access"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"**
7. **Copy the Web app URL** - You'll need this in the next step!
   - It will look like: `https://script.google.com/macros/s/[LONG_STRING]/exec`

#### Step 3: Configure the DPM Checker HTML
1. Open `dpmChecker_site_CodeBlock.html`
2. Find line 262 (or search for `const SCRIPT_URL`):
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web app URL you copied
4. Find line 181 (or search for `href="YOUR_GOOGLE_FORM_URL_HERE"`):
   ```html
   <a href="YOUR_GOOGLE_FORM_URL_HERE" target="_blank" class="reimbursement-button">
   ```
5. Replace `YOUR_GOOGLE_FORM_URL_HERE` with your reimbursement Google Form URL for that semester

## Google Sheet Structure
### Required Format
Your Google Sheet **must** follow this exact structure:
#### Row 1 (Headers):
```
| Name on Venmo | Actual Member Name (if applicable) |
```

#### Data Rows (Starting from Row 2):
**Example 1: Venmo name matches real name**
```
| Anirudh Chinthakindi |  |
```
- Column A: Full name as shown on Venmo
- Column B: Leave blank

**Example 2: Venmo name differs from real name**
```
| PP Designs | Peter Parker |
```
- Column A: Display name or company name on Venmo
- Column B: Member's actual full name

**Example 3: Alternative payment method**
```
| Saehee Perez |  |
```
- Column A: Member's full name (since they paid via alternative method)
- Column B: Leave blank

**Refer to **"DPM List S26"** for an actual example.

### Important Notes:
- **Column A is required** for every member
- **Column B is optional** - only fill if Venmo name differs from actual name
- **Names must match exactly** - the system is case-insensitive but spelling matters
- **No empty rows** - keep all data contiguous starting from Row 2
- **Keep it updated** - Add new members immediately after payment confirmation

## Maintenance
### Updating Each Semester
#### 1. Update Reimbursement Form Link
**Every semester**, you must update the reimbursement form link:
1. Create a new Google Form for the semester's reimbursements
2. Get the form's shareable link
3. Open `dpmChecker_site_CodeBlock.html` in your editor
4. Find:
   ```html
   <a href="YOUR_GOOGLE_FORM_URL_HERE" target="_blank" class="reimbursement-button">
   ```
5. Replace with the new form URL
6. Update the Code Block in Squarespace with the modified HTML
7. Publish changes

#### 2. Clear/Archive Previous Semester's Data
At the start of each semester:
- Duplicate your current sheet (Right-click sheet tab → Duplicate)
- Rename the duplicate for the new semester
- Update the data, based on actual members for this semester
- Update the `SHEET_NAME` in your Google Apps Script
- Redeploy the script (Deploy → Manage deployments → Edit → New version)

## Troubleshooting
### DPM Checker Issues
**"Not Found" errors when member should be listed:**
1. Check spelling in the Google Sheet - must match exactly
2. Verify the member entered their name correctly
3. Check that data is in the correct columns (A and B)
4. Ensure no extra spaces in the sheet
5. Verify the Apps Script is deployed and accessible to "Anyone"

**Script errors or blank responses:**
1. Check the Apps Script logs:
   - Open Apps Script editor
   - Click **Executions** (clock icon)
   - Look for error messages
2. Verify the `SHEET_ID` and `SHEET_NAME` are correct
3. Re-authorize the script if needed
4. Ensure the sheet has data starting in Row 2

**Changes to sheet not reflecting:**
- Changes appear immediately - no need to redeploy
- If issues persist, check script execution logs for errors
- Clear browser cache and try again

### Venmo Payment Issues
**Venmo app not opening:**
- The page tries to open the Venmo app, then falls back to web
- On desktop, it will always use the web version
- On mobile, ensure Venmo app is installed
- Some browsers may block the automatic redirect, so the user should allow

**Payment amounts or description wrong:**
- Verify the HTML code hasn't been modified
- Check that the `venmoUsername` variable is set to `IROatUVA`
- Ensure payment amounts in `data-amount` attributes are correct

This project was created by Anirudh Chinthakindi as the Treasurer of the International Relations Organization at the University of Virginia for 2026.
---

**Last Updated**: December 2025 
**Maintained By**: IRO Treasurer
