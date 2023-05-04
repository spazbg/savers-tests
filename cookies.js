chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCookies') {
        const acs_ngn_value = document.cookie.match(/acs_ngn=([^;]+)/)?.[1] || null;
        const cpn_value = document.cookie.match(/cpn=([^;]+)/)?.[1] || null;
        sendResponse({acs_ngn: acs_ngn_value, cpn: cpn_value});
    }
    return true;
});