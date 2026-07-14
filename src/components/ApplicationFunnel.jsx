import React from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from 'recharts';
import './ApplicationFunnel.css';

export default function ApplicationFunnel({ data }) {
  // Convert object like {"Applied": 50, "Assessment": 20, ...} to Recharts format
  const chartData = data && Object.keys(data).length > 0 ? Object.entries(data).map(([name, value], index) => {
    const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
    return {
      value,
      name,
      fill: colors[index % colors.length]
    };
  }) : [
    { value: 0, name: 'Applied', fill: '#3B82F6' }
  ];

  return (
    <div className="funnel-container" style={{height: "300px"}}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Funnel
            dataKey="value"
            data={chartData}
            isAnimationActive
          >
            <LabelList position="right" fill="#4B5563" stroke="none" dataKey="name" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
