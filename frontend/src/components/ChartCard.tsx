import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import Card from './Card';
import { buildBarConfig, buildDoughnutConfig, buildRadarConfig } from '@/utils/charts';

type ChartCardProps =
  | { type: 'bar'; title: string; labels: string[]; data: number[] }
  | { type: 'doughnut'; title: string; labels: string[]; data: number[] }
  | { type: 'radar'; title: string; labels: string[]; data: number[] };

export default function ChartCard(props: ChartCardProps) {
  const { title } = props as any;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card title={title}>
        <div className="h-64">
          {props.type === 'bar' && (
            <Bar {...buildBarConfig(props.labels, props.data)} />
          )}
          {props.type === 'doughnut' && (
            <Doughnut {...buildDoughnutConfig(props.labels, props.data)} />
          )}
          {props.type === 'radar' && (
            <Radar {...buildRadarConfig(props.labels, props.data)} />
          )}
        </div>
      </Card>
    </motion.div>
  );
}


