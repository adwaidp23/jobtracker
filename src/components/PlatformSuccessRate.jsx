import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './PlatformSuccessRate.css';

const COLORS = ['#3B82F6', '#05CD99', '#FFCE20', '#F43F5E', '#8B5CF6'];

export default function PlatformSuccessRate({ data }) {
  const chartData = data && data.length > 0 ? data : [{ name: 'No Data', value: 100 }];
  
  return (
    <div className="platform-container" style={{height: "300px"}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value) => `${value}%`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#64748B' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
