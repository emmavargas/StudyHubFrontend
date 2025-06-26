const url = new URL(window.location.href);
const urlParams = url.pathname.split('/').filter(segment => segment);
const idCourse = urlParams.pop(); 

document.addEventListener('DOMContentLoaded', async() => {

    const titleCourse = document.getElementById('title-course');
    const bibliographyCourse = document.getElementById('bibliography-course');
    const topicsContainer = document.querySelector('.topics-container');
    let dataCourse = null;


    try{
        const response = await fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}`,{
            method:'GET',
            credentials: 'include'
        })
        if(!response.ok){
            throw new Error('Error en la solicitud de curso');

        }

        const data = await response.json();
        titleCourse.innerHTML = data.title;
        bibliographyCourse.innerHTML = data.contentBibliography;
        topicsContainer.appendChild(createTopics(data));
    }catch(error) {
        console.error('Error:', error);
        window.location.href = "/";
    };
});


function createTopics(dataTopics){
    const topicsCollection = document.createElement('div');
    topicsCollection.classList.add('topics-collection');
    dataTopics.topics.forEach(topic => {

        const topicCard = document.createElement('div');
        topicCard.classList.add('item-card');
        topicCard.dataset.id = topic.id;

        topicCard.innerHTML = `
            <div class="title-card">
                <h4>${topic.title}</h4>
                <div class="card-icons">
                    <img src="/assets/img/write.svg" alt="editar tema" onclick="openModal('edit',this)">
                    <img src="/assets/img/delete.svg" alt="eliminar" onclick="openModal('delete',this)">
                </div>
            </div>

            <div class="button-group">
                <button class="switch-btn active" onclick="switchContent('description',this)">Descripción</button>
                <button class="switch-btn" onclick="switchContent('bibliography',this)">Bibliografía</button>
             </div>

            <p>${topic.description}</p>
        `;
        topicsCollection.appendChild(topicCard);
    });
    return topicsCollection;
}


function switchContent(contentType, button) {
    const card = button.closest('.item-card');
    const idTopic = card.dataset.id;
    
    const buttons = card.querySelectorAll('.switch-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    button.classList.add('active');
    
    const paragraph = card.querySelector('p');
    
    fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}/topics/${card.dataset.id}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud de tema');
        }
        return response.json();
    })
    .then(data => {
        if (contentType === 'description') {
            paragraph.textContent = data.description;
        } else if (contentType === 'bibliography') {
            const listContainer = document.createElement('ul');
            listContainer.classList.add('bibliography-list');

            data.fileAttachments.forEach(file => {
                const li = document.createElement('li');
                li.classList.add('bibliography-item');
                li.dataset.id = file.id;

                const icon = document.createElement('img');

                // Elegir ícono
                if (file.contentType === 'application/pdf') {
                    icon.src = '/assets/img/pdf.svg';
                    icon.alt = 'PDF';
                } else if (file.contentType === 'application/msword' || file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    icon.src = '/assets/img/word.svg';
                    icon.alt = 'Word';
                } else if (file.contentType === 'text/plain') {
                    icon.src = '/assets/img/txt.svg';
                    icon.alt = 'TXT';
                }

                // Crear enlace clickeable
                const link = document.createElement('a');
                link.textContent = file.fileName;
                link.href = `/api/files/${file.id}`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                // Botón de eliminar (X)
                const deleteBtn = document.createElement('span');
                deleteBtn.textContent = '✖';
                deleteBtn.classList.add('delete-file');
                deleteBtn.title = 'Eliminar archivo';
                deleteBtn.onclick = () => {
                    fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}/topics/${idTopic}/files/${file.id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw new Error(`Error al eliminar el archivo: ${text}`);
                            });
                        }
                        console.log('Archivo eliminado correctamente');
                        // Eliminar el <li> del DOM
                        deleteBtn.closest('li').remove();
                    })
                    .catch(error => {
                        console.error('Error al eliminar archivo:', error);
                        alert(`Error: ${error.message}`);
                    });
                };

                // Agregar elementos al li
                li.appendChild(icon);
                li.appendChild(link);
                li.appendChild(deleteBtn);

                listContainer.appendChild(li);
            });

            paragraph.innerHTML = '';
            paragraph.appendChild(listContainer);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function deleteTopic(element){
    const topicCard = element.closest('.item-card');
    const idTopic = topicCard.dataset.id;
    console.log(idTopic);
    

    fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}/topics/${idTopic}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el tema');
        }
        console.log('Tema eliminado correctamente');
        console.log(idTopic);
        topicCard.remove();

    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error: No se pudo eliminar este tema.")
    });

}

