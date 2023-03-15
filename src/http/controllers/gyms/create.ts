import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeCreateGymsseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { RegisterUseCase } from "@/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    })
  })

  const { description, latitude, longitude, phone, title } = createGymBodySchema.parse(request.body);

  const createGym = makeCreateGymsseCase();

  await createGym.execute({ description, latitude, longitude, phone, title });

  return reply.status(201).send();
}