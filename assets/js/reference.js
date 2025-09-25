document.addEventListener('DOMContentLoaded', async function(){

    try{
        const response = await fetch('https://studyhub.emmanueldev.com.ar/api/user/courses',{
            method: 'GET',
            credentials: 'include'
        });
        
        if(response.ok){
            // Usuario autenticado - mostrar Perfil y Salir
            const stateLogin = document.querySelector('.nav-actions');
            stateLogin.innerHTML = `
                <nav>
                    <button class="profile" type="button" onclick="window.location.href='/profile'">
                        <img src="/assets/img/profile.svg" alt="perfil">
                        <span>Perfil</span>
                    </button>     
                    <button class="exit" type="button" onclick="logoutSesion()">
                        <img src="/assets/img/logout.svg" alt="salir">
                        <span>Salir</span>
                    </button>            
                </nav>       
            `;
        } else {
            // Usuario no autenticado - mantener Login y Registro
            console.log('Usuario no autenticado - manteniendo botones originales');
        }

    } catch(error) {
        console.log('No autenticado:', error);
        // En caso de error, mantener los botones originales (Login/Registro)
    }
});

// Función para cerrar sesión
async function logoutSesion() {
    try {
        const response = await fetch('https://studyhub.emmanueldev.com.ar/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error en logout:', error);
        // Redirigir de todos modos en caso de error
        window.location.href = '/';
    }
}