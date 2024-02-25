// import questionBank from "./Question_with_level.js";
import chapter1 from './Question Bank/gravitation_que.js'
import chapter2 from './Question Bank/Periodic_Classification_of_Element.js'
import chapter3 from './Question Bank/Chemical_Reactions_and_Equations.js'
import chapter4 from './Question Bank/Effects_of_Electric_Current.js'
import chapter5 from './Question Bank/Heat.js'
import chapter6 from './Question Bank/Refraction_of_Light.js'
import chapter7 from './Question Bank/Lenses.js'
import chapter8 from './Question Bank/Metallurgy.js'
import chapter9 from './Question Bank/Carbon_Compounds.js'
import chapter10 from './Question Bank/Space_Missions.js'
import chapter11 from './Question Bank/Heredity_and_Evolution.js'
import chapter12 from './Question Bank/Life_Processes_in_Living_Organisms_Part_1.js'
import chapter13 from './Question Bank/Life_Processes_in_Living_Organisms_Part_2.js'
import chapter14 from './Question Bank/Environmental_Management.js'
import chapter15 from './Question Bank/Towards_Green_Energy.js'
import chapter16 from './Question Bank/Animal_Classification.js'
import chapter17 from './Question Bank/Introduction_to_Microbiology.js'
import chapter18 from './Question Bank/Cell_Biology_and_Biotechnology.js'
import chapter19 from './Question Bank/Social_Health.js'
import chapter20 from './Question Bank/Disaster_Management.js'
import InitialRespose from "./initialResponse.js";
import large_que_bank from "./Question Bank/180_que_gravitation.js"
import Result from './Result.js'
import Topic from './Question Bank/topic_id_wise_gravtitation.js'

let questionBank ;
const question = document.getElementById('question');
const optionA = document.getElementById('a');
const optionB = document.getElementById('b');
const optionC = document.getElementById('c');
const optionD = document.getElementById('d');
const save_next = document.getElementById(`save_next`);
const clear = document.getElementById(`clear`);
const skip_ans_later = document.getElementById(`skip_answer_later`);
const buttonContainer = document.getElementById('status-button');
const level_tag = document.getElementById('level');
const sublevel_tag = document.getElementById('sublevel');
const correct_tag = document.getElementById('correct');
// // time decreasing code *********************
const show_time = document.getElementById('timer');
const avg_time_tag = document.getElementById('avg_time');
const seating_capacity_tag = document.getElementById('seating_capacity');
const time_per_que_tag = document.getElementById('time_per_que');
let TEST_TIME = 30*60; 
const NUMBER_OF_QUESTIONS = 5;
const RANDOM_SELECTION_LIMIT = 10;
const RANDOM_OPTION = false;
const RANDOM_SELECTION_AFTER_VISITED_FIND = 5;
const SHOW_AVG_QUE_TIME =true;
const SHOW_CURRECT_ANS= false;
const SHOW_CORRECT_COUNT = true;
const TRANSFER_DATA_IN_ENCODING = true;
const SHOW_WEIGHT = true;
const SHOW_WEIGHT_IN_PERCENT = false;
const SHOW_QUESTION_BUTTONS = true;

let numberOfQuestion = NUMBER_OF_QUESTIONS;
let hours;
let minutes;
let seconds;
async function fetchSeatingLimitAndUpdateValues() {
    try {
      const response = await fetch('/api/getSeatingLimit');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Parse response body as JSON
  
      console.log('Received result from server:', data);
      if (data.number > 0) {
        
        return data.number; // Return the number received from the server
      } else {
        console.log('No valid data received from the server or number is not greater than 0.');
        return null; // Return null if no valid data is received
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; // Return null in case of an error
    }
  }

  let previous_t = await fetchSeatingLimitAndUpdateValues()
  if(previous_t>0) {
    TEST_TIME = previous_t;
        
    numberOfQuestion += 2; 
    hours = Math.floor(TEST_TIME / 3600);
    minutes = Math.floor((TEST_TIME % 3600) / 60);
    seconds = TEST_TIME % 60;
  }
  console.log( "TEST_TIME : "+ TEST_TIME);

hours = Math.floor(TEST_TIME / 3600);
minutes = Math.floor((TEST_TIME % 3600) / 60);
seconds = TEST_TIME % 60;
let intervalID;
let total_time=0;
let previous_time=0;

let question_visit =0;
let Score = [];
let correct =0;
let incorrect =0;
let easy=0;
let medium =0; 
let hard =0;
let totalScore =0;
let selectedOption=-1;
let levels=[0,0,0];
let level_itr=0;
let result =[];
let question_count=0;
let chapter=0;
let current_que_time = 0;
let submit_under_five_sec = 0;

function decodeBase64(value) {
    return atob(value);
}
function decodeDataFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedquestion_count = urlParams.get('question_count');
        const encodedchapter = urlParams.get('chapter');
    
        // Assign decoded data to the same variable names
         question_count = parseInt(decodeBase64(encodedquestion_count));
         chapter = parseInt(decodeBase64(encodedchapter));

    // Now you can use 'question_count' and 'chapter'
    console.log(question_count, chapter);
}
decodeDataFromUrl()


questionBank = large_que_bank;


// update clock after every sec
function updateClock() {
    if(submit_under_five_sec<5)
    seating_capacity_tag.textContent=convert_sec_to_time(++total_time);
        if(minutes<0)
        minutes=59;
        if(seconds>0){
        seconds--;
        }else{
        seconds=59;
        if(minutes>0){
            minutes--;
        }else{
                minutes=59;
                hours--;
            }
        }
    if(hours<0){
        clearInterval(intervalID);
        visitDashboard();
    }else{
        const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        show_time.textContent = timeString;
    }
    time_per_que_tag.textContent = convert_sec_to_time(++current_que_time);    
}

updateClock();
intervalID=setInterval(updateClock,1000);
let previous_attempt ;
let previous_incorrect_que = [];

fetch('/api/getAttempts')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response body as JSON
  })
  .then(data => {
    console.log('Received result from server:', data);
    if (data.length > 0) { // Check if data array is not empty
      previous_attempt = data[data.length - 1]; // Assign last index object to previous_attempt
    for(let i=0;i<previous_attempt.length;i++){
        if(previous_attempt[i].Option_selected != previous_attempt[i].Correct)
        previous_incorrect_que.push(previous_attempt[i].Que_Txt)
    }
    } else {
      console.log('No previous attempt found.');
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });



console.log('Previous attempt:', previous_incorrect_que);
numberOfQuestion += previous_incorrect_que.length;



let index_itr=0;
let continuous_correct = 0;
let last_que_response = 0;
let present_que_response =0;
let visited_array = [];
// start with level 15
// find que from level
function findQueFromLevel(level){
    level = Math.ceil(level);
    console.log('Previous attempt:', previous_incorrect_que);
    // if (question_visit > 20) {
    //     save_next.disabled = true; 
    //     save_next.style.backgroundColor = '#dddddd';   
    // }
    let isQueLoaded = false;
    console.log("level : "+level + " "+typeof(level));
    for(let i=0;i<questionBank.length;i++){
        if(questionBank[i].sublevel==(level)){
            isQueLoaded = true;
            console.log("Que found");            
            loadQuestion(i);
        }
    }
    // if(isQueLoaded==false){
    //     console.log("Que Not found");
    //     if(last_que_response===1)
    //     findQueFromLevel(++level);
    //     else
    //     findQueFromLevel(--level);
    // }
}
let avg_time_other_student ;
// load the que
function loadQuestion(num) {
    index_itr = num;
    removeAllOptionStyles();
    if (num >= 0 && num <= questionBank.length) {
        if (!visited_array.includes(num)) {
            ++question_visit;
            selectedOption = -1;
            question.textContent = questionBank[num].question;
            let options = shuffle(questionBank[num].options.slice()); // Create a copy of the options array
            
            optionA.textContent = options[0];
            optionB.textContent = options[1];
            optionC.textContent = options[2];
            optionD.textContent = options[3];
            
            level_tag.textContent="Level : " + questionBank[num].level;
            let weight_of_que = Number.parseInt(questionBank[num].sublevel);
            if(SHOW_WEIGHT){
                if(SHOW_WEIGHT_IN_PERCENT){                    
                    sublevel_tag.textContent="Sublevel : "+ (weight_of_que*100)/180;
                }
                else
                sublevel_tag.textContent="Sublevel : "+ questionBank[num].sublevel;
            }
            if(SHOW_CORRECT_COUNT){
                correct_tag.textContent = "Correct : "+ correct;
            }
            avg_time_other_student = weight_of_que + Math.ceil(Math.random()*60);
            avg_time_tag.textContent = convert_sec_to_time(avg_time_other_student);
            if(SHOW_QUESTION_BUTTONS){
                let i = num;
                const button = document.createElement('button');
                button.className = 'circular-button';
                button.id = `que${i}`;                 
                button.style.display = 'inline-block';                
                buttonContainer.appendChild(button);                
            }
            visited_array.push(num);
            current_que_time =0;
            document.getElementById(`que${num}`).disabled = false;
        } else {
            console.log("Visited");
            if(last_que_response===1)
            findQueFromLevel(num + Math.ceil(Math.random()*RANDOM_SELECTION_AFTER_VISITED_FIND));
            else
            findQueFromLevel(num - Math.ceil(Math.random()*RANDOM_SELECTION_AFTER_VISITED_FIND));
        }

    }
}
// shuffle options
function shuffle (options) 
{
     for (let i = options.length - 1; i > 0; i--)
    {
        // Pick a random index from 0 to i inclusive
        let j = Math.floor(Math.random() * (i + 1)); 
 
        // Swap arr[i] with the element 
        // at random index 
        [options[i], options[j]] = [options[j], options[i]];
    }
    return options; 
} 
function convert_sec_to_time(seconds){
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    let timeString;
    if(hours!=0)
    timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    else
    timeString = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    return timeString;
}
// start measuring time on that question
function timeRequired(){
    let time_requi = total_time - previous_time;
    previous_time = total_time;
    return current_que_time;
}
// save the data on click save
function applyOptionStyle() {
    removeAllOptionStyles();
    this.style.backgroundColor = "#8eff8e"; // Light green color
}
function removeAllOptionStyles() {
    optionA.style.backgroundColor = "";
    optionB.style.backgroundColor = "";
    optionC.style.backgroundColor = "";
    optionD.style.backgroundColor = "";
}
optionA.addEventListener('mousedown', apply3DLook);
optionA.addEventListener('mouseup', function () {
    remove3DLook.call(this);
    applyOptionStyle.call(this);
    selectedOption = 0;
});
optionB.addEventListener('mousedown', apply3DLook);
optionB.addEventListener('mouseup', function () {
    remove3DLook.call(this);
    applyOptionStyle.call(this);
    selectedOption = 1;
});
optionC.addEventListener('mousedown', apply3DLook);
optionC.addEventListener('mouseup', function () {
    remove3DLook.call(this);
    applyOptionStyle.call(this);
    selectedOption = 2; 
});
optionD.addEventListener('mousedown', apply3DLook);
optionD.addEventListener('mouseup', function () {
    remove3DLook.call(this);
    applyOptionStyle.call(this);
    selectedOption = 3;
});

save_next.addEventListener('click', () => {
    if(save_next.textContent.toString() === "submit"){
        visitDashboard();
    }
    if (question_visit === numberOfQuestion) {
        save_next.textContent = "submit";
        let correctness = checkAnswer(index_itr, selectedOption);
        console.log(result);

    }

    if (save_next.textContent.toString() === "save and next") {
        let correctness = checkAnswer(index_itr, selectedOption);
        let time = timeRequired();
        let weight = questionBank[index_itr].sublevel;
        predict_next_que(Number.parseInt(weight), correctness, time);
    } else {
        
        
    }
});

// check the ans
function checkAnswer(index, selectedOption) {
    let correctOptn = questionBank[index].correctAnswer.trim();
    console.log("correct : " + correctOptn);
    document.getElementById(`que${index}`).style.backgroundColor = "green";
    document.getElementById(`que${index}`).disabled = false;
    last_que_response = present_que_response;
    if(timeRequired()<=5)submit_under_five_sec++;
    else submit_under_five_sec=0;

    let correctOptionTxt;
    if(correctOptn === "A") correctOptionTxt = questionBank[index].options[0];
    if(correctOptn === "B") correctOptionTxt = questionBank[index].options[1];
    if(correctOptn === "C") correctOptionTxt = questionBank[index].options[2];
    if(correctOptn === "D") correctOptionTxt = questionBank[index].options[3];

    let selectedOptionTxt ;
    if(selectedOption === 0) selectedOptionTxt = optionA.textContent.toString();
    if(selectedOption === 1) selectedOptionTxt = optionB.textContent.toString();
    if(selectedOption === 2) selectedOptionTxt = optionC.textContent.toString();
    if(selectedOption === 3) selectedOptionTxt = optionD.textContent.toString();
    if(questionBank[index_itr].level==="Hard")
    hard++;
    else
    if(questionBank[index_itr].level==="Medium")
    medium++;
    else
    easy++;
    console.log("Correct Options : "+correctOptionTxt)
    console.log("Selected Options : "+selectedOptionTxt)
    Score.push(questionBank[index].sublevel)
    if (correctOptionTxt===selectedOptionTxt) {
        continuous_correct++;
        present_que_response = 1;
        result.push(new Result(questionBank[index].question,selectedOptionTxt,timeRequired(),correctOptionTxt,Topic[index],avg_time_other_student));
        correct++;
        return 1;
    } else {
        continuous_correct=0;
        present_que_response = 0;
        result.push(new Result(questionBank[index].question,selectedOptionTxt,timeRequired(),correctOptionTxt,Topic[index],avg_time_other_student));
        incorrect++;
        return 0;
    }
}

// if continuous 2 or more ans is correct then increase the level by 2
// if continuous x ans is wron then decrese the level by x
// if single ans is correct then increase the level by 1 else decrese level by 1
function predict_next_que(level,correctness,time){
    let isCorrect = correctness;
    

    

    // if(continuous_correct>=2){
    //     findQueFromLevel(level+2);
    // }else
    // if(continuous_correct==1){
    //     findQueFromLevel(level+1);
    // }else
    // if(continuous_correct==0){
    //     if(last_que_response===1)
    //         findQueFromLevel(++level);
    //         else
    //         findQueFromLevel(--level);
    // }else{
    //     findQueFromLevel(level+continuous_correct++);
    // }

    if(isCorrect==1){
        findQueFromLevel(level+Math.ceil(Math.random()*RANDOM_SELECTION_LIMIT));
    }else{
        findQueFromLevel(level-Math.ceil(Math.random()*RANDOM_SELECTION_LIMIT));
    }
    
}
// if question is already visited then increse level if last que is correct else decrease level


function apply3DLook() {    
    this.style.transform = 'translateY(2px)';
    this.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
}
function remove3DLook() {
    this.style.transform = '';
    this.style.boxShadow = '';
}

function backgroundService() {
    console.log('Background service is running...');
    if (selectedOption === -1 ) {
        save_next.disabled = true;
        save_next.style.backgroundColor = '#dddddd'; 
    } else { 
        save_next.disabled = false;
        save_next.style.backgroundColor = '#ff6600'; // Use an empty string to reset to default
    }
    setTimeout(backgroundService, 500);
}
backgroundService();

skip_ans_later.addEventListener('click',()=>{

    let correctness=0;
    let time = timeRequired();
    let weight = questionBank[index_itr].sublevel;    
    predict_next_que(Number.parseInt(weight),correctness,time); 
});

// load first que
findQueFromLevel(50);
// use to find the level of next que

fetch('/api/sendResult', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Response from server:', data);
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });


function encodeBase64(value) {
    return btoa(value);
}

async function sendData() {
    const numberToSend = 42; // Integer you want to send
    try {
        const response = await fetch('/api/sendSeattingLimit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: total_time }) // Use numberToSend instead of total_time
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

function visitDashboard(){
    console.log(result);

    fetch('/api/getResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response from server:', data);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });

    //   fetch('/api/sendSeattingLimit', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json' // Specify JSON content type
    //     },
    //     body: JSON.parse(JSON.stringify(Number.toString(total_time).replace(/[^\w\s]/gi, ''))) // Stringify integer value as JSON
    //   })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     console.log('Response from server:', data);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });

    sendData();

      




    // Encode the parameters
    const encodedScore = encodeBase64(JSON.stringify(Score));
    const encodedCorrect = encodeBase64(correct.toString());
    const encodedIncorrect = encodeBase64(incorrect.toString());
    const encodedEasy = encodeBase64(easy.toString());
    const encodedMedium = encodeBase64(medium.toString());
    const encodedHard = encodeBase64(hard.toString());
    const encodedTotalScore = encodeBase64(totalScore.toString());

    // Construct the obfuscated URL
    const obfuscatedURL = `dashboard.html?score=${encodedScore}&correct=${encodedCorrect}&incorrect=${encodedIncorrect}&easy=${encodedEasy}&medium=${encodedMedium}&hard=${encodedHard}&totalScore=${encodedTotalScore}`;

    // Replace the current URL without triggering a page reload
    history.replaceState(null, null, obfuscatedURL);

    // Navigate to the obfuscatedURL
    window.location.href = obfuscatedURL;
}

document.getElementById('submit').addEventListener('click', function() {
   visitDashboard();
});


localStorage.setItem('Score', Score);