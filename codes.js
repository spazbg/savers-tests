const submitCodesButton = document.getElementById('submitCodes');
const bankCodeButton = document.getElementById('bankCode');
const codeInput = document.getElementById('codeInput');

// Load codes from storage
function loadCodes(codesInput, callback) {
    chrome.storage.local.get('codes', (data) => {
        const codes = data.codes || '';
        codesInput.value = codes;
        const loadedCodes = codes.split(' ').filter(code => code.length > 0);
        if (typeof callback === 'function') {
            callback(loadedCodes);
        }
    });
}

// Save codes to storage
function saveCodes(codes, callback) {
    const codesString = codes.join(' ');
    chrome.storage.local.set({codes: codesString}, callback);
}

// Provide visual feedback for button clicks
function buttonFeedback(button) {
    const originalBackgroundColor = button.style.backgroundColor;
    button.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        button.style.backgroundColor = originalBackgroundColor;
    }, 500);
}

submitCodesButton.addEventListener('click', () => {
    const input = codeInput.value;
    const newCodes = input.split(/\s+/);
    saveCodes(newCodes, () => {
        buttonFeedback(submitCodesButton);
        console.log('Imported codes:', newCodes);

        // Fetch the updated codes from the storage and update the input area
        loadCodes(codeInput, (loadedCodes) => {
            codeInput.value = loadedCodes.join(' ');
        });
    });
});

bankCodeButton.addEventListener('click', () => {
    loadCodes(codeInput, (loadedCodes) => {
        if (loadedCodes.length === 0) {
            alert('No codes available. Please import codes first.');
            return;
        }

        const code = loadedCodes.shift();
        saveCodes(loadedCodes, () => {
            console.log('Using code:', code);

            // Refresh the input text area with the updated codes
            codeInput.value = loadedCodes.join(' ');

            chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
                if (tab.id) {
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        function: (codeToApply) => {
                            const input = document.querySelector('input[placeholder="TYPE CODE"]');
                            if (input) {
                                input.value = codeToApply;
                                input.dispatchEvent(new Event('input', {bubbles: true}));
                                input.dispatchEvent(new Event('change', {bubbles: true}));
                            }
                        },
                        args: [code]
                    }).then(() => {
                        console.log('Code applied.');
                        buttonFeedback(bankCodeButton);
                    }).catch((error) => {
                        alert('Error: ' + error.message);
                    });
                }
            });
        });
    });
});

// Load codes into the input field when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    loadCodes(codeInput, () => {
    });
});