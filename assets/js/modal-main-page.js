
const modal = document.querySelector(".modal");

async function openModal(action, element) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);

    if (action === 'create') {
        modal.innerHTML = '';
        const formCreate = document.createElement('form');
        formCreate.classList.add('creation-modal');
        //revisar porque se uso setAtrtibute ya que quizas
        formCreate.setAttribute('id', 'modal-form-create');
        formCreate.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-title">Crear Nuevo Curso</h3>
                <span class="close" onclick="closeModal()">×</span>
            </div> 
            <p>Completa la informacion para crear un nuevo curso. Podras agregar temas despues</p>
            <div class="item-course">
                <h4>Titulo de curso</h4>
                <input id="course-title" type="text" placeholder="Ej: Matetica Discreta" required>
            </div>
            <div class="item-course">
                <h4>Bibliografía</h4>
                <input id="course-bibliography" type="text" placeholder="Aguilera, N. (2020). Matemáticas Discretas: Fundamentos y Aplicaciones. Editorial Síntesis." required>
            </div>
            <div class="options-add-close">
                <button type="button" class="cancel" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="create">Crear Curso</button>
            </div>  
        `;
        modal.appendChild(formCreate);

        formCreate.addEventListener('submit', handleCreateFormSubmit);
        formCreate.querySelector('.cancel').addEventListener('click', cancelClick);
    } else if (action === 'edit') {
        modal.innerHTML = '';
        const courseCard = element.closest('.course-card');
        if (!courseCard) {
            console.error('No se encontró un elemento .course-card');
            return;
        }
        const courseId = courseCard.dataset.id;
        console.log('ID del curso obtenido:', courseId);
        if (!courseId || courseId === 'undefined') {
            console.error('ID del curso no válido:', courseId, 'en la tarjeta:', courseCard);
            return;
        }

        let dataCourse;
        try {
            dataCourse = await getDataCourse(courseId);
            console.log('Datos del curso:', dataCourse);
        } catch (error) {
            console.error('Error al obtener datos del curso:', error);
            return;
        }

        const formEdit = document.createElement('form');
        formEdit.classList.add('creation-modal');
        formEdit.setAttribute('id', 'modal-form-edit');
        formEdit.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-title">Editar Curso</h3>
                <span class="close" onclick="closeModal()">×</span>
            </div> 
            <div class="item-course">
                <h4>Titulo de curso</h4>
                <input id="course-title" type="text" placeholder="Ej: Matetica Discreta" required>
            </div>
            <div class="item-course">
                <h4>Bibliografía</h4>
                <input id="course-bibliography" type="text" placeholder="Aguilera, N. (2020). Matemáticas Discretas: Fundamentos y Aplicaciones. Editorial Síntesis." required>
            </div>
            <div class="options-add-close">
                <button type="button" class="cancel" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="create">Editar Curso</button>
            </div>  
        `;
        modal.appendChild(formEdit);

        formEdit.querySelector('#course-title').value = dataCourse.title || '';
        formEdit.querySelector('#course-bibliography').value = dataCourse.contentBibliography || '';
        formEdit.addEventListener('submit', (event) => {
            event.preventDefault();
            handleEditFormSubmit(event, courseId);
        });
        formEdit.querySelector('.cancel').addEventListener('click', cancelClick);
    }else if(action === 'delete'){
        modal.innerHTML = '';
        const confirmation = document.createElement('div');
        confirmation.classList.add('confirmation-delete-container')
        confirmation.innerHTML =`
            <h3>¿Estás seguro de que quieres eliminar este Curso? Esta acción no se puede deshacer.</h3>
            <div class="confirmation">
                <button class="delete-btn">Aceptar</button>
                <button class="cancel-delete-btn">Cancelar</button>
            </div>   
        `
        modal.appendChild(confirmation);
        confirmation.querySelector('.delete-btn').addEventListener('click', ()=>{
            deleteCourse(element);
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


async function handleCreateFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('course-title').value;
    const bibliography = document.getElementById('course-bibliography').value;
    const courseCard = await createCourseCard(title, bibliography);
    const coursesContainer = document.querySelector('.courses-container');
    const rows = coursesContainer.querySelectorAll('.courses-row');
    if (rows.length === 0 || rows[rows.length - 1].children.length >= 3) {
        const newRow = document.createElement('div');
        newRow.classList.add('courses-row');
        newRow.appendChild(courseCard);
        coursesContainer.appendChild(newRow);
    } else {
        rows[rows.length - 1].appendChild(courseCard);
    }
    event.target.reset();
    closeModal();
}

async function createCourseCard(title, bibliography) {
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    try {
        const response = await fetch('http://localhost:8080/user/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                contentBibliography: bibliography
            }),
            credentials:'include'
        });
        if (!response.ok) {
            throw new Error('cookies invalido o error en el servidor');
        }
        const data = await response.json();
        if (data && data.id) {
            courseCard.dataset.id = data.id;
            courseCard.innerHTML = `
                <div class="title-card"> 
                    <h2>${data.title}</h2>
                    <div class="card-icons">
                        <img src="/assets/img/write.svg" alt="editar curso" onclick="openModal('edit',this)">
                        <img src="/assets/img/delete.svg" alt="eliminar" onclick="openModal('delete',this)">
                    </div>
                </div>
                <span>0 temas</span>
                <div class="action-card">
                    <button class="generate-exam">Generar examen</button>
                    <button class="view-details"">Ver detalles</button>
                </div>
            `;
        } else {
            console.error('Respuesta no contiene un ID válido:', data);
        }
        
        const viewDetailsBtn = courseCard.querySelector('.view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function() {
                redirectionTest(this);
            });
        }

        const generateExamBtn = courseCard.querySelector('.generate-exam');
        if(generateExamBtn){
            generateExamBtn.addEventListener('click', function() {
                generateExamBtn(this);
            });

        }
        

    } catch (error) {
        console.error('Error en POST:', error);
        window.location.href = "/";
    }
    return courseCard;
}


async function getDataCourse(idCourse) {
    let dataCourse = {};
    try {
        const response = await fetch(`http://localhost:8080/user/courses/${idCourse}`, {
            method: 'GET',
            headers: {
                //quedo sobrante=?
                'Content-Type': 'application/json',
            },
            credentials:'include'
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);

        }

        dataCourse = await response.json();
    } catch (error) {
        console.error('Error al obtener datos del curso:', error);
    }

    return dataCourse;
}




async function handleEditFormSubmit(event, idCourse){

    event.preventDefault();
    const title = document.getElementById('course-title').value;
    const bibliography = document.getElementById('course-bibliography').value;
    const data = {
        title: title,
        contentBibliography: bibliography
    }
    const response = await fetch(`http://localhost:8080/user/courses/${idCourse}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    const dataResponse = await response.json();
    const card = document.querySelector(`[data-id="${idCourse}"]`)

    const titleCard = card.querySelector('h2');

    titleCard.textContent = dataResponse.title

    closeModal();
}
