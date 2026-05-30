/**
 * CLI: export clustering snapshot + run + results + teacher DTO to a JSON file.
 *
 * Usage (from pms_backend/):
 *   npm run clustering:export -- --out ./exports/clustering-report.json --all
 *   npm run clustering:export -- --out ./report.json 15 20
 *
 * CLUSTERING_ENABLED=false is set in the npm script so the weekly cron is not
 * registered during this one-off run.
 */
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClusteringService } from './clustering.service';

function parseArgs(argv: string[]) {
  let outPath = join(
    process.cwd(),
    `clustering-export-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  );
  const ids: number[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') {
      outPath = argv[++i] ?? outPath;
      continue;
    }
    if (a.startsWith('--out=')) {
      outPath = a.slice('--out='.length) || outPath;
      continue;
    }
    if (/^\d+$/.test(a)) {
      ids.push(Number(a));
    }
  }
  return { outPath, subjectGroupIds: ids };
}

async function bootstrap() {
  const { outPath, subjectGroupIds } = parseArgs(process.argv.slice(2));

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const clustering = app.get(ClusteringService);
    await clustering.exportClusteringReportToFile({
      outputPath: outPath,
      subjectGroupIds,
    });
    // eslint-disable-next-line no-console
    console.log(`Wrote ${outPath}`);
  } finally {
    await app.close();
  }
  process.exit(0);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('clustering:export failed:', err);
  process.exit(1);
});
