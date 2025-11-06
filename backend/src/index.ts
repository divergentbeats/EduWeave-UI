import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { findStudent, upsertStudent, readStore, Student } from './storage/studentStore';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) || ['http://localhost:3000'],
    credentials: true,
  })
);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Students API
app.get('/api/students/:usn', (req: Request, res: Response) => {
  const { usn } = req.params;
  const student = findStudent(usn);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

app.get('/api/students', (_req: Request, res: Response) => {
  res.json(readStore());
});

// Login check: expects usn, dob, semester
app.post('/api/students/login', (req: Request, res: Response) => {
  const { usn, dob, semester } = req.body as { usn?: string; dob?: string; semester?: number };
  if (!usn || !dob || typeof semester !== 'number') {
    return res.status(400).json({ error: 'usn, dob, semester are required' });
  }
  const student = findStudent(usn, dob, semester);
  if (!student) return res.status(404).json({ error: 'No matching record' });
  res.json(student);
});

// Create/Update student
app.post('/api/students', (req: Request, res: Response) => {
  const payload = req.body as Student;
  if (!payload?.usn || !payload?.dob || typeof payload?.semester !== 'number') {
    return res.status(400).json({ error: 'usn, dob, semester required' });
  }
  const saved = upsertStudent(payload);
  res.status(201).json(saved);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});


