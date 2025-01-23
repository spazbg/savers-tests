// Get the buttons and input field
const copyButton = document.getElementById('copy');
const pasteButton = document.getElementById('paste');
const clearButton = document.getElementById('clear');
const clearStorageButton = document.getElementById('clearStorage');
const importSacsNgnButton = document.getElementById('importSacsNgn');
const checkEntitlementButton = document.getElementById('checkEntitlement');
const sacsNgnInput = document.getElementById('sacsNgnInput');

// Provide visual feedback for button clicks
function buttonFeedback(button) {
    const originalBackgroundColor = button.style.backgroundColor;
    button.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        button.style.backgroundColor = originalBackgroundColor;
    }, 500);
}

// Show a popup with copied cookies
function showCookiePopup(acs_ngn_value, cpn_value) {
    alert(`Cookies copied!\n\nCPN:\n${cpn_value}\n\nACS_NGN:\n ${acs_ngn_value}`);
}

// Get cookies from the content script
function getCookies(tabId, callback) {
    chrome.tabs.sendMessage(tabId, {action: 'getCookies'}, callback);
}

// Handle cookie copying - VERSION 24: Clear localStorage before copying
async function handleCopy() {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const cookieValues = await new Promise((resolve) => getCookies(tab.id, resolve));

        // *** VERSION 24 - CLEAR LOCAL STORAGE BEFORE COPYING COOKIES ***
        console.log("VERSION 24: Clearing localStorage before copying cookies...");
        localStorage.clear(); // Clear local storage before setting new cookies
        console.log("VERSION 24: localStorage cleared.");
        // *** END VERSION 24 - CLEAR LOCAL STORAGE BEFORE COPYING COOKIES ***


        if (cookieValues.acs_ngn && cookieValues.cpn) {
            localStorage.setItem('acs_ngn', cookieValues.acs_ngn);
            localStorage.setItem('cpn', cookieValues.cpn);
            showCookiePopup(cookieValues.acs_ngn, cookieValues.cpn);
            buttonFeedback(copyButton);
        } else {
            alert('Cookies not found! Make sure acs_ngn and cpn cookies are present.');
        }
    } catch (error) {
        console.error(error);
        alert('Error while copying cookies:', error.message);
    }
}

// Entitlement Check Handler - VERSION 39: Final Version - Back to Fetch, User Instruction Alert
async function handleCheckEntitlement() {
    const checkButton = document.getElementById('checkEntitlement'); // CORRECT VARIABLE DEFINITION
    buttonFeedback(checkButton); // MODIFIED: Passing checkButton here
    try {
        const checkboxes = document.querySelectorAll('.env-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('Please select at least one environment');
            return;
        }

        // *** VERSION 36 - USER INSTRUCTION ALERT - IMPORTANT! (KEPT in Final Version) ***
        alert("For best results, click 'Copy Cookie' button first before 'Check Entitlement'."); // VERSION 36 - User instruction alert (KEPT)
        // *** END VERSION 36 - USER INSTRUCTION ALERT (KEPT) ***


        // Get cookies from localStorage
        const acs_ngn_value = localStorage.getItem('acs_ngn');
        const cpn_value = localStorage.getItem('cpn'); // Still retrieve cpn from local storage (though might not use it)

        const apiDomainURL_Prod = 'https://main-graphql.newsapis.co.uk';
        const apiDomainURL_UAT = 'https://main-graphql.dev.newsapis.co.uk';
        const apiDomainURL_Staging = 'https://main-graphql.staging.newsapis.co.uk';
        let currentApiDomainURL = apiDomainURL_Prod;
        let targetDomainForCookies = "newsapis.co.uk";


        if (checkboxes[1] && checkboxes[1].checked) { // Check if UAT checkbox is checked (index 1)
            currentApiDomainURL = apiDomainURL_UAT;
            targetDomainForCookies = "dev.newsapis.co.uk";
            // *** VERSION 25 - CORRECTED LOGIC: UAT Domain and URL (KEPT) ***
            console.log("UAT Environment Selected. Setting targetDomainForCookies to:", targetDomainForCookies, "and currentApiDomainURL to:", currentApiDomainURL); // VERSION 25 - Corrected Log (KEPT)
            // *** END VERSION 25 - CORRECTED LOGIC: UAT Domain and URL (KEPT) ***
        } else if (checkboxes[2] && checkboxes[2].checked) { // Check if Staging checkbox is checked (index 2)
            currentApiDomainURL = apiDomainURL_Staging;
            targetDomainForCookies = "staging.newsapis.co.uk";
            // *** VERSION 25 - CORRECTED LOGIC: Staging Domain and URL (KEPT) ***
            console.log("Staging Environment Selected. Setting targetDomainForCookies to:", targetDomainForCookies, "and currentApiDomainURL to:", currentApiDomainURL); // VERSION 25 - Corrected Log (KEPT)
            // *** END VERSION 25 - CORRECTED LOGIC: Staging Domain and URL (KEPT) ***
        } else { // PROD environment
            currentApiDomainURL = apiDomainURL_Prod;
            targetDomainForCookies = "newsapis.co.uk";
             // *** VERSION 36 - PROD: SEND ONLY ACS_NGN COOKIE (KEPT) ***
            console.log("Prod Environment Selected. Setting targetDomainForCookies to:", targetDomainForCookies, "and currentApiDomainURL to:", currentApiDomainURL + " - SENDING ACS_NGN ONLY"); // VERSION 36 - Log message (KEPT)
            // *** END VERSION 36 - PROD: SEND ONLY ACS_NGN COOKIE (KEPT) ***
             // *** VERSION 25 - CORRECTED LOGIC: Prod Domain and URL (KEPT) ***
            console.log("Prod Environment Selected. Setting targetDomainForCookies to:", targetDomainForCookies, "and currentApiDomainURL to:", currentApiDomainURL); // VERSION 25 - Corrected Log (KEPT)
            // *** END VERSION 25 - CORRECTED LOGIC: Prod Domain and URL (KEPT) ***
        }


        if (!acs_ngn_value) { // VERSION 17 - Check only for acs_ngn (KEPT)
            alert('Required cookie not found (acs_ngn). Please copy cookies first.'); // VERSION 17 - Updated alert message (KEPT)
            return;
        }

        // *** VERSION 36 - PROGRAMMATICALLY SET COOKIE (ACS_NGN ONLY for PROD) (KEPT) ***
        console.log("Attempting to set cookie programmatically for Entitlement Check (acs_ngn ONLY for PROD)..."); // VERSION 36 - Updated Log Message (KEPT)
        await chrome.cookies.set({ url: currentApiDomainURL + "/graphql", name: 'acs_ngn', value: acs_ngn_value, domain: `.${targetDomainForCookies}`, path: '/', secure: true, httpOnly: true }); // VERSION 36 - Setting acs_ngn cookie ONLY (KEPT)
        // await chrome.cookies.set({ url: currentApiDomainURL + "/graphql", name: 'cpn', value: cpn_value, domain: `.${targetDomainForCookies}`, path: '/', secure: true, httpOnly: true }); // VERSION 36 - CPN cookie setting REMOVED for PROD (KEPT)
        console.log("Cookies set programmatically for Entitlement Check (attempted - acs_ngn ONLY for PROD)."); // VERSION 36 - Updated Log Message (KEPT)
        // *** END VERSION 36 - PROGRAMMATICALLY SET COOKIE (ACS_NGN ONLY for PROD) (KEPT) ***

        // *** VERSION 26 - INTRODUCE DELAY BEFORE FETCH (KEPT) ***
        const delayMilliseconds = 500; // Adjust delay time as needed
        console.log(`VERSION 26: Delaying fetch by ${delayMilliseconds}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMilliseconds)); // Introduce delay
        console.log("VERSION 26: Delay completed. Proceeding with fetch.");
        // *** END VERSION 26 - INTRODUCE DELAY BEFORE FETCH (KEPT) ***


        // Debug cookie value
        alert(`Using cookie:\nacs_ngn=${acs_ngn_value}`); // VERSION 31 - Updated Alert message (KEPT)

        const results = [];
        for (const checkbox of checkboxes) {
            const url = checkbox.dataset.url;
            const cookieHeaderValue = `acs_ngn=${acs_ngn_value}`; // VERSION 36 - Send ONLY acs_ngn in header for PROD (KEPT)

            const fetchOptions = { // Define fetch options
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeaderValue // VERSION 36 - Using ONLY acs_ngn header for PROD (KEPT)
                },
                body: JSON.stringify({
                    query: `query User {
                        user {
                            email
                            subscriptions {
                                isActive
                                packName
                            }
                        }
                    }`
                })
            };

            const response = await fetch(url, fetchOptions);
            const responseText = await response.text();

            try {
                const data = JSON.parse(responseText);
                if (data.errors) {
                    results.push(
                        `${url}\n` +
                        `Cookies sent: acs_ngn=${acs_ngn_value}\n` + // VERSION 36 - Updated log message (KEPT)
                        `Status: ${response.status}\n` +
                        `Error: ${data.errors[0].message}`
                    );
                    continue;
                }

                if (data.data?.user) {
                    const user = data.data.user;
                    const subs = user.subscriptions?.map(sub =>
                        `• ${sub.packName} (${sub.isActive ? 'Active' : 'Inactive'})`
                    ).join('\n') || 'No subscriptions';

                    results.push(
                        `Environment: ${new URL(url).hostname}\n\n` +
                        `Email: ${user.email}\n\n` +
                        `Subscriptions:\n\n${subs}\n\n`
                    );
                }
            } catch (parseError) {
                results.push(
                    `${url}\n` +
                    `Status: ${response.status}\n` +
                    `Raw Response: ${responseText}\n` +
                    `Parse Error: ${parseError.message}`
                );
            }
        }

        alert(results.join('\n'));

    } catch (error) {
        console.error('Entitlement check failed:', error);
        alert(`Error checking entitlements: ${error.message}`);
    }
}

// Handle cookie pasting
async function handlePaste() {
    try {
        const acs_ngn_value = localStorage.getItem('acs_ngn');
        if (acs_ngn_value) {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            const {url} = tab;
            const newCookie = {
                url,
                name: 'acs_ngn',
                value: acs_ngn_value,
                path: '/',
            };
            const cookie = await new Promise((resolve) => chrome.cookies.set(newCookie, resolve));

            if (cookie) {
                alert('Cookie pasted!');
                buttonFeedback(pasteButton);
                chrome.tabs.reload(tab.id);
            } else {
                alert('Failed to paste cookie!');
            }
        } else {
            alert('No cookie found in local storage!');
        }
    } catch (error) {
        console.error(error);
        alert('Error while pasting cookies:', error.message);
    }
}

// Handle cookie clearing
async function handleClear() {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const url = new URL(tab.url);

        // Function to remove a cookie by name
        async function removeCookieByName(name) {
            const cookie = await new Promise((resolve) => chrome.cookies.get({url: tab.url, name}, resolve));
            if (cookie) {
                await new Promise((resolve) => chrome.cookies.remove({
                    url: url.protocol + "//" + url.hostname + cookie.path,
                    name: cookie.name
                }, resolve));
                console.log(`${name} cookie deleted!`);
            } else {
                console.log(`${name} cookie not found for this domain!`);
            }
        }

        // Remove both acs_ngn and sacs_ngn cookies
        await removeCookieByName('acs_ngn');
        await removeCookieByName('sacs_ngn');

        alert('acs_ngn and sacs_ngn cookies deleted!');
        buttonFeedback(clearButton);
        chrome.tabs.reload(tab.id);
    } catch (error) {
        console.error(error);
        alert('Error while clearing cookies:', error.message);
    }
}

// Handle storage clearing
async function handleClearStorage() {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

        // Clear local and session storage
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: () => {
                localStorage.clear();
                sessionStorage.clear();
            }
        }).then(() => {
            alert('Storage cleared!');
            buttonFeedback(clearStorageButton);
            chrome.tabs.reload(tab.id);
        }).catch((error) => {
            console.error(error);
            alert('Error while clearing storage:', error.message);
        });
    } catch (error) {
        console.error(error);
        alert('Error while clearing storage:', error.message);
    }
}

// Handle sacs_ngn cookie import
async function handleImportSacsNgn() {
    try {
        const sacsNgnValue = sacsNgnInput.value.trim();
        if (!sacsNgnValue) {
            alert('Please enter a sacs_ngn cookie value.');
            return;
        }

        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const {url} = tab;
        const newCookie = {
            url,
            name: 'sacs_ngn',
            value: sacsNgnValue,
            path: '/',
            secure: true,
            httpOnly: true,
        };

        console.log('Attempting to set cookie:', newCookie);

        const cookie = await new Promise((resolve) => chrome.cookies.set(newCookie, resolve));
        if (cookie) {
            alert('sacs_ngn cookie imported!');
            buttonFeedback(importSacsNgnButton);
            chrome.tabs.reload(tab.id);
        } else {
            alert('Failed to import sacs_ngn cookie!');
        }
    } catch (error) {
        console.error('Error while importing sacs_ngn cookie:', error);
        alert('Error while importing sacs_ngn cookie: ' + error.message);
    }
}

// Add event listeners
copyButton.addEventListener('click', handleCopy);
pasteButton.addEventListener('click', handlePaste);
clearButton.addEventListener('click', handleClear);
clearStorageButton.addEventListener('click', handleClearStorage);
importSacsNgnButton.addEventListener('click', handleImportSacsNgn);
checkEntitlementButton.addEventListener('click', handleCheckEntitlement);