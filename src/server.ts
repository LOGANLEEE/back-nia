import compression from 'compression';
import express from 'express';
import { initProcess } from 'crawler';

const app = express();
const port = 4000;

const isDebug = false;

app.use(compression());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	isDebug && console.log(`NIA server is runnin on ${port}`);
});

setInterval(() => {
	const cur = new Date();
	if (cur.getMinutes() % 15 === 0) {
		console.log('======================= INIT PROCESS =======================');
		console.log(`JOB Started at ${cur}`);
		initProcess({ isDebug: false });
		console.log('======================= INIT PROCESS =======================');
	}
}, 59999);
