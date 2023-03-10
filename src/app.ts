import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { appRoutes } from './http/routes';


export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation Error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // Deveria fazer o log pra uma ferramente externa like DataDog/Sentry/NewRelic
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
