
async function logoutSesion() {
    try {
        const response = await fetch('https://studyhub.emmanueldev.com.ar/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Error al cerrar sesión');
        }
        window.location.href = '/';
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/';
    }
}
