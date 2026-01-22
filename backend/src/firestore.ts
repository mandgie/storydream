import { Firestore, Timestamp } from '@google-cloud/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ChatMessage, AgentAction } from './types.js';

// Initialize Firestore
// Uses application default credentials (gcloud auth)
const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'saltfish-434012',
  databaseId: 'saltfish',
  ignoreUndefinedProperties: true,  // Don't fail on undefined fields
});

// Collections
const projectsCollection = firestore.collection('projects');

// Helper to convert Firestore timestamps to Date
function toDate(timestamp: Timestamp | Date | undefined): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  return timestamp;
}

// ============ Projects ============

export async function createProject(data: {
  id?: string;  // Optional - if not provided, generates new UUID
  name: string;
  description?: string;
  userId?: string;
  gitRepoPath: string;
  currentCommitSha: string;
}): Promise<Project> {
  const id = data.id || uuidv4();
  const now = new Date();

  const project: Project = {
    id,
    userId: data.userId || 'anonymous',
    name: data.name,
    description: data.description,
    gitRepoPath: data.gitRepoPath,
    currentCommitSha: data.currentCommitSha,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };

  await projectsCollection.doc(id).set({
    ...project,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    lastOpenedAt: Timestamp.fromDate(now),
  });

  console.log(`Created project: ${id} - ${data.name}`);
  return project;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const doc = await projectsCollection.doc(projectId).get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    ...data,
    id: doc.id,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    lastOpenedAt: toDate(data.lastOpenedAt),
  } as Project;
}

export async function updateProject(
  projectId: string,
  updates: Partial<Pick<Project, 'name' | 'description' | 'currentCommitSha' | 'thumbnailUrl' | 'videoSettings' | 'agentSessionId'>>
): Promise<void> {
  await projectsCollection.doc(projectId).update({
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function updateProjectLastOpened(projectId: string): Promise<void> {
  await projectsCollection.doc(projectId).update({
    lastOpenedAt: Timestamp.now(),
  });
}

export async function listProjects(userId?: string): Promise<Project[]> {
  let query = projectsCollection.orderBy('lastOpenedAt', 'desc');

  if (userId) {
    query = projectsCollection
      .where('userId', '==', userId)
      .orderBy('lastOpenedAt', 'desc');
  }

  const snapshot = await query.limit(50).get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      lastOpenedAt: toDate(data.lastOpenedAt),
    } as Project;
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  // Delete all messages first
  const messagesSnapshot = await projectsCollection
    .doc(projectId)
    .collection('messages')
    .get();

  const batch = firestore.batch();
  messagesSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  batch.delete(projectsCollection.doc(projectId));

  await batch.commit();
  console.log(`Deleted project: ${projectId}`);
}

// ============ Chat Messages ============

export async function saveMessage(
  projectId: string,
  message: Omit<ChatMessage, 'id' | 'projectId' | 'createdAt'>
): Promise<ChatMessage> {
  const id = uuidv4();
  const now = new Date();

  const chatMessage: ChatMessage = {
    id,
    projectId,
    role: message.role,
    content: message.content,
    actions: message.actions,
    createdAt: now,
  };

  await projectsCollection
    .doc(projectId)
    .collection('messages')
    .doc(id)
    .set({
      ...chatMessage,
      createdAt: Timestamp.fromDate(now),
    });

  return chatMessage;
}

export async function getMessages(projectId: string): Promise<ChatMessage[]> {
  const snapshot = await projectsCollection
    .doc(projectId)
    .collection('messages')
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      projectId,
      createdAt: toDate(data.createdAt),
    } as ChatMessage;
  });
}

export async function getRecentMessages(
  projectId: string,
  limit: number = 20
): Promise<ChatMessage[]> {
  const snapshot = await projectsCollection
    .doc(projectId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  // Reverse to get chronological order
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        projectId,
        createdAt: toDate(data.createdAt),
      } as ChatMessage;
    })
    .reverse();
}

// ============ Export Firestore instance for direct access if needed ============

export { firestore };
