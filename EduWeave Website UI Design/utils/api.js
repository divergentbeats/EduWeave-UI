export async function getStudentData(usn) {
  const res = await fetch(`/data/${usn}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Student JSON not found');
  return await res.json();
}

export async function listStudents() {
  const res = await fetch('/data/students_list.csv', { cache: 'no-store' });
  if (!res.ok) return [];
  const text = await res.text();
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [usn, name, semester, domain] = line.split(',');
      return { usn, name, semester: Number(semester), domain };
    });
}
export async function getInsights(studentData) {
  try {
    const response = await fetch('http://127.0.0.1:5000/generate_insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
}

export async function askAI(query) {
  try {
    const response = await fetch('http://127.0.0.1:5000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error asking AI:', error);
    throw error;
  }
}
