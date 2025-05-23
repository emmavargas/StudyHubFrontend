

const modal = document.querySelector(".modal");
const modalTitle = document.getElementById('modal-title');

async function openModal(action, element) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);

    if(action === 'create'){
        modal.innerHTML = '';

        const formCreate = document.createElement('form');
        formCreate.classList.add('creation-modal');
        formCreate.setAttribute('id', 'modal-form-create');

        formCreate.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-title">Crear Nuevo Tema</h3>
                <span class="close" onclick="closeModal()">&times;</span>
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
                <h4>Bibliografia</h4>
                <input id="topic-bibliography" type="text" placeholder="Aguilera, N. (2020). Matemáticas Discretas: Fundamentos y Aplicaciones. Editorial Síntesis." required>
            </div>
    
            <div class="options-add-close">
                <button type="button" class="cancel" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="create">Crear Tema</button>
            </div>        
        `;
        modal.appendChild(formCreate);
        formCreate.addEventListener('submit', handleCreateFormSubmit);
        formCreate.querySelector('.cancel').addEventListener('click', cancelClick);

    }else if(action === 'edit'){
        modal.innerHTML = ``;
        const topicCard = element.closest('.item-card');
        if(!topicCard){
            console.error('No se encontró un elemento .item-card');
            return;
        }
        const topicId = topicCard.dataset.id;
        console.log('ID del tema obtenido:', topicId);

        let dataTopic;
        try{
            dataTopic = await getDataTopic(topicId);
            console.log('Datos del tema:', dataTopic);
        }catch(error){
            console.error('Error al obtener datos del tema:', error);
            return;
        }

        const formEdit = document.createElement('form');
        formEdit.classList.add('creation-modal');
        formEdit.setAttribute('id', 'modal-form-edit');
        formEdit.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-title">Editar Tema</h3>
                <span class="close" onclick="closeModal()">&times;</span>
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
                <h4>Bibliografia</h4>
                <input id="topic-bibliography" type="text" placeholder="Aguilera, N. (2020). Matemáticas Discretas: Fundamentos y Aplicaciones. Editorial Síntesis." required>
            </div>
    
            <div class="options-add-close">
                <button type="button" class="cancel" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="create">Guardar</button>
            </div>                
        `;
        modal.appendChild(formEdit);
        formEdit.querySelector('#topic-title').value = dataTopic.title;
        formEdit.querySelector('#topic-title').setAttribute('data-title', dataTopic.title || '');
        formEdit.querySelector('#topic-description').value = dataTopic.description;
        formEdit.querySelector('#topic-description').setAttribute('data-description', dataTopic.description || '');
        formEdit.querySelector('#topic-bibliography').value = dataTopic.bibliography;
        formEdit.querySelector('#topic-bibliography').setAttribute('data-bibliography', dataTopic.bibliography || '');
        formEdit.addEventListener('submit', (event) => {
            event.preventDefault();
            handleEditFormSubmit(event, topicId);
        });
        formEdit.querySelector('.cancel').addEventListener('click', cancelClick);
    }else if(action === 'delete'){
        modal.innerHTML = '';
        const confirmation = document.createElement('div');
        confirmation.classList.add('confirmation-delete-container')
        confirmation.innerHTML =`
            <h3>¿Estás seguro de que quieres eliminar este Tema? Esta acción no se puede deshacer.</h3>
            <div class="confirmation">
                <button class="delete-btn">Aceptar</button>
                <button class="cancel-delete-btn">Cancelar</button>
            </div>   
        `
        modal.appendChild(confirmation);
        confirmation.querySelector('.delete-btn').addEventListener('click', ()=>{
            deleteTopic(element);
            closeModal();
        })
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


async function handleCreateFormSubmit(event){
    event.preventDefault();

    const tittle = document.getElementById('topic-title').value;
    const description = document.getElementById('topic-description').value;
    const bibliography = document.getElementById('topic-bibliography').value;
    const topicCard = await createTopicCard(tittle, description, bibliography);

    const topicsCollection = document.querySelector('.topics-collection');
    topicsCollection.appendChild(topicCard);
    event.target.reset();
    closeModal();

}


async function createTopicCard(title, description, bibliography){
    const topicCard = document.createElement('div');
    topicCard.classList.add('item-card');
    try{
        const response = await fetch (`http://localhost:8080/api/user/courses/${idCourse}/topics`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                bibliography: bibliography
            }),
            credentials:'include'
        });

        if (!response.ok) {
            throw new Error('cookies invalido o error en el servidor');
        }

        const data = await response.json();
        if(data && data.id){
            topicCard.dataset.id = data.id;
            topicCard.innerHTML = `
                <div class="title-card">
                    <h4>${data.title}</h4>
                    <div class="card-icons">
                        <img src="/assets/img/write.svg" alt="editar tema" onclick="openModal('edit',this)">
                        <img src="/assets/img/delete.svg" alt="eliminar" onclick="openModal('delete',this)">
                    </div>
                </div>

                <div class="button-group">
                    <button class="switch-btn active" onclick="switchContent('description',this)">Descripción</button>
                    <button class="switch-btn" onclick="switchContent('bibliography',this)">Bibliografía</button>
                </div>

                <p>${data.description}</p>
            `;

        }else{
            console.error('Error al crear el tema:', data);
        }

    }catch(error){
        console.error('Error al crear el tema:', error);
        return null;
    }
    return topicCard;
}


async function getDataTopic(idTopic){
    let dataTopic={};
    try{
        const response = await fetch(`http://localhost:8080/api/user/courses/${idCourse}/topics/${idTopic}`, {
            method:'GET',
            credentials:'include'
        });
        if(!response.ok){
            throw new Error('Error en la solicitud de tema');
        }
        dataTopic = await response.json();
    }catch(error){
        console.error('Error al obtener datos del tema:', error);
    }
    return dataTopic;

}


async function handleEditFormSubmit(event, idTopic){
    event.preventDefault();

    const title = document.getElementById('topic-title').value;
    const description = document.getElementById('topic-description').value;
    const bibliography = document.getElementById('topic-bibliography').value;
    const dataTopic = {
        title: title,
        description: description,
        bibliography: bibliography
    };

    try{
        const response = await fetch(`http://localhost:8080/api/user/courses/${idCourse}/topics/${idTopic}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataTopic),
            credentials:'include'
        })

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
        
    }catch(error){
        console.error('Error al editar el tema:', error);
        window.location.href = "/";
    }

    closeModal();

}


