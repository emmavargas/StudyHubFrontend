document.addEventListener("DOMContentLoaded", async function (){

    try {
        const response = await fetch('http://65.21.56.202:3000/user/courses',{
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok){
            window.location.href = "/";

        }else{
            const data = await response.json();
            loadCourse(data);
        }
    }catch(error){
        console.log('error',  error)
        window.location.href = "/";

    }

});

function loadCourse(data){

    if (!Array.isArray(data)) {
        console.error('Error: data no es un arreglo', data);
        return;
    }
    const container = document.querySelector('.courses-container');
    data.forEach(
        course => {
            const rows =document.querySelectorAll('.courses-row');
            if(course !== null){
                const courseCard = createCourse(course);
                if(rows.length ===0 || rows[rows.length-1].children.length >= 3){
                    const newRow = document.createElement('div');
                    newRow.classList.add('courses-row');
                    newRow.appendChild(courseCard);
                    container.appendChild(newRow);
                }else{
                    rows[rows.length-1].appendChild(courseCard);
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
                        generateExam(this);
                    });
        
                }

            }

        }
    )
}

function createCourse(course){
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.dataset.id = course.id;
    courseCard.innerHTML = `
        <div class="title-card">
            <h2>${course.title}</h2>
            <div class="card-icons">
                <img src="/assets/img/write.svg" alt="editar curso" onclick="openModal('edit',this)">
                <img src="/assets/img/delete.svg" alt="eliminar" onclick="openModal('delete',this)">
            </div>
        </div>

        <span>${course.topics.length} ${course.topics.length === 1 ? 'tema' : 'temas'}</span>

        <div class="action-card">
            <button class="generate-exam">Generar examen</button>
            <button class="view-details"">Ver detalles</button>
        </div>
    `;
    return courseCard;
}

function redirectionTest(element){
    const idCourse = element.closest('.course-card').dataset.id;
    window.location.href = `/user/courses/${idCourse}`;
}


function generateExam(element){
    const idCourse = element.closest('.course-card').dataset.id;
    window.location.href = `/user/courses/${idCourse}/exam-ai`;
}



async function deleteCourse(element){
    const courseCard = element.closest('.course-card');
    const idCourse = courseCard.dataset.id;


    try{
        const response = await fetch(`http://65.21.56.202:3000/user/courses/${idCourse}`,{
            method: 'DELETE',
            credentials: 'include'
        });
        if(!response.ok){
            window.location.href = '/';
        }
        courseCard.remove();
    }catch(error){
        alert("Error: No se pudo eliminar el elemento.")
    };
}