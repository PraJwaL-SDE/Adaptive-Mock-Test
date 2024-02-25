import express from "express";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

let username = "";
let password = "";
let std = 11;
let result;
let name = "";
let email = "";

let user = {
    Attempts: [],
    LastSeatingLimit: 0
};

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/Log_in_page.html");
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + "/public/main.html");
});

app.post('/examtab', (req, res) => {
    res.sendFile(__dirname + "/public/ExamTab.html");
});

app.post('/Home', (req, res) => {
    res.sendFile(__dirname + "/public/Home_page.html");
});

app.post('/guidelines', (req, res) => {
    res.sendFile(__dirname + "/public/guidelines.html");
});

app.post('/dashboard', (req, res) => {
    res.sendFile(__dirname + "/public/dashboard.html");
});

// Middleware to set no-store cache control
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.use(bodyParser.json());

// API routes
app.post('/api/sendUsername', (req, res) => {
    username = req.body.username;
    console.log(username);
    user.Name = name;
    user.Username = username;
    user.Password = password;
    user.Email = email;
    user.Class = 11;
    res.json({ message: `Received username: ${username}` });
});

app.get('/api/getUsername', (req, res) => {
    res.json(username);
});
let lastSeatingTime = 0;
app.post('/api/sendSeattingLimit', (req, res) => {
    try {
        // Attempt to parse the JSON data from req.body
        // const seatingLimitData = JSON.parse(req.body);
        // If parsing succeeds, update the user's last seating limit
        lastSeatingTime = req.body.number;
        res.json({ message: 'Seating limit updated successfully' });
    } catch (error) {
        // If parsing fails, return an error response
        console.error('Error parsing JSON data:', error);
        res.status(400).json({ error: 'Invalid JSON data' });
    }
});
app.get('/api/getSeatingLimit', (req, res) => {
    
    res.json({ number: lastSeatingTime });
});
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.post('/api/getResult', (req, res) => {
    result = req.body;
    console.log('Received result:', result);
    if (!user.Attempts) {
        user.Attempts = [];
    }
    user.Attempts.push(result);
    res.json({ message: 'Result received successfully' });
});

app.get('/api/sendResult', (req, res) => {
    res.json(result);
});

app.get('/api/getAttempts', (req, res) => {
    res.json(user.Attempts);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
