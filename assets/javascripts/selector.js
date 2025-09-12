function updateVersion(selectElement) {
    const card = selectElement.closest('.javadoc-card');
    const versionBadge = card.querySelector('.version-badge');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const versionText = selectedOption.text.match(/Version ([\d.]+)/)[1];
    versionBadge.textContent = 'v' + versionText;
}

function openSelectedVersion(buttonElement) {
    const card = buttonElement.closest('.javadoc-card');
    const select = card.querySelector('.version-select');
    const selectedUrl = select.value;
    
    if (selectedUrl) {
        window.open(selectedUrl, '_blank');
    }
}
