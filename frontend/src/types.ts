// Shared types for StoryDream frontend

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  gitRepoPath: string;
  currentCommitSha: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
}

export interface ChatMessage {
  id?: string;
  projectId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}
