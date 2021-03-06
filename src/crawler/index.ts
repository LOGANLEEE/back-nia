import { Prisma } from '@prisma/client';
import * as cheerio from 'cheerio';
import { pathInfo, siteInfo } from 'crawler/siteInfo';
import { writeFileSync } from 'fs';
import { clean_up_old_post, create_new_post, set_target_from_as_old } from 'prisma';
import { fetch } from 'utils/axiosClient';

interface LinkHolder {
	href: string;
	preHit?: number;
	preTitle?: string;
	preAuthor?: string;
	preDate?: string | Date;
}

interface InitType {
	isDebug: boolean;
}

export const first_process = ({ isDebug }: InitType) =>
	new Promise<{ doProceed: boolean; success_count: number; fail_count: number; post_count: number }>((resolve) => {
		let success_count = 0;
		let fail_count = 0;
		let post_count = 0;
		siteInfo.forEach(async ({ name, pages, link, range, url, prefix, _hit, _title, _author, _skip, _upload_date }) => {
			if (isDebug ? name === 'instiz' : true) {
				const linkHolder: LinkHolder[] = [];

				for (let page = pages[0]; page <= pages[1]; page++) {
					const { data, isError } = await fetch
						.get(url(page))
						.then((e) => ({ ...e, isError: false }))
						.catch((err) => ({ data: err, isError: true }));

					// console.log(`Going for ${name} ${page} page. isError: ${isError}`);
					if (!isError) {
						const $ = cheerio.load(data);

						for (let idx = range[0]; idx <= range[1]; idx++) {
							const href = prefix ? prefix($(link(idx)).attr('href')) : $(link(idx)).attr('href');

							const preHit = _hit && _hit?.modifier($(_hit?.path(idx)).text());

							const preTitle = _title && _title?.modifier ? _title?.modifier($(_title?.path(idx)).text()) : $(_title?.path(idx)).text();

							const preDate =
								_upload_date && _upload_date?.modifier
									? _upload_date?.modifier($(_upload_date?.path(idx)).text())
									: $(_upload_date?.path(idx)).text();

							const preAuthor =
								_author && _author?.modifier ? _author.modifier($(_author?.path(idx)).text()) : $(_author?.path(idx)).text();

							const skip = _skip ? _skip(page, idx) : false;
							// console.log('wtf;', { href, preHit, preTitle, preAuthor, preDate });

							href && !skip && linkHolder.push({ href, preHit, preTitle, preAuthor, preDate });
						}
					} else {
						writeFileSync(`./src/debug/${new Date()}.jsonc`, JSON.stringify(data));
					}
				}

				// console.log('linkHolder:', linkHolder);
				const { parsing_done, count } = await detail_parser(linkHolder, name, isDebug);
				parsing_done ? success_count++ : fail_count++;
				post_count += count;
				// console.log('success_count', success_count);
				// console.log('fail_count', fail_count);

				console.log(name, siteInfo.length, success_count, fail_count, siteInfo.length === success_count + fail_count);

				if (isDebug && success_count + fail_count === 1) resolve({ doProceed: true, success_count, fail_count, post_count });

				if (!isDebug && siteInfo.length === success_count + fail_count) resolve({ doProceed: true, success_count, fail_count, post_count });
			}
		});
	});

const detail_parser = (linkHolder: LinkHolder[], name: string, isDebug: boolean) =>
	new Promise<{ parsing_done: boolean; count: number }>((resolve) => {
		try {
			const { _author, _from, _hit, _title, _upload_date, _content } = pathInfo.find(({ _from }) => _from === name);

			const length = linkHolder.length;
			let count = 0;

			if (_from !== undefined) {
				const holder: Prisma.new_postsCreateManyInput[] = [];

				if (linkHolder?.length === 0) throw false;

				linkHolder.forEach(({ href, preHit, preTitle, preAuthor, preDate }, idx) => {
					setTimeout(async () => {
						const { data, isError } = await fetch
							.get(href)
							.then((e) => ({ ...e, isError: false }))
							.catch(() => ({ data: [], status: 999, isError: true }));
						count++;
						if (!isError) {
							const $ = cheerio.load(data);

							let title = undefined;
							if (preTitle) title = preTitle;
							else title = _title?.modifier ? _title?.modifier($(_title?.path).text()) : $(_title?.path).text();

							let author = undefined;
							if (preAuthor) author = preAuthor;
							else author = _author?.modifier ? _author?.modifier($(_author?.path).text()) : $(_author?.path).text();

							const hit = preHit || _hit?.modifier($(_hit?.path).text());

							let upload_date = undefined;

							if (preDate) {
								upload_date = preDate;
							} else {
								_upload_date?.paths.some((path) => {
									const parsedDate = _upload_date.modifier($(path).text());
									if (parsedDate + '' !== 'Invalid Date') {
										upload_date = parsedDate;
										return true;
									}
								});
							}

							const content = _content?.modifier ? _content?.modifier($(_content?.path).text()) : $(_content?.path).text();

							if (title !== '') {
								holder.push({
									title: title.trim(),
									author: author.trim(),
									hit,
									upload_date,
									content: content.replaceAll('\t', '').replaceAll('\n', ''),
									link: href,
									from: _from,
									isnew: true,
								});
							}
						}
						if (count + 1 === length) {
							const { count: old_count, doProceed } = await set_target_from_as_old(_from);
							// console.log(`${old_count} are set old from ${_from} `);
							if (doProceed) {
								const { count } = await create_new_post(holder);
								// console.log(`Parser: ${_from}, ${count} posts are inserted`);
								resolve({ parsing_done: true, count });
							}
						}
						// if (isDebug) throw loopBreakException;
					}, 300 * idx);
				});
			} else {
				throw false;
			}
		} catch (error) {
			console.error('detail_parser:', error);
			resolve({ parsing_done: false, count: 0 });
		}
	});

export const initProcess = async ({ isDebug }: InitType) => {
	const { doProceed: do_proceed_second, fail_count, success_count, post_count } = await first_process({ isDebug });

	if (do_proceed_second) {
		console.log(`2: crawling is done. succuess:${success_count} fail:${fail_count} total post:${post_count}`);
		const { delete_count, doProceed: do_proceed_thrid } = await clean_up_old_post();
		if (do_proceed_thrid) {
			console.log(`3: old posts ${delete_count} are moved `);
			console.log('============ process done ============');
		}
	}
};
