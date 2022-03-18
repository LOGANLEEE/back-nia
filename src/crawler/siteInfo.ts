const inven = 'inven';
const ilbe = 'ilbe';
const etoland = 'etoland';
const dc = 'dc';
const fm = 'fm';
const nate = 'nate';
const ppomppu = 'ppomppu';
const instiz = 'instiz';
const template = 'template';

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
	_upload_date?: {
		path: (idx: number) => string;
		modifier?: (val: string) => Date | string;
	};
	_skip?: (page?: number, idx?: number) => boolean;
}

export const siteInfo: SiteInfo[] = [
	// ================== INSTIZ =====================//
	{
		name: instiz,
		url: (page) => `https://www.instiz.net/pt?page=${page}&srt=3&srd=2#greentop`,
		pages: [1, 1],
		link: (idx) => `#mainboard > tbody > tr:nth-child(${idx}) > td > div.sbj > a:nth-child(1)`,
		_title: {
			path: (idx) => `#mainboard > tbody > tr:nth-child(${idx}) > td > div.sbj > a:nth-child(1)`,
		},
		_upload_date: {
			path: (idx) => `#mainboard > tbody > tr:nth-child(${idx}) > td > div.list_subtitle > div > a:nth-child(1)`,
			modifier: (val) => new Date().getFullYear() + '.' + val,
		},
		prefix: (val) => `https://www.instiz.net${val?.replaceAll('../pt', '/pt')}`,
		// range: [2, 21],
		range: [2, 3],
	},
	// ================== PPOMPPU =====================//
	{
		name: ppomppu,
		url: (page) => `https://www.ppomppu.co.kr/hot.php?id=&page=${page}&category=2&search_type=&keyword=&page_num=&del_flag=&bbs_list_category=0`,
		pages: [1, 4],
		link: (idx) =>
			`body > div > div.contents > div.container > div:nth-child(2) > div.board_box > table.board_table > tbody > tr:nth-child(${idx}) > td:nth-child(4) > a`,
		_title: {
			path: (idx) =>
				`body > div > div.contents > div.container > div:nth-child(2) > div.board_box > table.board_table > tbody > tr:nth-child(${idx}) > td:nth-child(4) > a`,
		},
		_author: {
			path: (idx) =>
				`body > div > div.contents > div.container > div:nth-child(2) > div.board_box > table.board_table > tbody > tr:nth-child(${idx}) > td:nth-child(2)`,
		},
		_hit: {
			path: (idx) =>
				`body > div > div.contents > div.container > div:nth-child(2) > div.board_box > table.board_table > tbody > tr:nth-child(${idx}) > td:nth-child(7)`,
			modifier: (val) => parseInt(val),
		},
		prefix: (val) => `https://www.ppomppu.co.kr${val?.replaceAll('/zboard/zboard', '/zboard/view')}`,
		range: [4, 23],
	},
	// ================== NATE =====================//
	{
		name: nate,
		url: (page) => `https://pann.nate.com/talk/ranking?rankingType=total&page=${page}`,
		pages: [1, 2],
		link: (idx) => `#container > div.content.sub > div.mainarea > div.tsCnt > div.cntList > ul > li:nth-child(${idx}) > dl > dt > a`,
		prefix: (val) => `https://pann.nate.com${val}`,
		range: [1, 50],
	},
	// ================== FMKOREA =====================//
	{
		name: fm,
		url: (page) => `https://www.fmkorea.com/index.php?mid=best&listStyle=list&page=${page}`,
		pages: [1, 2],
		link: (idx) => `#bd_189545458_0 > div > table > tbody > tr:nth-child(${idx}) > td.title.hotdeal_var8 > a.hx`,
		_author: {
			path: (idx) => `#bd_189545458_0 > div > table > tbody > tr:nth-child(${idx}) > td.author > span > a`,
		},
		_hit: {
			path: (idx) => `#bd_189545458_0 > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(6)`,
			modifier: (val) => parseInt(val, 10) || -99,
		},

		prefix: (val) => `https://www.fmkorea.com${val}`,
		range: [1, 20],
	},

	// ================== DC =====================//
	{
		name: dc,
		url: (page) => `https://gall.dcinside.com/board/lists/?id=dcbest&page=${page}`,
		pages: [1, 2],
		link: (idx) =>
			`#container > section.left_content > article:nth-child(3) > div.gall_listwrap.list > table > tbody > tr:nth-child(${idx}) > td.gall_tit.ub-word > a:nth-child(1)`,
		_author: {
			path: (idx) =>
				`#container > section.left_content > article:nth-child(3) > div.gall_listwrap.list > table > tbody > tr:nth-child(${idx}) > td.gall_writer.ub-writer > span > em`,
		},
		_hit: {
			path: (idx) =>
				`#container > section.left_content > article:nth-child(3) > div.gall_listwrap.list > table > tbody > tr:nth-child(${idx}) > td.gall_count`,
			modifier: (val) => parseInt(val) || -99,
		},

		prefix: (val) => `https://gall.dcinside.com${val}`,
		range: [1, 50],
		_skip: (page, idx) => page === 1 && idx <= 3,
	},
	//=================== ETOLAND ================//
	{
		name: etoland,
		// url: (page) => `https://www.etoland.co.kr/bbs/pop.php?view=&sfl=&sword=&adult=&start_num=&end_num=&page=${page}`,
		url: (page) => `https://www.etoland.co.kr/bbs/board.php?bo_table=hit&page=${page}`,
		pages: [1, 2],
		// link: (idx) => `#container > div.right > div > ul > li:nth-child(${idx}) > div.subject > a`,
		link: (idx) => `#fboardlist > div > ul > li:nth-child(${idx}) > div.subject > a.subject_a`,
		_title: {
			path: (idx) => `#fboardlist > div > ul > li:nth-child(${idx}) > div.subject > a.subject_a`,
			modifier: (val) => {
				const filtered = val.replaceAll('\t', '').replaceAll('\n', '').trim();
				return filtered.split('         ')[0].trim();
			},
		},
		_author: {
			// path: (idx) => `#container > div.right > div > ul > li:nth-child(${idx}) > div.writer`,
			path: (idx) => `#fboardlist > div > ul > li:nth-child(${idx}) > div.writer > a > span`,
		},
		_hit: {
			// path: (idx) => `#container > div.right > div > ul > li:nth-child(${idx}) > div.wr_hit`,
			path: (idx) => `#fboardlist > div > ul > li:nth-child(${idx}) > div.views`,
			modifier: (val) => parseInt(val.replaceAll(',', '')) || -99,
		},

		prefix: (val) => `https://www.etoland.co.kr${val?.replace('..', '')}`,
		range: [4, 64],
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
		prefix: (val) => `https://www.ilbe.com${val}`,
		range: [5, 64],
		_hit: {
			path: (idx) => `#content-wrap > div > div.board-list > ul > li:nth-child(${idx}) > span.view`,
			modifier: (val) => parseInt(val.replaceAll(',', '')) || -99,
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
	_upload_date?: {
		paths: string[];

		modifier?: (val: string) => Date | string;
	};
	_content: {
		path: string;
		modifier?: (val: string) => string;
	};
}

export const pathInfo: PathInfo[] = [
	//=================== INSTIZ ================//
	{
		_from: instiz,

		_content: {
			path: '#memo_content_1',
		},
	},
	//=================== PPOMPPU ================//
	{
		_from: ppomppu,
		_upload_date: {
			paths: [
				'body > div > div.contents > div.container > div > table:nth-child(10) > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(5) > div > div.sub-top-text-box',
			],
			modifier: (val) => new Date(val.slice(val.indexOf('등록일:') + 4, val.indexOf('등록일:') + 21).trim()),
		},
		_content: {
			path: 'body > div > div.contents > div.container > div > table:nth-child(15) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td',
		},
	},
	//=================== NATE ================//
	{
		_from: nate,
		_title: { path: '#container > div.content.sub > div.viewarea > div.view-wrap > div.post-tit-info.emblem.rank > h4' },
		_upload_date: {
			paths: ['#container > div.content.sub > div.viewarea > div.view-wrap > div.post-tit-info.emblem.rank > div.info > span.date'],
			modifier: (val) => new Date(val),
		},
		_author: {
			path: '#container > div.content.sub > div.viewarea > div.view-wrap > div.post-tit-info.emblem.rank > div.info > a',
		},
		_hit: {
			path: '#container > div.content.sub > div.viewarea > div.view-wrap > div.post-tit-info.emblem.rank > div.info > span.count',
			modifier: (val) => parseInt(val.replace('조회', '').replace(',', '')) || -99,
		},
		_content: {
			path: '#contentArea',
		},
	},
	//=================== FM KOREA ================//
	{
		_from: fm,
		_title: { path: '#bd_capture > div.rd_hd.clear > div.board.clear > div.top_area.ngeb > h1 > span' },
		_upload_date: {
			paths: ['#bd_capture > div.rd_hd.clear > div.board.clear > div.top_area.ngeb > span'],
			modifier: (val) => new Date(val),
		},
		_content: {
			path: '#bd_capture > div.rd_body.clear > article > div',
		},
	},
	//=================== DC ================//
	{
		_from: dc,
		_title: {
			path: '#container > section > article:nth-child(3) > div.view_content_wrap > header > div > h3 > span.title_subject',
		},
		_upload_date: {
			paths: ['#container > section > article:nth-child(3) > div.view_content_wrap > header > div > div > div.fl > span.gall_date'],
			modifier: (val) => new Date(val),
		},
		_content: {
			path: '#container > section > article:nth-child(3) > div.view_content_wrap > div > div.inner.clear > div.writing_view_box',
		},
	},
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

				return parseInt(replacedVal.slice(3, replacedVal.indexOf('추천:'))) || -99;
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
			modifier: (val) => parseInt(val.replaceAll(',', '')) || -99,
		},
		_upload_date: {
			paths: ['#content-wrap > div > div.board-view > div.post-wrap > div.post-count > div.count > span.date'],
			modifier: (val) => new Date(val),
		},
		_content: { path: '#content-wrap > div > div.board-view > div.post-wrap > div.post-content', modifier: null },
	},
];
