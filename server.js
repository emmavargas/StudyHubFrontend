const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.static(path.join(__dirname, 'page')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'index.html'));
});

app.get('/how-it-works', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'how-it-works.html'));
    
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'register.html'));
    
});

app.get('/reference', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'reference.html'));
    
});


app.get('/user/courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'main-page.html'));
});

app.get('/user/courses/:id', (req, res) => {
    const idCourse = req.params.id;
    res.sendFile(path.join(__dirname, 'page', 'details-course.html'));
});


app.get('/user/courses/:id/exam-ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'exam-ai.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
