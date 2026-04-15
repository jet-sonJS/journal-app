const entryInput = document.getElementById('entry-input');
const saveButton = document.getElementById('save');
const entryHistory = document.getElementById('entry-history');

addEventListener('DOMContentLoaded', displayEntries);
addEventListener("DOMContentLoaded", () => {
    entryInput.value = '';
});

saveButton.addEventListener('click', () => {
    const entryText = entryInput.value.trim();
    if (entryText) {
        saveEntry(entryText);
        entryInput.value = '';
        displayEntries();
        entryHistory.insertAdjacentHTML('afterbegin', '<div class="alert alert-success" role="alert">Entry saved successfully.</div>');
        setTimeout(() => {
            const alert = entryHistory.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 2000);
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
    if (entries.length === 0) {
        entryHistory.innerHTML = '<p>No entries yet. Start journaling!</p>';
        return;
    }
    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry', 'well');
        entryDiv.innerHTML = `
            <p>Text: ${entry.text}</p>
            <small>Time: ${new Date(entry.timestamp).toLocaleString()}</small><br>
            <div class="btn-group-vertical">
                <button class="btn btn-success" data-index="${index}">Copy</button>
                <button class="btn btn-info" data-index="${index}">Edit</button>
                <button class="btn btn-danger" data-index="${index}">Delete</button>
            </div>
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
        } else if (e.target.classList.contains('btn-success')) {
            copyEntry(index);
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
            entryHistory.insertAdjacentHTML('afterbegin', '<div class="alert alert-success" role="alert">Entry updated successfully.</div>');
        setTimeout(() => {
            const alert = entryHistory.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 2000);
            $('#entry-container').modal('hide');
        }
    };
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
    entryHistory.insertAdjacentHTML('afterbegin', '<div class="alert alert-success" role="alert">Entry deleted successfully.</div>');
        setTimeout(() => {
            const alert = entryHistory.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 2000);
}

function copyEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entry = entries[index];
    navigator.clipboard.writeText(entry.text).then(() => {
        displayEntries();
        entryHistory.insertAdjacentHTML('afterbegin', '<div class="alert alert-success alert-dismissible fade in" role="alert">Entry copied to clipboard.</div>');
        setTimeout(() => {
            const alert = entryHistory.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 2000);
    }).catch(() => {
        displayEntries();
        entryHistory.insertAdjacentHTML('afterbegin', '<div class="alert alert-danger" role="alert">Failed to copy entry.</div>');
        setTimeout(() => {
            const alert = entryHistory.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 2000);
    });
}