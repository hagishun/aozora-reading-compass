import worksRaw from '../../data/works.yml?raw';
import yaml from 'js-yaml';
import type { Work } from '../types/work.js';

interface WorksFile {
  works: Work[];
}

function isWorksFile(value: unknown): value is WorksFile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'works' in value &&
    Array.isArray((value as { works: unknown }).works)
  );
}

/**
 * Parses data/works.yml and returns the list of works.
 * The YAML file is bundled at build time via Vite's `?raw` import,
 * so this function is safe to call from Cloudflare Workers (no filesystem access).
 */
export function loadWorks(): Work[] {
  const parsed = yaml.load(worksRaw);
  if (!isWorksFile(parsed)) {
    throw new Error(
      'data/works.yml is malformed: expected a top-level "works" array.'
    );
  }
  return parsed.works;
}
