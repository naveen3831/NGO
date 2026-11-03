import React from 'react';

const CauseCard = ({ cause }) => {
  const percentage = cause.targetAmount > 0
    ? Math.min(Math.round((cause.raisedAmount / cause.targetAmount) * 100), 100)
    : 0;

  return (
    <div className="cause-card">
      <img
        src={cause.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'}
        alt={cause.title}
        className="cause-image"
      />
      <div className="cause-body">
        <span className="cause-category">{cause.category || 'General'}</span>
        <h3 className="cause-title">{cause.title}</h3>
        <p className="cause-desc">{cause.description}</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="progress-stats">
            <span><strong>${cause.raisedAmount?.toLocaleString() || 0}</strong> raised</span>
            <span>{percentage}% of ${cause.targetAmount?.toLocaleString()}</span>
          </div>
        </div>

        <button className="btn-donate">Donate Now</button>
      </div>
    </div>
  );
};

export default CauseCard;

