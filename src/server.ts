import 'dotenv/config';
import compression from 'compression';
import express from 'express';
import { initProcess } from 'crawler';
import cors from 'cors';
import { get_new_posts, renew_test } from 'prisma';

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

app.get('/test-init', (req, res) => {
	const cur = new Date();
	console.log('======================= TEST INIT PROCESS =======================');
	console.log(`JOB Started at ${cur}`);
	initProcess({ isDebug: true });
	res.send('process started!');
	return;
});

app.get('/check', (req, res) => {
	res.send('youhoo!');
	return;
});

app.get('/post', async (req, res) => {
	const newPosts = await get_new_posts();
	res.send(newPosts);
	return;
	// console.log(`'/post' was called at ${new Date()}`);
});

const port = process.env.port || 4000;
app.listen(port, () => {
	console.log('env:', process.env.NODE_ENV);
	console.log(`NIA server is runnin on ${port} v0.0.3`);
	return;
});

// job

setInterval(() => {
	const cur = new Date();
	if (cur.getMinutes() % 15 === 0) {
		console.log('======================= INIT PROCESS START =======================');
		console.log(`JOB Started at ${cur}`);
		initProcess({ isDebug: false });
		console.log('======================= INIT PROCESS DONE =======================');
	}
}, 59999);
