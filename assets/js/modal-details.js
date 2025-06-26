const modal = document.querySelector(".modal");
    const modalTitle = document.getElementById('modal-title');
    let uploadedFiles = []; // Array para almacenar los archivos seleccionados

    async function openModal(action, element) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            modal.style.opacity = "1";
        }, 10);
        uploadedFiles = []; // Reiniciar archivos al abrir el modal

        if (action === 'create') {
            modal.innerHTML = '';

            const formCreate = document.createElement('form');
            formCreate.classList.add('creation-modal');
            formCreate.setAttribute('id', 'modal-form-create');

            formCreate.innerHTML = `
                <div class="modal-header">
                    <h3 id="modal-title">Crear Nuevo Tema</h3>
                    <span class="close" onclick="closeModal()">×</span>
                </div> 
                <p>Completa la informacion para crear un nuevo Tema.</p>

                <div class="item-card-modal">
                    <h4>Titulo de Tema</h4>
                    <input id="topic-title" type="text" placeholder="Ej: Logica Proposicional" required>
                    <span id="error-message"></span>
                </div>
                <div class="item-card-modal">
                    <h4>Descripcion</h4>
                    <input id="topic-description" type="text" placeholder="Estudio de proposiciones, conectores lógicos, tablas de verdad, tautologías, contradicciones, inferencias válidas, cuantificadores y lógica de predicados de primer orden." required>
                </div>
                <div class="item-card-modal">
                    <h4>Archivos</h4>
                    <div class="pdf-drop-zone">
                        <p>Arrastra archivos Word, PDF o TXT aquí o <a href="#" class="select-files">selecciona archivos</a></p>
                        <p>Solo archivos Word, PDF y TXT</p>
                    </div>
                </div>
            
                <div class="options-add-close">
                    <button type="button" class="cancel" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="create">Crear Tema</button>
                </div>        
            `;
            modal.appendChild(formCreate);

            //arrastrar y soltar
            const dropZone = formCreate.querySelector('.pdf-drop-zone');
            const filesList = document.createElement('ul');
            filesList.classList.add('files-list');
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
                const existingFiles = new Set();
                filesList.querySelectorAll('li span').forEach(span => existingFiles.add(span.textContent));

                for (const file of files) {
                    if (file.type === 'application/pdf' || 
                        file.type === 'application/msword' || 
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                        file.type === 'text/plain') {
                        if (!existingFiles.has(file.name)) {
                            uploadedFiles.push(file); // Guardar archivo en el array
                            const listItem = document.createElement('li');
                            listItem.style.listStyle = 'none';
                            const fileItem = document.createElement('div');
                            fileItem.classList.add('file-item');
                            const icon = document.createElement('img');
                            if (file.type === 'application/pdf') {
                                icon.src = '/assets/img/pdf.svg';
                            } else if (file.type === 'text/plain') {
                                icon.src = '/assets/img/txt.svg';
                            } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                icon.src = '/assets/img/word.svg';
                            }
                            icon.alt = file.type;
                            icon.style.width = '20px';
                            icon.style.display = 'block';
                            icon.onerror = () => {
                                console.error(`Error cargando imagen para ${file.name}`);
                                icon.style.display = 'none';
                            };
                            const fileName = document.createElement('span');
                            fileName.textContent = file.name;
                            fileName.style.display = 'inline-block';
                            fileName.style.marginLeft = '8px';
                            fileItem.appendChild(icon);
                            fileItem.appendChild(fileName);
                            listItem.appendChild(fileItem);
                            filesList.appendChild(listItem);
                            existingFiles.add(file.name);
                        }
                    } else {
                        alert(`El archivo ${file.name} no es un Word, PDF o TXT y no se agregará.`);
                    }
                }
            }
            // Fin arrastrar y soltar

            formCreate.addEventListener('submit', handleCreateFormSubmit);
            formCreate.querySelector('.cancel').addEventListener('click', cancelClick);

        } else if (action === 'edit') {
            modal.innerHTML = '';
            const topicCard = element.closest('.item-card');
            if (!topicCard) {
                console.error('No se encontró un elemento .item-card');
                return;
            }
            const topicId = topicCard.dataset.id;
            console.log('ID del tema obtenido:', topicId);

            let dataTopic;
            try {
                dataTopic = await getDataTopic(topicId);
                console.log('Datos del tema:', dataTopic);
            } catch (error) {
                console.error('Error al obtener datos del tema:', error);
                return;
            }

            const formEdit = document.createElement('form');
            formEdit.classList.add('creation-modal');
            formEdit.setAttribute('id', 'modal-form-edit');
            formEdit.innerHTML = `
                <div class="modal-header">
                    <h3 id="modal-title">Editar Tema</h3>
                    <span class="close" onclick="closeModal()">×</span>
                </div> 
                <div class="item-card-modal">
                    <h4>Titulo de Tema</h4>
                    <input id="topic-title" type="text" placeholder="Ej: Logica Proposicional" required>
                    <span id="error-message"></span>
                </div>
                <div class="item-card-modal">
                    <h4>Descripcion</h4>
                    <input id="topic-description" type="text" placeholder="Estudio de proposiciones, conectores lógicos, tablas de verdad, tautologías, contradicciones, inferencias válidas, cuantificadores y lógica de predicados de primer orden." required>
                </div>

                <div class="item-card-modal">
                    <h4>Archivos</h4>
                    <div class="pdf-drop-zone">
                        <p>Arrastra archivos Word, PDF o TXT aquí o <a href="#" class="select-files">selecciona archivos</a></p>
                        <p>Solo archivos Word, PDF y TXT</p>
                    </div>
                </div>
        
                <div class="options-add-close">
                    <button type="button" class="cancel" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="create">Guardar</button>
                </div>                
            `;
            modal.appendChild(formEdit);

            //arrastrar y soltar (edición)
            const dropZone = formEdit.querySelector('.pdf-drop-zone');
            const filesList = document.createElement('ul');
            filesList.classList.add('files-list');
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
                const existingFiles = new Set();
                filesList.querySelectorAll('li span').forEach(span => existingFiles.add(span.textContent));

                for (const file of files) {
                    if (file.type === 'application/pdf' || 
                        file.type === 'application/msword' || 
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                        file.type === 'text/plain') {
                        if (!existingFiles.has(file.name)) {
                            uploadedFiles.push(file); // Guardar archivo en el array
                            const listItem = document.createElement('li');
                            listItem.style.listStyle = 'none';
                            const fileItem = document.createElement('div');
                            fileItem.classList.add('file-item');
                            const icon = document.createElement('img');
                            if (file.type === 'application/pdf') {
                                icon.src = '/assets/img/pdf.svg';
                            } else if (file.type === 'text/plain') {
                                icon.src = '/assets/img/txt.svg';
                            } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                icon.src = '/assets/img/word.svg';
                            }
                            icon.alt = file.type;
                            icon.style.width = '20px';
                            icon.style.display = 'block';
                            icon.onerror = () => {
                                console.error(`Error cargando imagen para ${file.name}`);
                                icon.style.display = 'none';
                            };
                            const fileName = document.createElement('span');
                            fileName.textContent = file.name;
                            fileName.style.display = 'inline-block';
                            fileName.style.marginLeft = '8px';
                            fileItem.appendChild(icon);
                            fileItem.appendChild(fileName);
                            listItem.appendChild(fileItem);
                            filesList.appendChild(listItem);
                            existingFiles.add(file.name);
                        }
                    } else {
                        alert(`El archivo ${file.name} no es un Word, PDF o TXT y no se agregará.`);
                    }
                }
            }
            // Fin arrastrar y soltar (edición)

            formEdit.querySelector('#topic-title').value = dataTopic.title;
            formEdit.querySelector('#topic-title').setAttribute('data-title', dataTopic.title || '');
            formEdit.querySelector('#topic-description').value = dataTopic.description;
            formEdit.querySelector('#topic-description').setAttribute('data-description', dataTopic.description || '');
            formEdit.addEventListener('submit', (event) => {
                event.preventDefault();
                handleEditFormSubmit(event, topicId);
            });
            formEdit.querySelector('.cancel').addEventListener('click', cancelClick);

        } else if (action === 'delete') {
            modal.innerHTML = '';
            const confirmation = document.createElement('div');
            confirmation.classList.add('confirmation-delete-container');
            confirmation.innerHTML = `
                <h3>¿Estás seguro de que quieres eliminar este Tema? Esta acción no se puede deshacer.</h3>
                <div class="confirmation">
                    <button class="delete-btn">Aceptar</button>
                    <button class="cancel-delete-btn">Cancelar</button>
                </div>   
            `;
            modal.appendChild(confirmation);
            confirmation.querySelector('.delete-btn').addEventListener('click', () => {
                deleteTopic(element);
                closeModal();
            });
            confirmation.querySelector('.cancel-delete-btn').addEventListener('click', cancelClick);
        }
    }

    function closeModal() {
        modal.style.opacity = "0";
        document.body.style.overflow = "auto";
        setTimeout(() => {
            modal.style.display = "none";
        }, 300); 
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    function cancelClick() {
        closeModal();
    }

async function handleCreateFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('topic-title').value;
    const description = document.getElementById('topic-description').value;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    uploadedFiles.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await fetch(`http://localhost:8080/api/user/courses/${idCourse}/topics`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Error al crear el tema');
        const data = await response.json();
        const topicCard = createTopicCard(data.id, data.title, data.description, data.fileAttachments);
        const topicsCollection = document.querySelector('.topics-collection');
        topicsCollection.appendChild(topicCard);

        // Forzar actualización de switchContent para el nuevo tema
        const newTopicButton = topicCard.querySelector('.switch-btn');
        if (newTopicButton) {
            switchContent('description', newTopicButton); // Inicia con descripción
        }

        event.target.reset();
        uploadedFiles = []; // Limpiar archivos después de enviar
        closeModal();
    } catch (error) {
        console.error('Error:', error);
    }
}

    function createTopicCard(id, title, description, listFiles) {
        const topicCard = document.createElement('div');
        topicCard.classList.add('item-card');
        topicCard.dataset.id = id;
        topicCard.innerHTML = `
            <div class="title-card">
                <h4>${title}</h4>
                <div class="card-icons">
                    <img src="/assets/img/write.svg" alt="editar tema" onclick="openModal('edit',this)">
                    <img src="/assets/img/delete.svg" alt="eliminar" onclick="openModal('delete',this)">
                </div>
            </div>

            <div class="button-group">
                <button class="switch-btn active" onclick="switchContent('description',this)">Descripción</button>
                <button class="switch-btn" onclick="switchContent('bibliography',this)">Bibliografía</button>
            </div>

            <p>${description}</p>
        `;

        return topicCard;
    }

    async function getDataTopic(idTopic) {
        let dataTopic = {};
        try {
            const response = await fetch(`http://localhost:8080/api/user/courses/${idCourse}/topics/${idTopic}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud de tema');
            }
            dataTopic = await response.json();
        } catch (error) {
            console.error('Error al obtener datos del tema:', error);
        }
        return dataTopic;
    }

    async function handleEditFormSubmit(event, idTopic) {
    event.preventDefault();

    const title = document.getElementById('topic-title').value;
    const description = document.getElementById('topic-description').value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    uploadedFiles.forEach(file => {
        formData.append('files', file);
    });


    try {
        const response = await fetch(`http://localhost:8080/api/user/courses/${idCourse}/topics/${idTopic}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Error Cookies invalido o error en el servidor");
        }
        const dataResponse = await response.json();

        const topicCard = document.querySelector(`[data-id="${idTopic}"]`);
        if (!topicCard) {
            console.error('No se encontró el topicCard con ID:', idTopic);
            return;
        }
        const titleCard = topicCard.querySelector('h4');
        const descriptionCard = topicCard.querySelector('p');
        titleCard.textContent = dataResponse.title;
        descriptionCard.textContent = dataResponse.description;

        // Forzar actualización de switchContent para reflejar cambios en bibliografía
        const activeButton = topicCard.querySelector('.switch-btn.active');
        if (activeButton) {
            switchContent(activeButton.classList.contains('active') ? 'bibliography' : 'description', activeButton);
        } else {
            switchContent('description', topicCard.querySelector('.switch-btn')); 
        }

    } catch (error) {
        console.error('Error al editar el tema:', error);
        window.location.href = "/";
    }

    closeModal();
}
