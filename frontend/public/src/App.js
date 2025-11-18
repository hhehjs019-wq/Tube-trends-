import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://tube-trends.onrender.com/api/stats');
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const chartData = stats.map(s => ({
    time: new Date(s.timestamp).toLocaleTimeString(),
    views: s.views,
    likes: s.likes
  }));

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <h1>🔴 YouTube Live Tracker</h1>
      {loading ? <p>⏳ Loading...</p> : stats.length === 0 ? <p>📊 Data will appear soon...</p> : (
        <>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#ff7300" name="Views" strokeWidth={3} />
              <Line type="monotone" dataKey="likes" stroke="#00c49f" name="Likes" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          <h2 style={{ marginTop: '40px' }}>📈 Recent Stats</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <thead style={{ background: '#f5f5f5' }}>
              <tr>
                <th style={{ padding: '12px', border: '1px solid #eee' }}>Time</th>
                <th style={{ padding: '12px', border: '1px solid #eee' }}>Views</th>
                <th style={{ padding: '12px', border: '1px solid #eee' }}>Likes</th>
              </tr>
            </thead>
            <tbody>
              {stats.slice(0, 10).map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px', border: '1px solid #eee' }}>{new Date(s.timestamp).toLocaleString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #eee' }}>{s.views.toLocaleString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #eee' }}>{s.likes.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
