import compression from 'compression';
import express from 'express';
import { initProcess } from 'crawler';
import cors from 'cors';

const app = express();
const port = 4000;
const isDebug = false;

// server middle ware
app.use(cors());
app.use(compression());

// router
app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	isDebug && console.log(`NIA server is runnin on ${port}`);
});

// job

setInterval(() => {
	const cur = new Date();
	if (cur.getMinutes() % 15 === 0) {
		console.log('======================= INIT PROCESS =======================');
		console.log(`JOB Started at ${cur}`);
		initProcess({ isDebug: false });
		console.log('======================= INIT PROCESS =======================');
	}
}, 59999);
