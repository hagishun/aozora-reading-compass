/**
 * Represents a single work entry from data/works.yml.
 * Fields mirror the YAML schema exactly.
 */
export interface Work {
  /** Stable kebab-case slug */
  id: string;
  /** Work title */
  title: string;
  /** Author name */
  author: string;
  /** Canonical URL on Aozora Bunko */
  aozora_url: string;
  /** Reader states this work is suited for */
  states: Array<'recovery' | 'thinking' | 'stimulus' | 'quiet'>;
  /** Thematic tags */
  themes: string[];
  /** Estimated reading time in minutes */
  length_min: number;
  /** Whether a short AI-generated introduction (not a summary of the text) is permitted */
  summary_ok: boolean;
  /** Optional freeform note */
  note?: string;
}
