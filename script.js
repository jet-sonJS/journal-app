const entryInput = document.getElementById('entry-input');
const saveButton = document.getElementById('save');
const entryHistory = document.getElementById('entry-history');

addEventListener('DOMContentLoaded', displayEntries);

saveButton.addEventListener('click', () => {
    const entryText = entryInput.value.trim();
    if (entryText) {
        saveEntry(entryText);
        entryInput.value = '';
        displayEntries();
    }
});

function saveEntry(text) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push({ text, timestamp: new Date().toISOString() });
    localStorage.setItem('journalEntries', JSON.stringify(entries));
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entryHistory.innerHTML = '';
    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.innerHTML = `
            <p>Text: ${entry.text}</p>
            <small>Time: ${new Date(entry.timestamp).toLocaleString()}</small><br>
            <button class="btn btn-info" data-index="${index}">Edit</button>
            <button class="btn btn-danger" data-index="${index}">Delete</button>
        `;
        entryHistory.appendChild(entryDiv);
    });
}

entryHistory.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('btn-info')) {
            editEntry(index);
        } else if (e.target.classList.contains('btn-danger')) {
            deleteEntry(index);
        }
    }
});

function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entry = entries[index];
    entryInput.value = entry.text;
    $('#entry-container').modal('show');
    saveButton.onclick = () => {
        const updatedText = entryInput.value.trim();
        if (updatedText) {
            entries[index].text = updatedText;
            entries[index].timestamp = new Date().toISOString();
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            entryInput.value = '';
            deleteEntry(index - 1);
            displayEntries();
            $('#entry-container').modal('hide');
        }
    };
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
}