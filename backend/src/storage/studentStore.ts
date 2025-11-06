import fs from 'fs';
import path from 'path';

export type Student = {
  usn: string;
  dob: string; // YYYY-MM-DD
  semester: number;
  name?: string;
  attendance: Record<string, number>;
  grades: Record<string, number>;
  projects: Array<string | { name: string; description?: string }>;
  skills: string[];
};

type Store = {
  students: Student[];
};

const dataDir = path.resolve(__dirname, '../../data');
const dataFile = path.join(dataDir, 'mockStudents.json');

function ensureDataFile(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    const seed: Store = {
      students: [
        {
          usn: '1RV22CS001',
          dob: '2003-08-21',
          semester: 5,
          name: 'Asha Rao',
          attendance: { AI: 88, DBMS: 92, CN: 75 },
          grades: { AI: 9.0, DBMS: 8.5, CN: 7.8 },
          projects: ['AI Chatbot', 'Attendance System'],
          skills: ['Python', 'React', 'ML'],
        },
        {
          usn: '1RV22CS002',
          dob: '2003-04-12',
          semester: 6,
          name: 'Rohit N',
          attendance: { AI: 82, DBMS: 86, CN: 80 },
          grades: { AI: 8.4, DBMS: 8.1, CN: 7.9 },
          projects: ['Network Monitor'],
          skills: ['Java', 'Networks'],
        },
        {
          usn: '1RV22CS003',
          dob: '2003-11-05',
          semester: 4,
          name: 'Sneha K',
          attendance: { AI: 90, DBMS: 78, CN: 84 },
          grades: { AI: 9.2, DBMS: 7.6, CN: 8.2 },
          projects: ['DBMS Visualizer'],
          skills: ['SQL', 'TypeScript'],
        },
      ],
    };
    fs.writeFileSync(dataFile, JSON.stringify(seed, null, 2), 'utf-8');
  }
}

export function readStore(): Store {
  ensureDataFile();
  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw) as Store;
}

export function writeStore(store: Store): void {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2), 'utf-8');
}

export function findStudent(usn: string, dob?: string, semester?: number): Student | undefined {
  const store = readStore();
  return store.students.find((s) => {
    if (s.usn !== usn) return false;
    if (dob && s.dob !== dob) return false;
    if (semester != null && s.semester !== semester) return false;
    return true;
  });
}

export function upsertStudent(student: Student): Student {
  const store = readStore();
  const idx = store.students.findIndex((s) => s.usn === student.usn);
  if (idx >= 0) {
    store.students[idx] = { ...store.students[idx], ...student };
  } else {
    store.students.push(student);
  }
  writeStore(store);
  return student;
}


