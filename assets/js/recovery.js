const pasos = [
    
    `<div>
      <h3>Recupere su cuenta</h3>
    </div>
    <p>Podemos ayudarte a reestablecer tu contraseña y la información de seguridad. Primero escribe tu correo electrónico.</p>
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
    <p>Ingresa tu nueva contraseña.</p>
    <div class="form-group">
        <input type="password" id="newpass" placeholder="Nueva contraseña" required>
    </div>
    <div class="form-group">
        <input type="password" id="repeatpass" placeholder="Repetir nueva contraseña" required>
    </div>
        <div class="buttons">
            <button type="button" class='back' onclick="pasoAnterior()">Volver</button>
            <button type="button" class='next'>Finalizar</button>
    </div>`
]

let pasoActual = 0;

const mostrarPaso = (i)=> {
    const container = document.getElementById('paso');
    container.classList.remove('active');

    setTimeout(() => { //esto le da como una especie de animacion a cada paso
    container.innerHTML = pasos[i];
    container.classList.add('active');
  }, 100);
}

const pasoSiguiente = ()=> {
    if (pasoActual < pasos.length-1) {
        pasoActual++;
        mostrarPaso(pasoActual);
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
    window.location.href = '/page/index.html'
}


mostrarPaso(pasoActual)