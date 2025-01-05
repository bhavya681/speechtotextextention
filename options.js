const languageSelect = document.getElementById("language");
const genderSelect = document.getElementById("gender");
const voiceSelect = document.getElementById("voice");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const volumeInput = document.getElementById("volume");
const saveButton = document.getElementById("save");
const statusMessage = document.getElementById("status");

let voices = [];

// Load available voices dynamically
function loadVoices() {
    voices = speechSynthesis.getVoices();
    updateLanguageOptions();
    updateVoiceOptions();
}

// Populate language options
function updateLanguageOptions() {
    const languages = [...new Set(voices.map(voice => voice.lang))];
    languageSelect.innerHTML = `<option value="all">All Languages</option>`;
    languages.forEach(lang => {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = lang;
        languageSelect.appendChild(option);
    });
}

// Populate voice options based on language and gender filters
function updateVoiceOptions() {
    const selectedLanguage = languageSelect.value;
    const selectedGender = genderSelect.value;

    const filteredVoices = voices.filter(voice => {
        const languageMatch = selectedLanguage === "all" || voice.lang === selectedLanguage;
        const genderMatch =
            selectedGender === "any" ||
            (selectedGender === "male" && voice.name.toLowerCase().includes("male")) ||
            (selectedGender === "female" && voice.name.toLowerCase().includes("female"));
        return languageMatch && genderMatch;
    });

    voiceSelect.innerHTML = "";
    filteredVoices.forEach(voice => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Save selected settings to Chrome storage
function saveSettings() {
    const settings = {
        language: languageSelect.value,
        gender: genderSelect.value,
        voice: voiceSelect.value,
        rate: rateInput.value,
        pitch: pitchInput.value,
        volume: volumeInput.value,
    };

    chrome.storage.sync.set(settings, () => {
        statusMessage.textContent = "Settings saved successfully!";
        setTimeout(() => (statusMessage.textContent = ""), 2000);
    });
}

// Restore settings from Chrome storage
function restoreSettings() {
    chrome.storage.sync.get(
        ["language", "gender", "voice", "rate", "pitch", "volume"],
        settings => {
            languageSelect.value = settings.language || "all";
            genderSelect.value = settings.gender || "any";
            rateInput.value = settings.rate || 1;
            pitchInput.value = settings.pitch || 1;
            volumeInput.value = settings.volume || 1;
            loadVoices();
            voiceSelect.value = settings.voice || "";
        }
    );
}

// Event Listeners
languageSelect.addEventListener("change", updateVoiceOptions);
genderSelect.addEventListener("change", updateVoiceOptions);
saveButton.addEventListener("click", saveSettings);

// Load voices and settings on page load
speechSynthesis.onvoiceschanged = loadVoices;
document.addEventListener("DOMContentLoaded", restoreSettings);
