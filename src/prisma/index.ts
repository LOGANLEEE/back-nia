import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const create_new_post = (holder: Prisma.new_postsCreateManyInput[]) =>
	prisma
		.$connect()
		.then(() =>
			prisma.new_posts
				.createMany({ data: holder })
				.then(({ count }) => ({ count }))
				.catch(() => ({ count: -1 })),
		)
		.finally(() => prisma.$disconnect());

export const setNewPostAsOld = () =>
	prisma
		.$connect()
		.then(() =>
			prisma.new_posts
				.updateMany({ where: { isnew: true }, data: { isnew: false } })
				.then(({ count }) => ({ count, doProceed: true }))
				.catch(() => ({ count: -1, doProceed: false })),
		)
		.finally(() => prisma.$disconnect());

export const clean_up_old_post = () =>
	prisma
		.$connect()
		.then(() =>
			prisma.new_posts
				.findMany({ where: { isnew: false } })
				.then((oldPost) => prisma.posts.createMany({ data: oldPost }))
				.then(({ count: old_count }) =>
					prisma.new_posts
						.deleteMany({ where: { isnew: false } })
						.then(({ count: delete_count }) => ({ delete_count, doProceed: old_count === delete_count })),
				),
		)
		.finally(() => prisma.$disconnect());
