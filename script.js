const entryInput = document.getElementById('entry-input');
const saveButton = document.getElementById('save');
const entryHistory = document.getElementById('entry-history');
const modal = document.getElementById('entry-container');
const nameModal = document.getElementById('name-container');
const saveName = document.getElementById('save-name');
const header = document.querySelector('h1');
const nameInput = document.getElementById('name-input');
const nameClose = nameModal.querySelector('.close');

let editIndex = null;

addEventListener("DOMContentLoaded", () => {
    entryInput.value = '';
    header.textContent = 'My Journal';
    nameInput.value = '';
    nameInput.focus();
    modal.classList.remove('show');
    nameModal.classList.remove('show');
    nameModal.classList.add('show');

    document.getElementById('add-entry').addEventListener('click', () => {
        modal.classList.add('show');
        entryInput.focus();
    });

    document.querySelector('.close').addEventListener('click', () => {
        modal.classList.remove('show');
    });
});

saveName.addEventListener('click', () => {
    const name = nameInput.value.trim();

    if (name) {
        localStorage.setItem('userName', name);

        const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries.forEach(entry => {
            if (!entry.user) entry.user = name;
        });
        localStorage.setItem('journalEntries', JSON.stringify(entries));

        nameModal.classList.remove('show');
        header.textContent = `${name}'s Journal`;

        entryHistory.insertAdjacentHTML('afterbegin',
            `<div class="alert alert-success">Welcome ${entries.length > 0 ? " back, " + name : ", " + name}! Start journaling!</div>`);

        setTimeout(() => {
            const alert = entryHistory.querySelector('.alert');
            if (alert) alert.remove();
        }, 2000);

        displayEntries();
    }
});

saveButton.addEventListener('click', () => {
    const entryText = entryInput.value.trim();
    if (!entryText) return;

    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const userName = localStorage.getItem('userName') || 'anonymous';

    if (editIndex !== null) {
        entries[editIndex].text = entryText;
        entries[editIndex].timestamp = new Date().toISOString();
        editIndex = null;

        entryHistory.insertAdjacentHTML('afterbegin',
            '<div class="alert">Entry updated successfully.</div>');
    } else {
        entries.push({
            text: entryText,
            timestamp: new Date().toISOString(),
            user: userName
        });

        entryHistory.insertAdjacentHTML('afterbegin',
            '<div class="alert">Entry saved successfully.</div>');
    }

    localStorage.setItem('journalEntries', JSON.stringify(entries));

    entryInput.value = '';
    displayEntries();
    modal.classList.remove('show');

    setTimeout(() => {
        const alert = entryHistory.querySelector('.alert');
        if (alert) alert.remove();
    }, 2000);
});

function displayEntries() {
    const allEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const userName = localStorage.getItem('userName');

    entryHistory.innerHTML = '';

    const filtered = allEntries.filter(entry => entry.user === userName || !entry.user);

    if (filtered.length === 0) {
        entryHistory.innerHTML = '<p>No entries yet. Start journaling!</p>';
        return;
    }

    allEntries.forEach((entry, index) => {
        if (entry.user === userName || !entry.user) {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('entry', 'panel', 'panel-default');

            entryDiv.innerHTML = `
                <p>Text: ${entry.text}</p>
                <small>Time: ${new Date(entry.timestamp).toLocaleString()}</small><br>
                <div class="btn-group-horizontal">
                    <button class="btn btn-open" data-index="${index}">⁝</button>
                    <div class="btn-group-vertical">
                        <button class="btn btn-success" data-index="${index}">Copy</button>
                        <button class="btn btn-info" data-index="${index}">Edit</button>
                        <button class="btn btn-danger" data-index="${index}">Delete</button>
                    </div>
                </div>
            `;

            entryHistory.appendChild(entryDiv);
        }
    });
}

entryHistory.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const index = e.target.getAttribute('data-index');

        if (e.target.classList.contains('btn-info')) {
            editEntry(index);
        } else if (e.target.classList.contains('btn-danger')) {
            deleteEntry(index);
        } else if (e.target.classList.contains('btn-success')) {
            copyEntry(index);
        } else if (e.target.classList.contains('btn-open')) {
            const btnGroup = e.target.nextElementSibling;
            btnGroup.style.display = btnGroup.style.display === 'block' ? 'none' : 'block';
        }
    }
});

function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entry = entries[index];

    entryInput.value = entry.text;
    editIndex = index;
    modal.classList.add('show');
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();

    entryHistory.insertAdjacentHTML('afterbegin',
        '<div class="alert alert-success">Entry deleted successfully.</div>');

    setTimeout(() => {
        const alert = entryHistory.querySelector('.alert');
        if (alert) alert.remove();
    }, 2000);
}

function copyEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entry = entries[index];

    navigator.clipboard.writeText(entry.text).then(() => {
        displayEntries();
        entryHistory.insertAdjacentHTML('afterbegin',
            '<div class="alert alert-success">Entry copied to clipboard.</div>');
    }).catch(() => {
        entryHistory.insertAdjacentHTML('afterbegin',
            '<div class="alert alert-danger">Failed to copy entry.</div>');
    });

    setTimeout(() => {
        const alert = entryHistory.querySelector('.alert');
        if (alert) alert.remove();
    }, 2000);
}