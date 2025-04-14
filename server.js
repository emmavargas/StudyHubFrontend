const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para parsear JSON
//app.use(express.json());

// Servir archivos estáticos desde 'assets'
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Servir archivos estáticos desde 'page'
app.use(express.static(path.join(__dirname, 'page')));

// Ruta raíz que redirige a index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'index.html'));
});

// Ruta para /user/courses que sirve main-page.html
app.get('/user/courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'main-page.html'));
});

app.get('/user/courses/:id', (req, res) => {
    const idCourse = req.params.id; // Captura el id desde la URL
    // Aquí puedes hacer algo con idCourse si lo necesitas (por ejemplo, guardarlo o usarlo para lógica del servidor)
    res.sendFile(path.join(__dirname, 'page', 'details-course.html'));
});


app.get('/user/courses/:id/exam-ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'exam-ai.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
