import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrafficGraph = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrafficData = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const timeSlots = [];
      const counts = [];
      
      // Generate time slots from 8 AM to current time in 2-hour intervals
      const startHour = 8;
      const currentHour = new Date().getHours();
      
      for (let hour = startHour; hour <= Math.min(currentHour, 22); hour += 2) {
        // Format end hour properly - if it's midnight (24), change to 23:59:59
        const endHour = hour + 2;
        const endTimeString = endHour >= 24 
          ? `${currentDate}T23:59:59`
          : `${currentDate}T${endHour.toString().padStart(2, '0')}:00:00`;
  
        const startTime = `${currentDate}T${hour.toString().padStart(2, '0')}:00:00`;
        
        const response = await axios.get(
          `http://localhost:8080/api/vehicles/count/interval?startTime=${startTime}&endTime=${endTimeString}`
        );
        
        timeSlots.push(`${hour}:00-${endHour === 24 ? '00:00' : `${endHour}:00`}`);
        counts.push(response.data.count);
      }
  
      setTrafficData({ timeSlots, counts });
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching traffic data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
    // Refresh every 30 minutes
    const interval = setInterval(fetchTrafficData, 1800000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center m-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  const chartData = {
    labels: trafficData.timeSlots,
    datasets: [
      {
        label: 'Vehicle Traffic',
        data: trafficData.counts,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Traffic Flow Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Vehicles',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
        },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="card-title">Traffic Flow</h5>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={fetchTrafficData}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
        <div style={{ height: '600px' }}> {/* Added wrapper div with fixed height */}
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TrafficGraph;