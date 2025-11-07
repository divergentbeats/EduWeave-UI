import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-brand/10 grid place-items-center text-brand font-bold">E</div>
          <span className="font-semibold tracking-tight">EduWeave – AI Insight Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm"
            href="https://github.com" target="_blank"
          >
            Connect GitHub
          </Link>
          <Link
            className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm"
            href="https://linkedin.com" target="_blank"
          >
            Connect LinkedIn
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}


