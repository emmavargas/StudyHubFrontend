const containers = document.querySelectorAll('.container');

document.addEventListener("DOMContentLoaded", async function (){

    try {
        const response = await fetch('https://studyhub.emmanueldev.com.ar/api/user/courses',{
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok){
            window.location.href = "/";
        }
        const data = await response.json();
        const countCourses = document.querySelector('.number-courses');
        countCourses.innerHTML = data.length;
    }catch(error){
        console.log('error',  error)
        window.location.href = "/";

    }

});






containers.forEach(container =>{
    container.addEventListener('click', async (e) => {

        const btn = e.target.closest('button');
        if (!btn) return; // Si no se encuentra un botón, salir del evento
        const containerInput = btn.closest('.container');
        const inputs = containerInput.querySelectorAll('div input');
        const groupBtn = containerInput.querySelector('.btn-group');     


        if (btn.classList.contains('edit')) {

            // Si estamos editando email y username, cargamos datos actuales del backend
            if (btn.dataset.action === 'edit-email-username') {
                try {
                    const response = await fetch('https://studyhub.emmanueldev.com.ar/api/user/me', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const data = await response.json();
                        inputs[0].value = data.email || '';
                        inputs[1].value = data.username || '';
                    } else {
                        console.error('No se pudo obtener datos del usuario');
                    }
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                }
            }

            inputs.forEach(input => {
                input.disabled = false;
            });

            groupBtn.innerHTML = `
                <button class="btn-cancel" data-action="${btn.dataset.action}" type="button">
                    <img src="/assets/img/cancel.svg" alt="cancelar">
                    <span>Cancelar</span>
                </button>
                <button class="btn-save" data-action="${btn.dataset.action}" type="button">
                    <img src="/assets/img/save.svg" alt="guardar">
                    <span>Guardar</span>
                </button>
            `;
        }

        if (btn.classList.contains('btn-cancel')) {
            inputs.forEach(input => {
                input.disabled = true;
            });
            groupBtn.innerHTML = `
                <button class="edit" type="button" data-action="${btn.dataset.action}"><img src="/assets/img/write.svg" alt="editar perfil">Editar</button>
            `;
        }

        if(btn.classList.contains('btn-save')){
            console.log('btn-save');
            if(btn.dataset.action == 'edit-name-lastname'){
                console.log('edit-name-lastname');
                saveNameLastname('edit-name-lastname');
            }
            if(btn.dataset.action == 'edit-email-username'){
                console.log('edit-email-username');
                saveEmailUsername('edit-email-username');
            }
            if(btn.dataset.action == 'reset-password'){
                savePassword('reset-password');
                console.log('reset-password');
            }
        
        
    
        }





    });
})


function saveNameLastname(btnAction){

    btn = document.querySelector(`button[data-action="${btnAction}"]`);
    const containerInput = btn.closest('.container');
    const inputs = containerInput.querySelectorAll('div input');

    let data = {
        name: inputs[0].value,
        lastname: inputs[1].value
    }

    const response = fetch('https://studyhub.emmanueldev.com.ar/api/user/edit-name-lastname', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar los datos');
        }
        return response.json();
    })
}

async function saveEmailUsername(btnAction) {
    const btn = document.querySelector(`button[data-action="${btnAction}"]`);
    const containerInput = btn.closest('.container');
    const inputs = containerInput.querySelectorAll('div input');
    const groupBtn = containerInput.querySelector('.btn-group');

    const data = {
        email: inputs[0].value.trim(),
        username: inputs[1].value.trim()
    };
    if (!data.email) {
        alert('El campo email es obligatorio.');
        inputs[0].focus();
        return;
    }
    if (!data.username) {
        alert('El campo nombre de usuario es obligatorio.');
        inputs[1].focus();
        return;
    }

    try {
        const response = await fetch('https://studyhub.emmanueldev.com.ar/api/update-email-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        const errorBox = containerInput.querySelector('.error-email-username');
        if (!response.ok) {
            // Mostrar errores según conflicto
            let errorMsg = '';
            if (responseData.emailExists) {
                errorMsg += 'El correo ya está en uso.<br>';
            }
            if (responseData.usernameExists) {
                errorMsg += 'El nombre de usuario ya está en uso.';
            }

            if (errorBox) {
                errorBox.innerHTML = errorMsg;
                errorBox.style.display = 'flex';
            }
            return;
        }

        // Éxito
        if (errorBox) errorBox.style.display = 'none';
        inputs.forEach(input => input.disabled = true);
        groupBtn.innerHTML = `
            <button class="edit" type="button" data-action="${btn.dataset.action}">
                <img src="/assets/img/write.svg" alt="editar perfil">Editar
            </button>
        `;

    } catch (error) {
        console.error('Error al guardar:', error);
    }
}






async function savePassword(btnAction){

    btn = document.querySelector(`button[data-action="${btnAction}"]`);
    const containerInput = btn.closest('.container');
    const inputs = containerInput.querySelectorAll('div input');
    const groupBtn = containerInput.querySelector('.btn-group');     


    let data = {
        password: inputs[0].value,
        newPassword: inputs[1].value,
        confirmNewPassword: inputs[2].value
    }
    try{

        const response = await fetch('https://studyhub.emmanueldev.com.ar/api/update-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
        })
        const errorMessage = document.querySelector('.error-password');

        const responseData = await response.json();
        if(!response.ok){
            errorMessage.style.display = 'flex';
            const errorText = errorMessage.querySelector('span');
            errorText.innerHTML = responseData.message;
        }else{
            errorMessage.style.display = 'none';
            inputs.forEach(input => {
            input.disabled = true;
            input.value = '';
            });
            groupBtn.innerHTML = `
            <button class="edit" type="button" data-action="${btn.dataset.action}"><img src="/assets/img/write.svg" alt="editar perfil">Editar</button>
            `;
            logoutSesion();

        }



    }catch(error){
        console.error('Error:', error.message);
    }

}