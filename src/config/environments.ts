import { existsSync } from 'fs';

const envFileMap: Record<string, string> = {
  prod: '.env',
  dev: '.env.development.local',
  localProd: '.env.production.local',
};

export function getEnvFilePath(): string[] {
  const file = envFileMap[process.env.NODE_ENV];
  // On Railway/Docker, env files don't exist — env vars come from the platform
  if (file && existsSync(file)) {
    return [file];
  }
  return [];
}
