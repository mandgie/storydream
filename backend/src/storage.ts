import { Storage } from '@google-cloud/storage';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

// Initialize Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || 'saltfish-434012',
});

const BUCKET_NAME = process.env.STORAGE_BUCKET || 'storydream-data';
const bucket = storage.bucket(BUCKET_NAME);

// Template repo path - this is the default Remotion app
const TEMPLATE_REPO_PATH = 'templates/default';

/**
 * Initialize a new project repository in Cloud Storage
 * Copies the template src/ and initializes a git repo
 */
export async function initializeProjectRepo(projectId: string): Promise<{
  gitRepoPath: string;
  commitSha: string;
}> {
  const gitRepoPath = `repos/${projectId}`;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'storydream-'));

  try {
    console.log(`Initializing repo for project ${projectId}...`);

    // Initialize git repo
    await execAsync('git init', { cwd: tempDir });
    await execAsync('git config user.email "storydream@saltfish.ai"', { cwd: tempDir });
    await execAsync('git config user.name "StoryDream"', { cwd: tempDir });

    // Create README
    await fs.writeFile(
      path.join(tempDir, 'README.md'),
      '# StoryDream Project\n\nThis project was created with StoryDream.\n'
    );

    // Check if template src exists and copy it
    const [templateExists] = await bucket.file(`${TEMPLATE_REPO_PATH}/src/main.tsx`).exists();

    if (templateExists) {
      console.log('Copying template src/ from Cloud Storage...');
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await downloadDirectory(`${TEMPLATE_REPO_PATH}/src`, srcDir);
      console.log('Template src/ copied successfully');
    } else {
      console.log('No template found, creating minimal src/');
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'main.tsx'),
        `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n`
      );
      await fs.writeFile(
        path.join(srcDir, 'App.tsx'),
        `export default function App() {\n  return <div>Hello StoryDream</div>;\n}\n`
      );
    }

    // Commit all files
    await execAsync('git add .', { cwd: tempDir });
    await execAsync('git commit -m "Initial commit"', { cwd: tempDir });

    // Get the current commit SHA
    const { stdout: commitSha } = await execAsync('git rev-parse HEAD', { cwd: tempDir });
    const sha = commitSha.trim();

    // Upload to Cloud Storage
    console.log(`Uploading repo to gs://${BUCKET_NAME}/${gitRepoPath}...`);
    await uploadDirectory(tempDir, gitRepoPath);

    console.log(`Project repo initialized: ${gitRepoPath} at ${sha}`);
    return { gitRepoPath, commitSha: sha };
  } finally {
    // Cleanup temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

/**
 * Update the template repo in Cloud Storage from the current remotion-app
 * Run this once to set up the template
 */
export async function updateTemplateFromLocal(localRepoPath: string): Promise<void> {
  console.log(`Updating template from ${localRepoPath}...`);

  // Ensure it's a git repo
  try {
    await execAsync('git status', { cwd: localRepoPath });
  } catch {
    throw new Error(`${localRepoPath} is not a git repository`);
  }

  // Upload to Cloud Storage
  await uploadDirectory(localRepoPath, TEMPLATE_REPO_PATH);
  console.log('Template updated successfully');
}

/**
 * Download a project repo from Cloud Storage to a local directory
 */
export async function downloadProjectRepo(
  projectId: string,
  targetDir: string
): Promise<void> {
  const gitRepoPath = `repos/${projectId}`;
  console.log(`Downloading project ${projectId} to ${targetDir}...`);
  await downloadDirectory(gitRepoPath, targetDir);
}

/**
 * Download only the src/ directory from a project
 * This is much faster than downloading the full repo
 */
export async function downloadProjectSrc(
  projectId: string,
  targetDir: string
): Promise<void> {
  const srcPath = `repos/${projectId}/src`;
  console.log(`Downloading src/ for project ${projectId} to ${targetDir}...`);
  await downloadDirectory(srcPath, targetDir);
}

/**
 * Upload changes from a local directory back to Cloud Storage
 */
export async function uploadProjectRepo(
  projectId: string,
  sourceDir: string
): Promise<string> {
  const gitRepoPath = `repos/${projectId}`;

  // Get current commit SHA
  const { stdout: commitSha } = await execAsync('git rev-parse HEAD', { cwd: sourceDir });
  const sha = commitSha.trim();

  console.log(`Uploading project ${projectId} (commit: ${sha})...`);
  await uploadDirectory(sourceDir, gitRepoPath);

  return sha;
}

/**
 * Upload only the src/ directory back to Cloud Storage
 * Returns a timestamp-based version ID since we're not using git here
 */
export async function uploadProjectSrc(
  projectId: string,
  sourceDir: string
): Promise<string> {
  const srcPath = `repos/${projectId}/src`;

  console.log(`Uploading src/ for project ${projectId}...`);
  await uploadDirectory(sourceDir, srcPath);

  // Return timestamp as version identifier
  const versionId = new Date().toISOString().replace(/[:.]/g, '-');
  console.log(`Uploaded src/ with version: ${versionId}`);
  return versionId;
}

/**
 * Delete a project repo from Cloud Storage
 */
export async function deleteProjectRepo(projectId: string): Promise<void> {
  const gitRepoPath = `repos/${projectId}`;
  console.log(`Deleting project repo: ${gitRepoPath}...`);

  const [files] = await bucket.getFiles({ prefix: gitRepoPath });
  await Promise.all(files.map((file) => file.delete()));

  console.log(`Deleted ${files.length} files from ${gitRepoPath}`);
}

// ============ Helper functions ============

async function uploadDirectory(localPath: string, gcsPath: string): Promise<void> {
  const files = await getFilesRecursively(localPath);

  await Promise.all(
    files.map(async (filePath) => {
      const relativePath = path.relative(localPath, filePath);
      const gcsFilePath = `${gcsPath}/${relativePath}`;
      await bucket.upload(filePath, { destination: gcsFilePath });
    })
  );
}

async function downloadDirectory(gcsPath: string, localPath: string): Promise<void> {
  const [files] = await bucket.getFiles({ prefix: gcsPath });

  await Promise.all(
    files.map(async (file) => {
      const relativePath = file.name.replace(`${gcsPath}/`, '');
      const localFilePath = path.join(localPath, relativePath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });

      // Download file
      await file.download({ destination: localFilePath });
    })
  );
}

async function getFilesRecursively(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFilesRecursively(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// ============ Session Data Functions ============

// Claude Code session path inside container
const CLAUDE_SESSION_PATH = 'projects/-app-remotion-app';

/**
 * Download Claude Code session data from Cloud Storage
 * Session files are stored at repos/{projectId}/.claude/
 */
export async function downloadSessionData(
  projectId: string,
  targetDir: string
): Promise<boolean> {
  const sessionPath = `repos/${projectId}/.claude`;
  console.log(`Checking for session data at gs://${BUCKET_NAME}/${sessionPath}...`);

  const [files] = await bucket.getFiles({ prefix: sessionPath });

  if (files.length === 0) {
    console.log('No existing session data found');
    return false;
  }

  console.log(`Downloading ${files.length} session files to ${targetDir}...`);
  await downloadDirectory(sessionPath, targetDir);
  console.log('Session data downloaded successfully');
  return true;
}

/**
 * Upload Claude Code session data to Cloud Storage
 * Only uploads the session file for the specific project path
 */
export async function uploadSessionData(
  projectId: string,
  sourceDir: string
): Promise<void> {
  const sessionPath = `repos/${projectId}/.claude`;
  const localSessionPath = path.join(sourceDir, CLAUDE_SESSION_PATH);

  // Check if session directory exists
  try {
    await fs.access(localSessionPath);
  } catch {
    console.log('No session data to upload (directory does not exist)');
    return;
  }

  // Check if there are any .jsonl files
  const files = await fs.readdir(localSessionPath);
  const jsonlFiles = files.filter((f) => f.endsWith('.jsonl'));

  if (jsonlFiles.length === 0) {
    console.log('No session files to upload');
    return;
  }

  console.log(`Uploading ${jsonlFiles.length} session files to gs://${BUCKET_NAME}/${sessionPath}...`);

  // Upload the session directory
  await uploadDirectory(sourceDir, sessionPath);
  console.log('Session data uploaded successfully');
}

export { bucket, storage };
