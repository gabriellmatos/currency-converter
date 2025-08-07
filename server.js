import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

let history = [];

app.use(cors());
app.use(express.json());

app.get('/api/history', (req, res) => {
	res.json(history);
});

app.post('/api/history', (req, res) => {
	const newHistory = req.body;
	history.push(newHistory);
	res.send(202);
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/user', (req, res) => {
	res.send('Hello USER!');
});

app.post('/', (req, res) => {
	res.send('Got a POST request.');
	console.log(req.body);
});

app.put('/user', (req, res) => {
	res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
	res.send('Got a DELETE request at /user');
});

app.listen(port, () => {
	console.log(`Listening to port ${port}.`);
});
