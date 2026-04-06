import { useState } from 'react';
import { ELEMENTS } from './constants/elements';
import { Element } from './types';
import { ElementCard } from './components/ElementCard';
import { ElementDetails } from './components/ElementDetails';
import { Beaker, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredElements = ELEMENTS.filter(el => 
    el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    el.number.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Beaker className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              Bảng Tuần Hoàn Thông Minh
            </h1>
          </div>

          <div className="relative w-full max-w-xs ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm nguyên tố..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Hệ Thống Tuần Hoàn</h2>
          <p className="text-slate-500">Khám phá các nguyên tố hóa học và nghe thông tin chi tiết bằng AI.</p>
        </div>

        {/* Periodic Table Grid */}
        <div className="overflow-x-auto pb-8">
          <div 
            className="grid gap-2 min-w-[1200px]"
            style={{ 
              gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
            }}
          >
            {filteredElements.map((element) => (
              <motion.div
                key={element.number}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  gridColumnStart: element.xpos,
                  gridRowStart: element.ypos
                }}
              >
                <ElementCard
                  element={element}
                  onClick={setSelectedElement}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { label: "Phi kim lưỡng nguyên tử", color: "bg-blue-100" },
            { label: "Phi kim đa nguyên tử", color: "bg-blue-50" },
            { label: "Khí hiếm", color: "bg-purple-100" },
            { label: "Kim loại kiềm", color: "bg-red-100" },
            { label: "Kim loại kiềm thổ", color: "bg-orange-100" },
            { label: "Á kim", color: "bg-green-100" },
            { label: "Kim loại chuyển tiếp", color: "bg-yellow-100" },
            { label: "Kim loại sau chuyển tiếp", color: "bg-gray-100" },
            { label: "Lanthan", color: "bg-pink-100" },
            { label: "Actini", color: "bg-emerald-100" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${item.color} border border-slate-300`} />
              <span className="text-xs font-medium text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </main>

      <ElementDetails
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
      />

      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© 2026 Bảng Tuần Hoàn Thông Minh - Powered by Gemini AI</p>
      </footer>
    </div>
  );
}
