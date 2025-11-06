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
