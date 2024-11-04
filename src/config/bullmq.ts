import { registerAs } from '@nestjs/config';

export default registerAs('bullmq', () => ({
  host: process.env.BULLMQ_HOST,
  port: Number(process.env.BULLMQ_PORT),
}));
