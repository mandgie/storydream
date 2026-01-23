import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import {
  createProject,
  getProject,
  getProjectWithHistory,
  listProjects,
  updateProject,
  deleteProject,
} from './projects.js';
import { getMessages } from './firestore.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create router for API routes
const router = Router();

// Type for route params
interface ProjectParams {
  projectId: string;
}

// ============ Project Routes ============

// List all projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const projects = await listProjects(userId);
    res.json({ projects });
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// Create a new project
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const { name, description, userId } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Project name is required' });
      return;
    }

    const project = await createProject({ name, description, userId });
    res.status(201).json({ project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get a project by ID (includes messages)
router.get('/projects/:projectId', async (req: Request<ProjectParams>, res: Response) => {
  try {
    const { projectId } = req.params;
    const result = await getProjectWithHistory(projectId);

    if (!result) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Update a project
router.patch('/projects/:projectId', async (req: Request<ProjectParams>, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await getProject(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await updateProject(projectId, { name, description });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/projects/:projectId', async (req: Request<ProjectParams>, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await getProject(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await deleteProject(projectId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ============ Message Routes ============

// Get messages for a project
router.get('/projects/:projectId/messages', async (req: Request<ProjectParams>, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await getProject(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const messages = await getMessages(projectId);
    res.json({ messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// ============ Health Check ============

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount router
app.use('/api', router);

// Export app and a function to start the server
export { app };

export function startApiServer(port: number): void {
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}
