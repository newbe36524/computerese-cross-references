#!/usr/bin/env node
/**
 * Main CLI entry point for computerese-cross-references.
 *
 * Multi-format data.yaml converter CLI.
 *
 * Converts data.yaml into various output formats including:
 * - CSV
 * - Markdown
 * - HTML
 * - Word (.docx)
 * - PDF
 *
 * Usage:
 *   node dist/cli.js convert [options]
 *   node dist/cli.js parse-readme
 *   node dist/cli.js validate-data-yaml
 *   node dist/cli.js validate-conversions
 */

import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseReadme } from './commands/parseReadme.js';
import { validateDataYaml } from './commands/validateDataYaml.js';
import { convertData } from './commands/convertData.js';
import { validateConversions } from './commands/validateConversions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get project root directory (parent of dist/)
const projectRoot = join(__dirname, '..');

const program = new Command();

program
  .name('computerese')
  .description('Computer terminology cross-reference data converter')
  .version('1.0.0');

/**
 * Convert command - convert data.yaml to various formats
 */
program
  .command('convert')
  .description('Convert data.yaml into various output formats')
  .option('-f, --format <formats...>', 'Output format(s): csv, markdown, html, docx, pdf, all', ['all'])
  .option('-o, --output <dir>', 'Output directory', join(projectRoot, 'pkg'))
  .option('--dry-run', 'Validate without generating files')
  .option('-v, --verbose', 'Show detailed progress')
  .option('--data-yaml <path>', 'Path to data.yaml file', join(projectRoot, 'data.yaml'))
  .action(async (options) => {
    const exitCode = await convertData(
      options.dataYaml,
      options.output,
      options.format,
      options.dryRun,
      options.verbose
    );
    process.exit(exitCode);
  });

/**
 * Parse README command - extract terms from README.md and generate data.yaml
 */
program
  .command('parse-readme')
  .description('Parse README.md to extract terms and generate data.yaml')
  .option('--readme <path>', 'Path to README.md file', join(projectRoot, 'README.md'))
  .option('-o, --output <path>', 'Path to output data.yaml file', join(projectRoot, 'data.yaml'))
  .action((options) => {
    parseReadme(options.readme, options.output);
    process.exit(0);
  });

/**
 * Validate data.yaml command
 */
program
  .command('validate-data-yaml')
  .description('Validate data.yaml file integrity and correctness')
  .option('--readme <path>', 'Path to README.md file', join(projectRoot, 'README.md'))
  .option('--data-yaml <path>', 'Path to data.yaml file', join(projectRoot, 'data.yaml'))
  .action((options) => {
    const exitCode = validateDataYaml(options.readme, options.dataYaml);
    process.exit(exitCode);
  });

/**
 * Validate conversions command
 */
program
  .command('validate-conversions')
  .description('Validate converted outputs for data integrity')
  .option('-f, --format <formats...>', 'Format(s) to validate: csv, markdown, html, docx, pdf, all', ['all'])
  .option('--data-yaml <path>', 'Path to data.yaml', join(projectRoot, 'data.yaml'))
  .option('--dist-dir <dir>', 'Output directory', join(projectRoot, 'pkg'))
  .action((options) => {
    const exitCode = validateConversions(
      options.dataYaml,
      options.distDir,
      options.format
    );
    process.exit(exitCode);
  });

// Parse command line arguments
program.parseAsync(process.argv).catch((error) => {
  console.error(error);
  process.exit(1);
});
