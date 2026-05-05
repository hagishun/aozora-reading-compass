import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import type { Work } from '../types/work.js';

interface WorksFile {
  works: Work[];
}

/**
 * Reads data/works.yml and returns the list of works.
 * Intended for build-time use in Astro pages (getStaticPaths, etc.).
 */
export function loadWorks(): Work[] {
  const filePath = join(process.cwd(), 'data', 'works.yml');
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = yaml.load(raw) as WorksFile;
  return parsed.works;
}
