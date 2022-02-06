const inven = 'inven';
const ilbe = 'ilbe';
const etoland = 'etoland';

interface SiteInfo {
	name: string;
	url: (page: number) => string;
	pages: number[];
	link: (idx: number) => string;
	range: number[];
	prefix?: (val: string) => string;

	_title?: {
		path: (idx: number) => string;
		modifier?: (val: string) => string;
	};
	_author?: {
		path: (idx: number) => string;
		modifier?: (val: string) => string;
	};
	_hit?: {
		path: (idx: number) => string;
		modifier?: (val: string) => number;
	};
}

export const siteInfo: SiteInfo[] = [
	//=================== ETOLAND ================//
	{
		name: etoland,
		url: (page) => `https://www.etoland.co.kr/bbs/pop.php?view=&sfl=&sword=&adult=&start_num=&end_num=&page=${page}`,
		pages: [1, 1],
		link: (idx) => `#container > div.right > div > ul > li:nth-child(${idx}) > div.subject > a`,
		_title: {
			path: (idx) => `#container > div.right > div > ul > li:nth-child(${idx}) > div.subject > a`,
			modifier: (val) => {
				const filtered = val.replaceAll('\t', '').replaceAll('\n', '').trim();
				return filtered.split('         ')[0].trim();
			},
		},
		_author: {
			path: (idx) => `#container > div.right > div > ul > li:nth-child(${idx}) > div.writer`,
			// #container > div.right > div > ul > li:nth-child(74) > div.writer > span
		},
		_hit: {
			path: (idx) => `#container > div.right > div > ul > li:nth-child(${idx}) > div.wr_hit`,
			modifier: (val) => parseInt(val.replaceAll(',', ''), 10) || -99,
		},

		prefix: (val) => (val !== undefined ? `https://www.etoland.co.kr/bbs/${val?.replace('./', '')}` : undefined),
		range: [2, 76],
	},
	//=================== INVEN ================//
	{
		name: inven,
		url: (page) => `https://www.inven.co.kr/board/webzine/2097?my=chu&p=${page}`,
		pages: [1, 2],
		link: (idx) => `#new-board > form > div > table > tbody > tr:nth-child(${idx}) > td.tit > div > div > a`,
		range: [1, 50],
	},
	//=================== ILBE ================//
	{
		name: ilbe,
		url: (page) => `https://www.ilbe.com/list/ilbe?page=${page}&listSize=60&listStyle=list`,
		pages: [1, 2],
		link: (idx) => `#content-wrap > div > div.board-list > ul > li:nth-child(${idx}) > span.title > a`,
		prefix: (val) => (val !== undefined ? `https://www.ilbe.com${val}` : undefined),
		range: [5, 64],
		_hit: {
			path: (idx) => `#content-wrap > div > div.board-list > ul > li:nth-child(${idx}) > span.view`,
			modifier: (val) => parseInt(val.replaceAll(',', ''), 10) || -99,
		},
	},
];

interface PathInfo {
	_from: string;
	_title?: {
		path: string;
		modifier?: (val: string) => string;
	};
	_author?: {
		path: string;
		modifier?: (val: string) => string;
	};
	_hit?: {
		path: string;
		modifier: (val: string) => number;
	};
	_upload_date: {
		paths: string[];

		modifier?: (val: string) => Date | string;
	};
	_content: {
		path: string;
		modifier?: (val: string) => string;
	};
}

export const pathInfo: PathInfo[] = [
	//=================== ETOLAND ================//
	{
		_from: etoland,
		_upload_date: {
			paths: [
				'#mw_basic > table.view_table.no_ban_div > tbody > tr:nth-child(4) > td > span > span.mw_basic_view_datetime',
				'#mw_basic > div.board_view_wrap > div.info_wrap.no_ban_div > span.datetime',
			],
			modifier: (val) => new Date(val),
		},
		_content: { path: '#view_content', modifier: null },
	},

	//=================== INVEN ================//
	{
		_from: inven,
		_title: { path: '#tbArticle > div.articleMain > div.articleSubject > div.articleTitle > h1', modifier: null },
		_author: { path: '#tbArticle > div.articleHead.hC_silver1 > div > div.articleWriter > span', modifier: null },
		_hit: {
			path: '#tbArticle > div.articleHead.hC_silver1 > div > div.articleHit',
			modifier: (val) => {
				const replacedVal = val.replaceAll('\t', '').replaceAll('\n', '').replaceAll(',', '');

				return parseInt(replacedVal.slice(3, replacedVal.indexOf('추천:')), 10) || -99;
			},
		},
		_upload_date: {
			paths: ['#tbArticle > div.articleHead.hC_silver1 > div > div.articleDate'],
			modifier: (val) => new Date(val),
		},
		_content: { path: '#powerbbsContent', modifier: null },
	},
	//=================== ILBE ================//
	{
		_from: ilbe,
		_title: { path: '#content-wrap > div > div.board-view > div.post-wrap > div.post-header > h3 > a', modifier: null },
		_author: { path: '#content-wrap > div > div.board-view > div.post-wrap > div.post-header > span > a', modifier: null },
		_hit: {
			path: '#content-wrap > div > div.board-list > ul > li.list-current-doc > span.view',
			modifier: (val) => parseInt(val.replaceAll(',', ''), 10) || -99,
		},
		_upload_date: {
			paths: ['#content-wrap > div > div.board-view > div.post-wrap > div.post-count > div.count > span.date'],
			modifier: (val) => new Date(val),
		},
		_content: { path: '#content-wrap > div > div.board-view > div.post-wrap > div.post-content', modifier: null },
	},
];
