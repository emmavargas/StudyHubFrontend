const pasos = [
    
    `<div>
      <h3>Recupere su cuenta</h3>
    </div>
    <p>Podemos ayudarte a reestablecer tu contraseña y la información de seguridad. Primero escribe tu correo electrónico.</p>
        <div class="error-password">
            <span></span>
        </div>
        <div class="form-group">
            <input type="email" id="email" placeholder="Correo electrónico" required>
        </div>
        <div class="buttons">
            <button type="button" class='back' onclick="cancelar()">Cancelar</button>
            <button type="button" class='next' onclick="pasoSiguiente()">Continuar</button>
        </div>
    `,
    `
    <div>
      <h3>Código de seguridad</h3>
    </div>
    <p>Hemos enviado un código de verificación a tu correo electrónico (tucorreo@ejemplo.com).</p>
    <br>
    <p>Por favor, revisa tu bandeja de entrada (y la carpeta de spam o correo no deseado si no lo encuentras), e ingresa el código en el campo a continuación para reestablecer tu contraseña</p>
    <p>Si no solicitaste este cambio, ignora este mensaje o contacta con nuestro soporte.</p>
    <div class="error-password">
        <span></span>
    </div>
    <div class="form-group">
        <input type="text" id="codigo" placeholder="Código de confirmación" required>
    </div>
    <div class="buttons">
        <button type="button" class='back' onclick="pasoAnterior()">Volver</button>
        <button type="button" class='next' onclick="pasoSiguiente()">Continuar</button>
    </div>`,
    `
    <div>
      <h3>Nueva contraseña</h3>
    </div>
    <div class="error-password">
        <span></span>
    </div>    
    <p>Ingresa tu nueva contraseña.</p>
    <div class="form-group">
        <input type="password" id="newpass" placeholder="Nueva contraseña" required>
    </div>
    <div class="form-group">
        <input type="password" id="repeatpass" placeholder="Repetir nueva contraseña" required>
    </div>
        <div class="buttons">
            <button type="button" class='back' onclick="pasoAnterior()">Volver</button>
            <button type="button" class='next'onclick="pasoSiguiente()">Finalizar</button>
    </div>`
]

let pasoActual = 0;
let email = 'hola';
let code = '123456';
let newPassword = '';
let confirmNewPassword = '';

const mostrarPaso = (i)=> {
    const container = document.getElementById('paso');
    container.classList.remove('active');

    setTimeout(() => { //esto le da como una especie de animacion a cada paso
    container.innerHTML = pasos[i];
    container.classList.add('active');
  }, 100);
  

}
mostrarPaso(pasoActual)

const pasoSiguiente = ()=> {
    if (pasoActual <= pasos.length-1) {
        console.log(pasoActual);
        if(pasoActual === 0){
            console.log('Paso 1');
            const inputEmail = document.getElementById('email');

            console.log(inputEmail.value);
            email = inputEmail.value;
            emailSendCode(email);

        }else if(pasoActual ===1){
            console.log('Paso 2');
            const inputCode = document.getElementById('codigo');
            code = inputCode.value;
            verifyCode();
            console.log(inputCode.value);
        
        }else if(pasoActual === 2){
            console.log('Paso 3');
            const inputNewPassword = document.getElementById('newpass');
            const inputConfirmNewPassword = document.getElementById('repeatpass');
            newPassword = inputNewPassword.value;
            confirmNewPassword = inputConfirmNewPassword.value;
            resetPassword();
            console.log(newPassword);
            console.log(confirmNewPassword);
        }
    }
}

const pasoAnterior = ()=> {
    if (pasoActual > 0) {
        pasoActual--;
        mostrarPaso(pasoActual);
    }
}

const cancelar = ()=> {
    pasoActual = 0
    window.location.href = '/'
}



async function emailSendCode(email){

    const data = {
        email: email
    }

    try{
        const response = await fetch('http://localhost:8080/api/recovery-password/send-email-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
        const errorMessage = document.querySelector('.error-password');
        const responseData = await response.json();

        console.log("entro a funcion send email");

        if(response.ok){
            pasoActual++;
            mostrarPaso(pasoActual);
            console.log('entre a enviar el email');
            console.log(responseData);
            console.log(responseData.message);
        }
        if (!response.ok) {
            errorMessage.style.display = 'flex';
            const errorText = errorMessage.querySelector('span');
            errorText.innerHTML = responseData.message;
        }
    }catch(error){
        console.log(error);

    }

}

async function verifyCode(){
    const data = {
        email: email,
        code: code
    }

    try{
        const response = await fetch('http://localhost:8080/api/recovery-password/confirmation-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
        const errorMessage = document.querySelector('.error-password');
        const responseData = await response.json();
        if(response.ok){
            pasoActual++;
            mostrarPaso(pasoActual);
            console.log('entre a verificar el codigo');
            console.log(responseData);
            console.log(responseData.message);
        }
        if (!response.ok) {
            errorMessage.style.display = 'flex';
            const errorText = errorMessage.querySelector('span');
            errorText.innerHTML = responseData.message;
        }

    }catch(error){
        console.log(error);

    }
}

async function resetPassword(){
    console.log('entre a reset password');
    const data = {
        email: email,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
    }

    try{
        const response = await fetch('http://localhost:8080/api/recovery-password/reset-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
        const errorMessage = document.querySelector('.error-password');
        const responseData = await response.json();

        if(response.ok){
            pasoActual++;
            window.location.href = '/auth';
        }
        if (!response.ok) {
            errorMessage.style.display = 'flex';
            const errorText = errorMessage.querySelector('span');
            errorText.innerHTML = responseData.message;
        }
    }catch(error){
        console.log(error);

    }
}