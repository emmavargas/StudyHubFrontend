const formLogin = document.getElementById('login-form');
const formRegister = document.getElementById('register-form');
const message = document.querySelector('.message-login');

document.addEventListener('DOMContentLoaded', async function(){


        try{
            const response = await fetch('http://localhost:8080/api/user/courses',{
                method: 'GET',
                credentials: 'include'
            });
            if(response.ok){
                window.location.href = '/user/courses';
            }
            else{
                formLogin.addEventListener('submit', handlerLoginForSubmit);

                return;
            }
        }catch(error){
            console.log('No authenticado')
        }
});


function switchForm(form, button){
    const containerButton =document.querySelector('.login-register-btn-container');
    button.classList.add('active');
    const buttons = containerButton.querySelectorAll('.btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const containerForm = document.querySelector('.container-form')
    if(form === 'login'){
        message.style.display = 'none';
        containerForm.replaceChildren();
        const formLogin = document.createElement('form');
        formLogin.classList.add('login-form');
        formLogin.id = 'login-form';
        formLogin.method = 'POST';
        formLogin.innerHTML = `
            <div class="inputs">
                <div class="input-group">
                    <label for="username">Usuario</label>
                    <input type="text" id="username" name="username" placeholder="Ingrese su usuario" required>
                </div>
                <div class="input-group">
                    <div class="password-label-reset">
                        <label for="password" >Contraseña</label>
                        <a href="/reset-password" class="reset-password">Olvidaste tu contraseña?</a>
                    </div>
                    <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" required >
                </div>
                <button class="send-btn" type="submit">Iniciar Sesión</button>
            </div>
        `;
        containerForm.appendChild(formLogin);
        formLogin.addEventListener('submit', handlerLoginForSubmit);

    }else{
        message.style.display = 'none';
        containerForm.replaceChildren();
        const formRegister = document.createElement('form');
        formRegister.classList.add('register-form');
        formRegister.id = 'register-form';
        formRegister.method = 'POST';
        formRegister.innerHTML = `
            <div class="inputs">
                <div class="input-group-double">
                    <div class="input-group">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" name="name" placeholder="Ingrese su usuario" required>
                    </div>
                    <div class="input-group">
                        <label for="lastname">Apellido</label>
                        <input type="text" id="lastname" name="lastname" placeholder="Ingrese su usuario" required>
                    </div>
                </div>
                <div class="input-group">
                    <label for="username">Usuario</label>
                    <input type="text" id="username" name="username" placeholder="Ingrese su usuario" required>
                </div>
                <div class="input-group">
                    <label for="email" >Correo electrónico</label>
                    <input type="email" id="email" name="email" placeholder="Ingrese su contraseña" required>
                </div>                
                <div class="input-group">
                    <label for="password" >Contraseña</label>
                    <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" required>
                    <span class="info">La contraseña debe tener al menos 8 caracteres</span>
                </div>
                <button class="send-btn" type="submit">Registrarse</button>
            </div>
        `;
        containerForm.appendChild(formRegister);
        formRegister.addEventListener('submit', handlerRegisterForSubmit);
    }

}




async function handlerLoginForSubmit(e)  {  
    e.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const loginData= {
        username: username,
        password: password
    }


    try{
        const response = await fetch('http://localhost:8080/api/login',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        })
        if(!response.ok){
            throw new Error('Error en la solicitud de inicio de sesión');
            return;
        }

        window.location.href = '/user/courses'

    }catch(error){
        console.error('Error:', error);
        message.style.display = 'flex';
        message.innerHTML = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    };
    e.target.reset();
}


async function handlerRegisterForSubmit(e)  {    
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const lastname = document.querySelector('input[name="lastname"]').value;
    const username = document.querySelector('input[name="username"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const registerData= {
        name: name,
        lastname: lastname,
        username: username,
        email: email,
        password: password
    }
    try{
        const response = await fetch('http://localhost:8080/api/register',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData),
            credentials: 'include'
        })
        if(!response.ok){
            throw new Error('Error en la solicitud de registro');
            return;
        }

        window.location.href = '/user/courses'
    }catch(error){
        console.error('Error:', error);
        message.style.display = 'flex';
        message.innerHTML = 'Error al registrar. Por favor, verifica tus credenciales.';
    }
    e.target.reset();
}