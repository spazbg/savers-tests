# Savers Test

Savers Test is a Google Chrome extension that allows users (mainly QAs and DEVs) to easily copy and paste 'acs_ngn' cookies between Savers UAT and PR environments. 
The extension also provides a simple way to clear the 'acs_ngn' cookie. 
Additionally, it supports importing and applying codes to the Savers app.

![](savers-test.gif)


## Features

- Copy and show the 'acs_ngn' and 'cpn' cookies from the active tab
- Paste the 'acs_ngn' cookie onto the active tab
- Clear the 'acs_ngn' cookie on the active tab
- Import list of codes and apply them


## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top right corner of the page.
4. Click the "Load unpacked" button and select the directory containing the cloned or downloaded repository.
5. The extension should now be installed and ready for use. You can access it by clicking on the extension icon in the top right corner of your browser.

## Usage

1. Click the extension icon to open the popup.
2. Use the "Copy Cookie" button to copy the 'acs_ngn' and 'cpn' cookies from the current tab (UAT env).
3. Navigate to a different tab (PR env) and use the "Paste Cookie" button to apply the 'acs_ngn' cookie.
4. To clear the 'acs_ngn' cookie on the current tab, use the "Clear Cookie" button.
5. To import codes, paste them into the "Import Codes" text area and click "Submit Codes".
6. To apply a code from the imported list, click the "Bank Code" button.