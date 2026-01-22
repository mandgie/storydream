import { v4 as uuidv4 } from 'uuid';
import {
  createProject as createProjectInDb,
  getProject as getProjectFromDb,
  updateProject as updateProjectInDb,
  updateProjectLastOpened,
  listProjects as listProjectsFromDb,
  deleteProject as deleteProjectFromDb,
  getMessages,
  getRecentMessages,
} from './firestore.js';
import {
  initializeProjectRepo,
  deleteProjectRepo,
} from './storage.js';
import type { Project, ChatMessage } from './types.js';

/**
 * Create a new project with initialized git repo
 */
export async function createProject(data: {
  name: string;
  description?: string;
  userId?: string;
}): Promise<Project> {
  // Generate project ID upfront so repo and database use the same ID
  const projectId = uuidv4();

  // Initialize git repo in Cloud Storage with the project ID
  const { gitRepoPath, commitSha } = await initializeProjectRepo(projectId);

  // Create project in Firestore with the same ID
  const project = await createProjectInDb({
    id: projectId,
    name: data.name,
    description: data.description,
    userId: data.userId,
    gitRepoPath,
    currentCommitSha: commitSha,
  });

  return project;
}

/**
 * Get a project by ID
 */
export async function getProject(projectId: string): Promise<Project | null> {
  return getProjectFromDb(projectId);
}

/**
 * Get a project with its chat history
 */
export async function getProjectWithHistory(projectId: string): Promise<{
  project: Project;
  messages: ChatMessage[];
} | null> {
  const project = await getProjectFromDb(projectId);
  if (!project) return null;

  const messages = await getMessages(projectId);

  // Update last opened timestamp
  await updateProjectLastOpened(projectId);

  return { project, messages };
}

/**
 * List all projects for a user (or all if no user specified)
 */
export async function listProjects(userId?: string): Promise<Project[]> {
  return listProjectsFromDb(userId);
}

/**
 * Update project metadata
 */
export async function updateProject(
  projectId: string,
  updates: {
    name?: string;
    description?: string;
    currentCommitSha?: string;
    thumbnailUrl?: string;
    agentSessionId?: string;
  }
): Promise<void> {
  await updateProjectInDb(projectId, updates);
}

/**
 * Delete a project and its git repo
 */
export async function deleteProject(projectId: string): Promise<void> {
  const project = await getProjectFromDb(projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  // Delete git repo from Cloud Storage
  await deleteProjectRepo(projectId);

  // Delete from Firestore (including messages)
  await deleteProjectFromDb(projectId);
}

/**
 * Get conversation context for agent initialization
 * Returns recent messages formatted for injection into agent context
 */
export async function getConversationContext(
  projectId: string,
  maxMessages: number = 20
): Promise<string> {
  const messages = await getRecentMessages(projectId, maxMessages);

  if (messages.length === 0) {
    return '';
  }

  const formattedMessages = messages
    .map((m) => {
      const role = m.role === 'user' ? 'User' : 'Assistant';
      const content = m.content.length > 500
        ? m.content.substring(0, 500) + '...'
        : m.content;
      return `[${role}]: ${content}`;
    })
    .join('\n\n');

  return `
## Previous Conversation Context

This is a continuation of an existing project. Here's the recent conversation history:

${formattedMessages}

## Current Project State

The code has been restored to the latest saved state. Continue helping the user from where you left off.
`;
}
