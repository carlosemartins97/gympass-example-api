import { makeFetchUsersCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-users-check-ins-history-use-case";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const historyCheckInsUseCase = makeFetchUsersCheckInsHistoryUseCase();

  const { checkIns } = await historyCheckInsUseCase.execute({ page, userId: request.user.sub });

  return reply.status(200).send({
    checkIns
  });
}