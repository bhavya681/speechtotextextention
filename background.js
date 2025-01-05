// //Create a option in the context menu

// chrome.contextMenus.create({
//     id: "speak-text",
//     title: "Speak Slected Text",
//     contexts: ["selection"],
// });

// //When we click it should speak th selected text

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === 'speak-text' && info.selectionText) {
//         chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: speakText,
//             args: [info.selectionText],
//         })
//     }
// })

// //Function Speak Text

// const speakText = (selectionText) => {
//     const utterance = new SpeechSynthesisUtterance(selectionText);
//     const voices = speechSynthesis.getVoices();
//     utterance.voice = voices.find[1];
//     speechSynthesis.speak(utterance);
// }

chrome.contextMenus.create({
    id: "speak-text",
    title: "Speak Selected Text",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "speak-text" && info.selectionText) {
        chrome.storage.sync.get(
            ["voiceIndex", "rate", "pitch", "volume"],
            (settings) => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: speakText,
                    args: [info.selectionText, settings]
                });
            }
        );
    }
});

const speakText = (text, settings) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    // Apply selected voice based on settings
    if (voices.length > 0 && settings.voiceIndex !== undefined) {
        utterance.voice = voices[2];
    }
    utterance.rate = settings.rate || 1.0;
    utterance.pitch = settings.pitch || 1.0;
    utterance.volume = settings.volume || 1.0;

    speechSynthesis.speak(utterance);
};


// chrome.contextMenus.create({
//     id: "speak-text",
//     title: "Speak Selected Text",
//     contexts: ["selection"]
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === "speak-text" && info.selectionText) {
//         chrome.storage.sync.get(
//             ["voiceIndex", "rate", "pitch", "volume"],
//             (settings) => {
//                 chrome.scripting.executeScript({
//                     target: { tabId: tab.id },
//                     function: speakText,
//                     args: [info.selectionText, settings]
//                 });
//             }
//         );
//     }
// });

// const speakText = (text, settings) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     const voices = speechSynthesis.getVoices();

//     if (voices.length > 0 && settings.voiceIndex !== undefined) {
//         utterance.voice = voices[settings.voiceIndex];
//     }
//     utterance.rate = settings.rate || 1.0;
//     utterance.pitch = settings.pitch || 1.0;
//     utterance.volume = settings.volume || 1.0;

//     speechSynthesis.speak(utterance);
// };
