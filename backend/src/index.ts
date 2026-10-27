import { buildApp } from './app.js';
import { env } from './env.js';

const app = buildApp();

try {
  await app.listen({ port: env.PORT, host: '127.0.0.1' });
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
