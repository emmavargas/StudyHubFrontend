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
    
    const buttons = card.querySelectorAll('.switch-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    button.classList.add('active');
    
    const paragraph = card.querySelector('p');
    
    fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}/topics/${card.dataset.id}`, {
        method:'GET',
        credentials:'include'
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Error en la solicitud de tema');
        }
        return response.json();
    })
    .then(data => {
        if (contentType === 'description') {
            paragraph.textContent = data.description;
        } else if (contentType === 'bibliography') {
            paragraph.textContent = data.bibliography;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function deleteTopic(element){
    const topicCard = element.closest('.item-card');

    fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}/topics/${idTopic}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el tema');
        }
        topicCard.remove();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error: No se pudo eliminar este tema.")
    });

}

