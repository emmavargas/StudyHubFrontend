const dropZone = document.querySelector('.pdf-drop-zone');
    const filesList = document.createElement('ul');
    dropZone.appendChild(filesList);

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Usamos delegación de eventos en el contenedor dropZone
    dropZone.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-files')) {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.doc,.docx,.txt';
            input.multiple = true;
            input.onchange = (e) => {
                handleFiles(e.target.files);
            };
            input.click();
        }
    });

    function handleFiles(files) {
        filesList.innerHTML = '';
        for (const file of files) {
            if (file.type === 'application/pdf' || 
                file.type === 'application/msword' || 
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                file.type === 'text/plain') {
                const listItem = document.createElement('li');
                listItem.textContent = file.name;
                filesList.appendChild(listItem);
            } else {
                alert(`El archivo ${file.name} no es un Word, PDF o TXT y no se agregará.`);
            }
        }
    }