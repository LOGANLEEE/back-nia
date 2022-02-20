import 'dotenv/config';
import compression from 'compression';
import express from 'express';
import { initProcess } from 'crawler';
import cors from 'cors';
import { get_new_posts } from 'prisma';

const app = express();
const isDebug = false;

// server middle ware
app.use(compression());
app.use(cors());

// router
app.get('/init', (req, res) => {
	const cur = new Date();
	console.log('======================= INIT PROCESS =======================');
	console.log(`JOB Started at ${cur}`);
	res.send('process started!');
	initProcess({ isDebug: false });
});

app.get('/check', (req, res) => {
	res.send('youhoo!');
});

app.get('/post', async (req, res) => {
	const newPosts = await get_new_posts();
	res.send(newPosts);
	// console.log(`'/post' was called at ${new Date()}`);
});

const port = process.env.port || 4000;
app.listen(port, () => {
	console.log('env:', process.env.NODE_ENV);
	console.log(`NIA server is runnin on ${port} v0.0.2`);
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
