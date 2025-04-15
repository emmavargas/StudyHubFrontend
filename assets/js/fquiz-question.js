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
    
    const token = localStorage.getItem('token');
    console.log(token);
    if(!token){
        window.location.href = "/";
        return;
    }else{
        try{
            loadingPage(-1);
            const response = await fetch(`http://localhost:8080/user/courses/${idCourse}`, {
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
            });

            if(!response.ok){
                if (response.status === 403) {
                    throw { name: 'ForbiddenError', status: response.status, message: 'Acceso denegado por token' };
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


            const responseExam = await fetch(`http://localhost:8080/user/courses/${idCourse}/generar-examen`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseExamen)
            })
            if(!responseExam.ok){
                if (responseExam.status === 403) {
                    throw { name: 'ForbiddenError', status: 403, message: 'Acceso denegado por token' };
                } else {
                    throw { name: 'HttpError', status: responseExam.status, message: responseExam.statusText };
                }            
            }

            const dataExam = await responseExam.json();
            console.log('antes de la respuesta')

            loadingPage(dataExam);
            console.log('despues de la respuesta')

            questionList = dataExam.items;
            console.log(questionList)
            
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
            console.log(dataExam);
            loadQuestion()


        }catch(error){
            if(error.status === 403){
                window.location.href='/'
            }
            else{
                console.log("prueba")
                ErrorConnectionAi();
            }
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
    console.log(answerQuestionUser);
    console.log(answerQuestionExam);
    console.log(resultAnswer);
    return resultAnswer;
}


function loadingPage(infoDataExam){
    if(infoDataExam==-1){
        const progressBarValue = document.getElementById('progress-bar-ai');
        const informationProgress = document.querySelector('.information-connection-ai');
        let contador =0;
        textProgress = ["Conectando con IA...","Analizando datos...","Generando preguntas...","Creando examen...","¡Todo listo!"];
        informationProgress.textContent=textProgress[contador];
        informationProgress.style.transform = 'translateY(0)';
        informationProgress.style.opacity ='1';
        contador = contador +1;
        const interval = setInterval(()=>{
            percentConexionAi = percentConexionAi +25;
            progressBarValue.style.setProperty('--progress', `${percentConexionAi}%`)
            informationProgress.textContent=textProgress[contador];
            informationProgress.style.transform = 'translateY(0)';
            informationProgress.style.opacity ='1';
            
            contador = contador+1;
            if(contador ===6){
                clearInterval(interval);
                const divLoading = document.getElementById('loading');
                const divPage = document.getElementById('page-load');
            
                if(infoDataExam){
                    divLoading.style.display = 'none';
                    divPage.style.display = 'flex';
                }else{
                    divLoading.style.display = 'flex'
                    divPage.style.display = 'none';
                }
            }
        },3500)
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
}

function reloadPage(){
    window.location.href = `/user/courses/${idCourse}/exam-ai`
}