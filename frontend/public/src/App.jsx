import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

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
    const interval = setInterval(fetchData, 60000); // हर मिनट
    return () => clearInterval(interval);
  }, []);

  const chartData = stats.map(s => ({
    time: new Date(s.timestamp).toLocaleTimeString(),
    views: s.views,
    likes: s.likes
  }));

  return (
    <div className="App">
      <h1>🔴 YouTube Live Tracker</h1>
      {loading ? (
        <p>⏳ Loading data...</p>
      ) : stats.length === 0 ? (
        <p>📊 Data will appear in 5 minutes...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#ff7300" name="Views" />
              <Line type="monotone" dataKey="likes" stroke="#00c49f" name="Likes" />
            </LineChart>
          </ResponsiveContainer>

          <h2>📈 Recent Stats</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Time</th><th>Views</th><th>Likes</th></tr>
              </thead>
              <tbody>
                {stats.slice(0, 10).map((s, i) => (
                  <tr key={i}>
                    <td>{new Date(s.timestamp).toLocaleString()}</td>
                    <td>{s.views.toLocaleString()}</td>
                    <td>{s.likes.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
