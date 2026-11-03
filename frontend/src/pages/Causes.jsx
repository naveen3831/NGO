import React, { useEffect, useState } from 'react';
import API from '../services/api';
import CauseCard from '../components/CauseCard';

const Causes = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const { data } = await API.get('/causes');
        setCauses(data);
      } catch (err) {
        // Fallback demo items if backend hasn't been seeded yet
        setCauses([
          {
            _id: '1',
            title: 'Clean Water for Rural Communities',
            description: 'Building solar-powered water filtration systems for over 5,000 villagers.',
            category: 'Water & Sanitation',
            targetAmount: 25000,
            raisedAmount: 18500,
            imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600',
          },
          {
            _id: '2',
            title: 'School Supplies & Digital Labs',
            description: 'Providing computers, books, and uniforms to underprivileged elementary schools.',
            category: 'Education',
            targetAmount: 15000,
            raisedAmount: 9200,
            imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
          },
          {
            _id: '3',
            title: 'Emergency Medical Relief Fund',
            description: 'Delivering urgent medical kits, vaccines, and mobile clinics to remote regions.',
            category: 'Healthcare',
            targetAmount: 40000,
            raisedAmount: 31000,
            imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600',
          },
        ]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCauses();
  }, []);

  return (
    <div className="causes-page">
      <div className="page-header">
        <h2>Active NGO Campaigns</h2>
        <p>Choose a cause close to your heart and make an immediate impact today.</p>
      </div>

      {loading ? (
        <div className="loading">Loading causes...</div>
      ) : (
        <div className="causes-grid">
          {causes.map((cause) => (
            <CauseCard key={cause._id} cause={cause} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Causes;

