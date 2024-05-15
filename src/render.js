
function openFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const jsonContent = event.target.result;
                populateSidebar(jsonContent);
            };
            reader.readAsText(file);
        }
    });
}

function populateSidebar(jsonContent) {
    const jsonData = JSON.parse(jsonContent);
    const sidebar = document.getElementById('sidebar');
    
    // Clear existing content
    sidebar.innerHTML = '';

    // Extract 'nombreGrupo' values
    const nombreGrupos = jsonData.map(obj => obj.nombreGrupo);

    // Populate sidebar with buttons
    nombreGrupos.forEach(nombreGrupo => {
        const button = document.createElement('button');
        button.textContent = nombreGrupo;
        sidebar.appendChild(button);
    });
}
