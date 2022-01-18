import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const main = async () => {
	// Connect the client
	await prisma.$connect();
	// ... you will write your Prisma Client queries here
};

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
