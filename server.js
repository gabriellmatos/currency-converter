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
	console.log(req.body);
	const newHistory = req.body;
	history.push(newHistory);
	res.send(202);
});

app.delete('/api/history', (req, res) => {
	history = [];
	res.send(202);
});

app.listen(port, () => {
	console.log(`Listening to port ${port}.`);
});
