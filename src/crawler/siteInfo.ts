const inven = 'inven';

export const siteInfo = [
	{
		name: inven,
		url: (page: number) => `https://www.inven.co.kr/board/webzine/2097?iskin=webzine&p=${page}`,
		pages: [1, 2],
		path: (idx: number) => `#new-board > form > div > table > tbody > tr:nth-child(${idx}) > td.tit > div > div > a`,
		range: [5, 54],
	},
];

export const pathInfo = [
	{
		_title: (idx: number) => `#new-board > form > div > table > tbody > tr:nth-child(${idx}) > td.tit > div > div > a`,
		_author: (idx: number) => `#new-board > form > div > table > tbody > tr:nth-child(${idx}) > td.user > span`,
		_hit: (idx: number) => `#new-board > form > div > table > tbody > tr:nth-child(${idx}) > td.view`,
		_upload_date: (idx: number) => ``,
		_from: inven,
	},
];
