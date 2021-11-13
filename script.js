// declare quizApp object
const quizApp = {}

// define quizApp properties + empty placeholders
quizApp.url = 'https://restcountries.com/v3.1/all';
quizApp.shuffledCountries = [];
quizApp.topTen = [];
quizApp.flagArray = [];
quizApp.answerBank = {
    names: [],
    capitals: [],
    populations: []
};

// quizApp Method Declarations  ⬇️

// init(): to be called when the page is loaded, at the end of the file
quizApp.init = () => {
    quizApp.getData();
}

// getData(): gets countries data from API via fetch api -> call methods to process that data -> manipulate the DOM
quizApp.getData = () => {
    fetch(quizApp.url).then((response) => {
        return response.json();
    }).then((data) => {

        quizApp.shuffledCountries = shuffleArray(data);

        quizApp.getCountries(quizApp.shuffledCountries, 10);
        quizApp.getAnswers(quizApp.shuffledCountries)
        quizApp.getFlags(quizApp.topTen);
        quizApp.displayFlagQ();
        quizApp.startButton();
        quizApp.submitQuiz();
    })
}

// getCountries(array, numOfCountries): store 10 countries from the top of the shuffled countries array. option customize the number to retrieve with numOfCountries to be dynamic for future use
quizApp.getCountries = (array, numOfCountries) => {
    for (let i = 0; quizApp.topTen.length < numOfCountries; i++) {
        if (array[i].capital != undefined) {
            quizApp.topTen.push(array[i]);
        }
    }
}

// getAnswers(array): populate answer bank using data from the unselected countries (all the countries below the top ten)
quizApp.getAnswers = (array) => {
    for (let i = 10; i < array.length; i++) {
        quizApp.answerBank.names.push(array[i].name.common)
        if (array[i].capital != undefined) {
            quizApp.answerBank.capitals.push(array[i].capital[0])
        }
        quizApp.answerBank.populations.push(array[i].population)
    }
}

// getFlags(array): retrives the image url from the country array of objects 
quizApp.getFlags = (array) => {
    array.forEach(item => {
        quizApp.flagArray.push(item.flags.png);
    })
}

// displayFlagQ(): displays flags from selectedCountries onto the questions page with an image element
quizApp.displayFlagQ = () => {
    const questionBox = document.getElementById('questionPack')

    for (let i = 0; i < quizApp.topTen.length; i++) {
        const questionCard = document.createElement('div')
        questionCard.className = 'questionCard'
        questionCard.innerHTML = `
            <h2>Question ${i + 1}</h2> 
            <h3> What country does this flag belong to?</h3> 
            <img src='${quizApp.topTen[i].flags.png}' alt='flag of ${quizApp.topTen[i].name.common}'>
            `

        const answerArray = []; // [1, 2, 3, 4]
        answerArray.push(quizApp.topTen[i].name.common);
        for (let j = 0; j < 3; j++) {
            answerArray.push(quizApp.answerBank.names.pop())
        }
        shuffleArray(answerArray);

        const answerBox = document.createElement('div');
        answerBox.className = 'answerBox';

        answerArray.forEach(answer => {
            const btnBox = document.createElement('div');
            btnBox.innerHTML = `<input type="radio" name="answers${i + 1}" id="${answer}">
                    <label for="${answer}">${answer}</label>`
            answerBox.appendChild(btnBox);
        })

        questionCard.appendChild(answerBox);
        questionBox.appendChild(questionCard);
    }

    const submitButton = document.createElement('button')
    submitButton.className = 'uppercase'
    submitButton.id = 'submitBtn'
    submitButton.innerHTML = '<p>Submit Quiz</p>'
    questionBox.appendChild(submitButton)

    quizApp.checkTextLength();

}

quizApp.startButton = () => {
    const firstButton = document.getElementById("startButton")
    // add event listener to display question page to flex and landing page to none
    firstButton.addEventListener('click', () => {
        console.log(this)
        document.querySelector('.landingPage').style.display = 'none',
            document.querySelector('.questionPage').style.display = 'flex'
    })
}

quizApp.checkTextLength = () => {
    const allAnswers = document.querySelectorAll('label');
    allAnswers.forEach(item => {
        // if (item.textContent.length > 20) {
        //     const label = document.getElementById(item.textContent)
        //     label.nextElementSibling.style.fontSize = '14px';
        //     console.log(label);
        // } else 
        if (item.textContent.length > 16) {
            const label = document.getElementById(item.textContent)
            label.nextElementSibling.style.fontSize = '18px';
            label.nextElementSibling.style.lineHeight = '20px';
            label.nextElementSibling.style.padding = '4px';
        }
    })
}

quizApp.getScore = () => {

    let score = 0;

    for (let i = 1; i <= quizApp.topTen.length; i++) {
        const answerNodeList = document.querySelectorAll(`input[name='answers${i}']`);
        answerNodeList.forEach(item => {
            if (item.checked === true) {
                item.disabled = true;
                if (item.id === quizApp.topTen[i - 1].name.common) {
                    score = score + 1;
                    item.checked = false;
                    item.nextElementSibling.className = "correct";
                    console.log(item)
                } else{
                    item.checked = false;
                    item.nextElementSibling.className = "incorrect";
                }
            } else{
                item.disabled = true;
                if (item.id === quizApp.topTen[i - 1].name.common) {
                    item.nextElementSibling.className = "correct";
                    
            }}

        
        })
    }
    console.log(score)

    const scoreSheet = document.createElement('div');
        scoreSheet.className = "score";
        scoreSheet.innerHTML = `<h2>Your score is ${score} out of 10!`;
        questionPack.appendChild(scoreSheet);

    const restartBtn = document.createElement('button');
        restartBtn.className = "uppercase restart";
        restartBtn.innerText = "Restart"
        scoreSheet.appendChild(restartBtn);
}

quizApp.displayScore = () => {
    getScore();
}


    // run getScore
    // append to HTML, dom stuff with score/10
    // append to questionPack

quizApp.submitQuiz = () => {
    // event listener for the submit button
    // runs displayScore
    const submitBtn = document.getElementById('submitBtn')
    submitBtn.addEventListener('click', () => {
        quizApp.getScore();
        submitBtn.style.display = 'none';




    })
}

// Durstenfeld Shuffle algorithm, used to shuffle our retrieved countries array of objects to make sure we get different questions each run
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// calling the quizApp
quizApp.init();