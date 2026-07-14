import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

export default function WeeklyActivity({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { day: 'Mon', applications: 0 },
    { day: 'Tue', applications: 0 },
    { day: 'Wed', applications: 0 },
    { day: 'Thu', applications: 0 },
    { day: 'Fri', applications: 0 },
    { day: 'Sat', applications: 0 },
    { day: 'Sun', applications: 0 },
  ];

  return (
    <div className="weekly-container" style={{height: "300px", padding: "1rem"}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
          <Tooltip 
            cursor={{fill: '#F1F5F9'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
