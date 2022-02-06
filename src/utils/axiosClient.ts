import _axios from 'axios';
import { encode, decode, encodingExists } from 'iconv-lite';

export const fetch = _axios.create({
	responseType: 'arraybuffer',
	headers: {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
	},
});

fetch.interceptors.response.use(
	(res) => {
		if (res.headers['content-type'].toLocaleLowerCase().includes('euc-kr')) {
			res.data = decode(Buffer.from(res.data), 'euc-kr').toString();
		}
		return res;
	},
	(err) => {
		Promise.reject(err);
	},
);
