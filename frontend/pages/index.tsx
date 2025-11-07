import Head from 'next/head';
import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import ChartCard from '@/components/ChartCard';
import ChatBox from '@/components/ChatBox';
import data from '@/data/mockData.json';

export default function HomePage() {
  const [insightText, setInsightText] = useState({
    academic: data.insights.academic,
    behavioral: data.insights.behavioral,
    career: data.insights.career
  });
  const [loading, setLoading] = useState(false);

  const bar = useMemo(() => {
    const labels = Object.keys(data.grades);
    const vals = labels.map(l => (data.grades as any)[l] as number);
    return { labels, vals };
  }, []);

  const doughnut = useMemo(() => {
    const labels = Object.keys(data.attendance);
    const vals = labels.map(l => (data.attendance as any)[l] as number);
    return { labels, vals };
  }, []);

  const radar = useMemo(() => {
    const labels = Object.keys(data.skills);
    const vals = labels.map(l => (data.skills as any)[l] as number);
    return { labels, vals };
  }, []);

  const generateInsights = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setInsightText(prev => ({
      academic: prev.academic + ' Reinforce linear algebra and probability.',
      behavioral: prev.behavioral + ' Keep weekly summaries of progress.',
      career: prev.career + ' Explore internships in ML ops.'
    }));
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>EduWeave – AI Insight Dashboard</title>
      </Head>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left: 60% width (lg:6 out of 10 columns) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <ChartCard type="bar" title="Academic Performance" labels={bar.labels} data={bar.vals} />
              </div>
              <div className="md:col-span-1">
                <ChartCard type="doughnut" title="Attendance Tracker" labels={doughnut.labels} data={doughnut.vals} />
              </div>
              <div className="md:col-span-2">
                <ChartCard type="radar" title="Skill Radar" labels={radar.labels} data={radar.vals} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Project Summary">
                <ul className="space-y-2">
                  {data.projects.map((p) => (
                    <li key={p} className="flex items-center justify-between">
                      <span className="text-sm">{p}</span>
                      <span className="text-[10px] rounded bg-gray-100 px-2 py-1">active</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card
                title="AI Insights"
                actions={
                  <button
                    onClick={generateInsights}
                    className="px-3 py-1.5 rounded-md bg-brand text-white text-sm disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Insights'}
                  </button>
                }
              >
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Academic:</strong> {insightText.academic}</p>
                  <p><strong>Behavioral:</strong> {insightText.behavioral}</p>
                  <p><strong>Career:</strong> {insightText.career}</p>
                </div>
              </Card>
              <Card title="Career Suggestions">
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Data Science Internships</li>
                  <li>Research Assistant in ML Lab</li>
                  <li>Open-source contributions in AI</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Right: 40% width (lg:4 out of 10 columns) */}
          <div className="lg:col-span-4 lg:h-[78vh]">
            <ChatBox />
          </div>
        </div>
      </main>
    </>
  );
}


