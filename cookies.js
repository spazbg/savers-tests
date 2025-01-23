// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'getCookies') {
//         const acs_ngn_value = document.cookie.match(/acs_ngn=([^;]+)/)?.[1] || null;
//         const cpn_value = document.cookie.match(/cpn=([^;]+)/)?.[1] || null;
//         sendResponse({acs_ngn: acs_ngn_value, cpn: cpn_value});
//     }
//     return true;
// });


// *** ADDED: Initial load log for cookies.js ***
console.log("cookies.js content script loaded");
// *** END ADDED LOG ***


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCookies') {
        const cookies = {};

        // Extract acs_ngn cookie
        const acsNgnMatch = document.cookie.match(/acs_ngn=([^;]+)/);
        if (acsNgnMatch) cookies.acs_ngn = acsNgnMatch[1];

        // Extract cpn cookie
        const cpnMatch = document.cookie.match(/cpn=([^;]+)/);
        if (cpnMatch) cookies.cpn = cpnMatch[1];

        // *** LOGGING in cookies.js - RAW COOKIE VALUES ***
        console.log("Content Script - Raw acs_ngn from document.cookie:", cookies.acs_ngn);
        console.log("Content Script - Raw cpn from document.cookie:", cookies.cpn);
        // *** END LOGGING ***

        sendResponse(cookies);
    }
    return true;
});