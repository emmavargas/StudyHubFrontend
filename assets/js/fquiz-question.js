const url = new URL(window.location.href);
const urlParams = url.pathname.split('/').filter(segment => segment);
const idCourse =urlParams[urlParams.length - 2];

let countQuestions;
let percentExam;
let percentConexionAi;
let numberQuestion;
let answerQuestionUser;
let answerQuestionExam;
let questionList;
let flagIncremetCoount

let questionSelect;

document.addEventListener('DOMContentLoaded', async() =>{
    countQuestions = 0;
    percentExam = 0;
    numberQuestion = 0;
    answerQuestionUser = [];
    answerQuestionExam = [];
    questionList = [];
    percentConexionAi = 0;
    let courseExamen;
    flagIncremetCoount = false;

    try{
        const response = await fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials:'include'
        });

        if(!response.ok){
            if (response.status === 403) {
                throw { name: 'ForbiddenError', status: response.status, message: 'Acceso denegado por cookies' };
            } else {
                throw { name: 'HttpError', status: response.status, message: response.statusText };
            }       
        }
        const dataCourse = await response.json();
        const courseTile = dataCourse.course;
        const topicsTitle = dataCourse.topics.map(topic => topic.title);

        courseExamen = {
            course: courseTile,
            topics: topicsTitle
        };

        const dataExam = await loadingPage(courseExamen);

        if(dataExam.status ===429){
            throw { name: 'Too Many Requests', status: dataExam.status, message: 'Limite de solicitudes' };
        }
        else{

        }

        questionList = dataExam.items;
        
        answerQuestionExam = questionList.map(item => {
            let optionCorrect = -1;
            const optionsArray = item.options;
            
            for (let i = 0; i < optionsArray.length; i++) {
                if (optionsArray[i] === item.answer) {
                    optionCorrect = i;
                    break;
                }
            }
            return optionCorrect;
        });
        loadQuestion()


    }catch(error){
        if(error.status === 403){
            window.location.href='/'
        }else if(error.status ===429){
            toManyRequest();
        }
        else{
            ErrorConnectionAi();
        }
    }
    
});

function loadQuestion(){
    const inputs = document.querySelectorAll('input[name="option"]');
    inputs.forEach(input => input.checked = false);

    const question = document.getElementById('question');  
    const options1 = document.getElementById('asd1');
    const options2 = document.getElementById('asd2');
    const options3 = document.getElementById('asd3');
    const options4 = document.getElementById('asd4');


    question.textContent = questionList[numberQuestion].question;
    options1.textContent = questionList[numberQuestion].options[0];
    options2.textContent = questionList[numberQuestion].options[1];
    options3.textContent = questionList[numberQuestion].options[2];
    options4.textContent = questionList[numberQuestion].options[3];
    
    
}

function responseQuestion(input){
    questionSelect = input.value-1;
    const countQuestionExam = document.querySelector('.count-question-exam');
    const percentageExam = document.querySelector('.percentage-exam');
    const progressBar = document.getElementById('progress-bar');
    if(!flagIncremetCoount){
        countQuestions = countQuestions + 1;
        percentExam = (countQuestions / questionList.length) * 100;
        countQuestionExam.textContent = `Pregunta ${countQuestions} de ${questionList.length}`;
        percentageExam.textContent = `Porcentaje ${percentExam}%`;
        progressBar.style.setProperty('--progress', `${percentExam}%`);
        flagIncremetCoount = true;
    }
    
}


function nextQuestion(){
    const option = document.querySelector('input[name="option"]:checked');
    if(!option){
        return;
    }else{
        if(numberQuestion<9){
            answerQuestionUser.push(questionSelect)
            numberQuestion = numberQuestion + 1;
            loadQuestion();
            flagIncremetCoount = false;
        }
        else{
            const btn = document.querySelector('.btn-next-finish');
            btn.textContent = 'Terminar';
            answerQuestionUser.push(questionSelect)
            resultExam();
        }
    }
}

function resultExam(){
    const feetbackContainerHtml = document.querySelector('.feedback-container');
    const result = compareResult();
    const questionCorrect = result.reduce((total, value)=> value ===1? total+1: total,0);
    const questionIncorrect = result.reduce((total, value)=> value ===0? total+1: total,0);
    const percentExamCorrect = (questionCorrect / questionList.length) * 100;
    const divLoading = document.getElementById('loading');
    const divPage = document.getElementById('page-load');
    const divResult = document.getElementById('result-container');
    divLoading.style.display = 'none';
    divPage.style.display = 'none';
    divResult.style.display = 'flex';

    const containerPercentageExamHtml = document.querySelector('.container-percentage');
    const percentageExamHtml = document.getElementById('percentage-exam-result');
    percentageExamHtml.textContent = `${percentExamCorrect}%`;
    
    const textPercentageExamHtml = document.getElementById('text-percentage-exam-result');

    if(percentExamCorrect>=70 && percentExamCorrect<100){
        textPercentageExamHtml.textContent = "¡Muy bien! Casi lo logras.";
        textPercentageExamHtml.style.color = "#16a34a"
        containerPercentageExamHtml.style.border = "10px #16a34a solid"
    }else if(percentExamCorrect<70 && percentExamCorrect>=40){
        textPercentageExamHtml.textContent = "Bien, pero aún puedes mejorar.";
        textPercentageExamHtml.style.color = "#f59e0b"
        containerPercentageExamHtml.style.border = "10px #f59e0b solid"
    }else if(percentExamCorrect === 100){
        textPercentageExamHtml.textContent = "¡Felicidades! Lo lograste por completo.";
        textPercentageExamHtml.style.color = "#16a34a"
        containerPercentageExamHtml.style.border = "10px #16a34a solid"
    }else{
        textPercentageExamHtml.textContent = "Necesitas repasar más";
        textPercentageExamHtml.style.color = "#dc2626"
        containerPercentageExamHtml.style.border = "10px #dc2626 solid"
    }

    const numberCorrectAnwserHtml = document.getElementById('number-correct-answers');
    const numberIncorrectAnswerHtml = document.getElementById('number-incorrect-answers');

    numberCorrectAnwserHtml.textContent = questionCorrect;
    numberIncorrectAnswerHtml.textContent = questionIncorrect;

    for(let i=0;i < result.length; i++){
        if(result[i]=== 1){
            
            const feetbackItemCorrect = document.createElement('div');
            feetbackItemCorrect.classList.add('feedback-item');
            feetbackItemCorrect.innerHTML = `
                <div class="anwser-correct-item">
                    <img src="/assets/img/correct.svg" alt="Respuesta correcta">
                    <h4>${questionList[i].question}</h4>
                </div>
                <span>Tu respuesta: ${questionList[i].options[answerQuestionUser[i]]}</span>
            `
            feetbackContainerHtml.appendChild(feetbackItemCorrect);
        }else{
            const feetbackItemIncorrect = document.createElement('div');
            feetbackItemIncorrect.classList.add('feedback-item');
            feetbackItemIncorrect.innerHTML = `
                <div class="anwser-incorrect-item">
                    <img src="/assets/img/incorrect.svg" alt="Respuesta correcta">
                    <h4>${questionList[i].question}</h4>
                </div>
                <span>Tu respuesta: ${questionList[i].options[answerQuestionUser[i]]}</span>
                <span style="color:#16a34a">Respuesta correcta: ${questionList[i].answer}</span>
            `
            feetbackContainerHtml.appendChild(feetbackItemIncorrect);
        }
    }
    

}

function compareResult(){
    const resultAnswer = [];
    for(let i = 0; i < answerQuestionUser.length; i++){
        if(answerQuestionUser[i] === answerQuestionExam[i]){
            resultAnswer.push(1);
        }else{
            resultAnswer.push(0);
        }
    }
    return resultAnswer;
}


async function loadingPage(courseExamen){
    
    let contador =0;
    const progressBarValue = document.getElementById('progress-bar-ai');
    const informationProgress = document.querySelector('.information-connection-ai');
    textProgress = ["Conectando con IA...","Analizando datos...","Generando preguntas...","Creando examen...","¡Todo listo!"];


    function animarPantallaCarga() {
        return new Promise(resolve => {
            informationProgress.textContent = textProgress[contador];
            informationProgress.style.transform = 'translateY(0)';
            informationProgress.style.opacity = '1';
            contador++;

            const interval = setInterval(() => {
                percentConexionAi += 25;
                progressBarValue.style.setProperty('--progress', `${percentConexionAi}%`);
                if (contador < textProgress.length) {
                    informationProgress.textContent = textProgress[contador];
                    informationProgress.style.transform = 'translateY(0)';
                    informationProgress.style.opacity = '1';
                    contador++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 3500);
        });
    }
    const animation = animarPantallaCarga();

    const responseExam = fetch(`https://studyhub.emmanueldev.com.ar/api/user/courses/${idCourse}/generar-examen`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseExamen),
        credentials:'include'
    })

    const responseInvalidTime =await responseExam;
    if(responseInvalidTime.status===429){
        return responseExam;
    }

    const [response] = await Promise.all([responseExam, animation])
    const divLoading = document.getElementById('loading');
    const divPage = document.getElementById('page-load');

    if(response.status === 200){
        divLoading.style.display = 'none'
        divPage.style.display = 'flex';
        return response.json();
    }else{
        return response;
    }
}

function restartExam() {
    countQuestions = 0;
    percentExam = 0;
    numberQuestion = 0;
    answerQuestionUser = [];
    percentConexionAi = 0;
    flagIncremetCoount = false;

    const divLoading = document.getElementById('loading');
    const divPage = document.getElementById('page-load');
    const divResult = document.getElementById('result-container');
    const feedbackContainerHtmlRestart = document.querySelector('.feedback-container')

    divResult.style.display = 'none';
    divLoading.style.display = 'none';
    divPage.style.display = 'flex';

    const countQuestionExam = document.querySelector('.count-question-exam');
    const percentageExam = document.querySelector('.percentage-exam');
    const progressBar = document.getElementById('progress-bar');
    const btnNextFinish = document.querySelector('.btn-next-finish');

    countQuestionExam.textContent = `Pregunta ${countQuestions + 1} de ${questionList.length}`;
    percentageExam.textContent = `Porcentaje ${percentExam}%`;
    progressBar.style.setProperty('--progress', `${percentExam}%`);
    feedbackContainerHtmlRestart.innerHTML = `
        <h3>Revision de respuestas:</h3>
    `

    const inputs = document.querySelectorAll('input[name="option"]');
    inputs.forEach(input => input.checked = false);

    if (btnNextFinish) {
        btnNextFinish.textContent = 'Siguiente pregunta';
    }

    loadQuestion();
}



function ErrorConnectionAi(){
    const divLoading = document.getElementById('loading');
    const divPage = document.getElementById('page-load');
    const divResult = document.getElementById('result-container');
    const divError = document.querySelector('.error-container');
    divLoading.style.display = 'none';
    divPage.style.display = 'none';
    divResult.style.display = 'none';
    divError.style.display = 'flex';

    divError.innerHTML = `
        <div class="title-error-container">
            <h3>Error al cargar el examen</h3>
            <img src="/assets/img/error-connection.svg" alt="Error de conexion">
        </div>
        <img class="icon-big" src="/assets/img/error-connection.svg" alt="Error de conexion">
        <span>No se pudo generar el examen. Por favor, intenta nuevamente en unos minutos; si el problema persiste, reintenta más tarde.</span>
        <div class="container-btn-error">
            <button class="reload-connection-btn" onclick="reloadPage()">Reintentar</button>
            <button class="back-course" onclick="window.location.href='/user/courses'">Volver a Cursos</button>
        </div>
    `


}


function toManyRequest(){
    const divLoading = document.getElementById('loading');
    const divPage = document.getElementById('page-load');
    const divResult = document.getElementById('result-container');
    const divError = document.querySelector('.error-container');
    divLoading.style.display = 'none';
    divPage.style.display = 'none';
    divResult.style.display = 'none';
    divError.style.display = 'flex';
    
    divError.innerHTML = `
        <div class="title-error-container">
            <h3>Error al cargar el examen</h3>
            <img src="/assets/img/error-connection.svg" alt="Error de conexion">
        </div>
        <img class="icon-big" src="/assets/img/error-connection.svg" alt="Error de conexion">
        <span>Has alcanzado el límite gratuito de exámenes diarios. Podrás realizar más exámenes en 30 minutos o suscribirte para acceder sin restricciones.</span>
        <div class="container-btn-error">
            <button class="reload-connection-btn" id="suscribirse" onclick="iniciarSuscripcion()">Suscribirse</button>
            <button class="back-course" onclick="window.location.href='/user/courses'">Volver a Cursos</button>
        </div>
    `
}
    
function reloadPage(){
    window.location.href = `/user/courses/${idCourse}/exam-ai`
}

async function iniciarSuscripcion() {
    try {
        const response = await fetch('https://studyhub.emmanueldev.com.ar/api/payment', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Para enviar cookies de autenticación
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud de pago: ${response.status}`);
        }

        const paymentUrl = await response.text(); // La URL de Mercado Pago (sandbox init point)
        window.location.href = paymentUrl; // Redirige al usuario a la página de pago
    } catch (error) {
        console.error('Error al iniciar suscripción:', error);
        alert('No se pudo iniciar la suscripción. Por favor, intenta de nuevo más tarde.');
    }
}