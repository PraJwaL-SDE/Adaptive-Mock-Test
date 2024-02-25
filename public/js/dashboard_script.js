// import Score from "./main_script";
// Extract values from the URL query parameters
import large_que_bank from "./Question Bank/180_que_gravitation.js"
let questionBank = large_que_bank;
class Result {
    constructor(
        Que_Txt,
        Option_selected,
        Time_taken,
        Correct,
        Topic,
        Avg_time
    ) {
        this.Que_Txt = Que_Txt;
        this.Option_selected = Option_selected;
        this.Time_taken = Time_taken;
        this.Correct = Correct;
        this.Topic = Topic;
        this.Avg_time = Avg_time;

    }
}
let nexttest = document.querySelector("#nexttest")
nexttest.addEventListener('click', () => {
    fetch('/Home', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify the content type
            // Add any additional headers if needed
        },
        body: JSON.stringify({ /* Add your request body here */ })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            // Handle the response data
            console.log(data);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error:', error);
        });
})
fetch('/api/getUsername')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('username_tag').textContent = data;
    });


const urlParams = new URLSearchParams(window.location.search);
function decodeBase64(value) {
    return atob(value);
}
// import Result from "./Result";
let result = [];

fetch('/api/sendResult')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse response body as JSON
    })
    .then(data => {
        console.log('Received result from server:', data);

        // Assuming data is an array of objects instantiated from the Result class
        // Loop through the data array and instantiate Result objects
        for (let i = 0; i < data.length; i++) {
            const resultItem = new Result(
                data[i].Que_Txt,
                data[i].Option_selected,
                data[i].Time_taken,
                data[i].Correct,
                data[i].Topic,
                data[i].Avg_time
            );
            result.push(resultItem);
        }

        let strong_topics = [];
        let weak_topics = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i].Correct === result[i].Option_selected)
                strong_topics.push(result[i].Topic);
            else
                weak_topics.push(result[i].Topic);
        }
        const topic_table_tag = document.getElementById('topic_table_tag');
        for (let i = 0; i < strong_topics.length || i < weak_topics.length; i++) {
            const row = document.createElement('tr');
            const strong_topic_cell = document.createElement('td');
            const weak_topic_cell = document.createElement('td');

            if (i < strong_topics.length) {
                strong_topic_cell.textContent = strong_topics[i];
            }
            if (i < weak_topics.length) {
                weak_topic_cell.textContent = weak_topics[i];
            }
            row.appendChild(strong_topic_cell);
            row.appendChild(weak_topic_cell);
            topic_table_tag.appendChild(row);

        }


        // Now, result array contains objects of type Result
        console.log('Result array:', result);

        const questio_detail_table = document.getElementById('questio_detail_table');
        for (let i = 0; i < result.length; i++) {

            const row = document.createElement('tr');

            const topicCell = document.createElement('td');
            topicCell.textContent = result[i].Topic;
            row.appendChild(topicCell);

            const questionCell = document.createElement('td');
            questionCell.textContent = result[i].Que_Txt;
            row.appendChild(questionCell);

            const optionCell = document.createElement('td');
            optionCell.textContent = result[i].Option_selected;
            row.appendChild(optionCell);

            const correctCell = document.createElement('td');
            correctCell.textContent = result[i].Correct;
            row.appendChild(correctCell);

            const timeTakenCell = document.createElement('td');
            timeTakenCell.textContent = result[i].Time_taken + ' seconds';
            row.appendChild(timeTakenCell);

            const avgTimeCell = document.createElement('td');
            avgTimeCell.textContent = result[i].Avg_time + ' seconds';
            row.appendChild(avgTimeCell);

            questio_detail_table.appendChild(row);
        }

        // Do something with the result here, such as updating the UI
        // For example:
        // renderResult(result);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        // Handle errors gracefully, e.g., show an error message to the user
    });






// Retrieve the encoded parameters from the URL
const encodedScore = urlParams.get('score');
const encodedCorrect = urlParams.get('correct');
const encodedIncorrect = urlParams.get('incorrect');
const encodedEasy = urlParams.get('easy');
const encodedMedium = urlParams.get('medium');
const encodedHard = urlParams.get('hard');
const encodedTotalScore = urlParams.get('totalScore');


// Decode the parameters
const scoreString = decodeBase64(encodedScore);
const correctString = decodeBase64(encodedCorrect);
const incorrectString = decodeBase64(encodedIncorrect);
const easyString = decodeBase64(encodedEasy);
const mediumString = decodeBase64(encodedMedium);
const hardString = decodeBase64(encodedHard);
const totalScoreString = decodeBase64(encodedTotalScore);
// Parse the values back to their respective types
const Score = JSON.parse(decodeURIComponent(scoreString));
const correct = parseInt(correctString);
const incorrect = parseInt(incorrectString);
const easy = parseInt(easyString);
const medium = parseInt(mediumString);
const hard = parseInt(hardString);
const totalScore = parseInt(totalScoreString);


document.getElementById('easyScore').textContent = easy.toString();
document.getElementById('mediumScore').textContent = medium.toString();
document.getElementById('hardScore').textContent = hard.toString();
document.getElementById('totalScore').textContent = totalScore.toString();
console.log(Score);

const topic_table_tag = document.getElementById('topic_table_tag');

document.addEventListener('DOMContentLoaded', function () {
    // Dummy data for the pie chart
    const pieChartData = {
        labels: ['Correct', 'Wrong'],
        datasets: [{
            data: [correct, incorrect], // Replace with actual data
            backgroundColor: ['#4CAF50', '#FF5733'],
        }],
    };
    // Dummy data for the line chart
    const scoreLabels = Array.from({ length: Score.length }, (_, index) => `Q${index + 1}`);

    // Create the line chart data
    const lineChartData = {
        labels: scoreLabels,
        datasets: [{
            label: 'Performance',
            data: Score,
            borderColor: '#3498db',
            borderWidth: 2,
            fill: false,
        }],
    };

    // Create Pie Chart
    const pieChartCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: pieChartData,
    });

    // Create Line Chart
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: lineChartData,
    });






});

const baseUrl = 'http://localhost:3001/';
async function getInfo() {
    const res = await fetch(baseUrl,
        {
            method: 'GET'
        })
    console.log(res);

}

