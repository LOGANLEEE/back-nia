import { Prisma } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '../prisma';
import { pathInfo, siteInfo } from './siteInfo';

export const getDetail = () => {
	siteInfo.forEach(async ({ name, pages, path, range, url }) => {
		for (let page = pages[0]; page <= pages[1]; page++) {
			const { status, data } = await axios(url(page));
			if (status === 200) {
				parser(data, name, range);
			}
		}
	});
};

// ! getting detail content ...etc

const parser = async (data: string, name: string, range: number[]) => {
	const $ = cheerio.load(data);
	const holder: Prisma.newpostCreateManyInput[] = [];
	const { _author, _from, _hit, _title, _upload_date } = pathInfo.find(({ _from }) => _from === name);
	if (_from !== undefined) {
		console.debug('1:', _from);
		for (let idx = range[0]; idx <= range[1]; idx++) {
			const title = $(_title(idx)).text().replaceAll(' ', '');
			const author = $(_author(idx)).text().replaceAll(' ', '');
			const hit = parseInt($(_hit(idx)).text().replaceAll(',', '')) || 0;
			const upload_date = $(_upload_date(idx)).text().replaceAll(' ', '') || new Date();

			if (title !== '') {
				holder.push({
					title,
					author,
					hit,
					upload_date,
					from: _from,
				});
			}
		}
	}
	await prisma.$connect();
	await prisma.newpost
		.createMany({ data: holder })
		.then(({ count }) => {
			console.debug(`${_from} : ${count} is saved`);
		})
		.finally(async () => await prisma.$disconnect());
};
