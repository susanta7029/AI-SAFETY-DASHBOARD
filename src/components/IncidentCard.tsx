// IncidentCard.tsx
import React, { useState } from 'react';
import { Incident } from '../types/Incident';

interface IncidentCardProps {
  incident: Incident;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <div className="incident-card">
      <h2>{incident.title}</h2>
      <p><strong>Severity:</strong> {incident.severity}</p>
      <p><strong>Reported At:</strong> {incident.reported_at.toLocaleDateString()}</p>

      {/* "View Details" button to toggle description */}
      <button onClick={toggleDescription}>
        {isDescriptionVisible ? 'Hide Details' : 'View Details'}
      </button>

      {/* Description is toggled based on state */}
      {isDescriptionVisible && <p>{incident.description}</p>}
    </div>
  );
};

export default IncidentCard;
