import React, { useState } from 'react';
import './App.css';
import IncidentCard from './components/IncidentCard';
import { Incident } from './types/Incident';

const initialIncidents: Incident[] = [
  {
    id: 1,
    title: 'Biased Recommendation Algorithm',
    severity: 'Medium',
    reported_at: new Date('2025-03-15T15:30:00'),
    description: 'The recommendation algorithm was found to favor certain types of content over others, which could lead to biased decision-making in AI systems.',
  },
  {
    id: 2,
    title: 'LLM Hallucination in Critical Info',
    severity: 'High',
    reported_at: new Date('2025-04-01T20:00:00'),
    description: 'The AI model generated inaccurate responses in critical scenarios, such as medical and legal queries, potentially causing harm.',
  },
  {
    id: 3,
    title: 'Minor Data Leak via Chatbot',
    severity: 'Low',
    reported_at: new Date('2025-03-20T14:45:00'),
    description: 'A chatbot inadvertently shared personal data due to improper security measures, exposing minimal user information.',
  },
  {
    id: 4,
    title: 'Data Privacy Breach via AI',
    severity: 'Critical',
    reported_at: new Date('2025-01-30T13:20:00'),
    description: 'A serious breach occurred when an AI system mishandled sensitive user data, exposing it to unauthorized access.',
  },
];

const App = () => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newIncident, setNewIncident] = useState<Incident>({
    id: 0,
    title: '',
    severity: 'Low',
    description: '',
    reported_at: new Date(),
  });
  const [formError, setFormError] = useState<string>('');
  const [showForm, setShowForm] = useState(false); // Toggle for showing/hiding form

  const itemsPerPage = 3;

  const filteredIncidents = incidents
    .filter((incident) => {
      const matchesSeverity = filter === 'All' || incident.severity === filter;
      const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase());
      const incidentDate = incident.reported_at;
      const matchesDateRange =
        (!startDate || incidentDate >= new Date(startDate)) &&
        (!endDate || incidentDate <= new Date(endDate));
      return matchesSeverity && matchesSearch && matchesDateRange;
    });

  const sortedIncidents = sortOrder === 'Newest'
    ? filteredIncidents.sort((a, b) => b.reported_at.getTime() - a.reported_at.getTime())
    : filteredIncidents.sort((a, b) => a.reported_at.getTime() - b.reported_at.getTime());

  const totalPages = Math.ceil(sortedIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncidents = sortedIncidents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewIncident({ ...newIncident, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newIncident.title || !newIncident.description || !newIncident.severity) {
      setFormError("All fields are required.");
      return;
    }

    setFormError('');

    const newIncidentWithId = {
      ...newIncident,
      id: incidents.length + 1,
      reported_at: new Date(),
    };
    setIncidents([...incidents, newIncidentWithId]);

    setNewIncident({
      id: 0,
      title: '',
      severity: 'Low',
      description: '',
      reported_at: new Date(),
    });

    setShowForm(false); // Hide form after submit
  };

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      <h1>AI Safety Incident Dashboard</h1>

      {/* Top Controls Row */}
      <div className="top-controls" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
        <div className="filter-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', flex: 1 }}>
          <label htmlFor="search">Search by Title: </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incidents by title"
          />
          <label htmlFor="filter">Filter by Severity: </label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <label htmlFor="startDate">Start Date: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate">End Date: </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <label htmlFor="sort">Sort by Date: </label>
          <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>
        <button
          className="add-incident-button"
          onClick={() => setShowForm(prev => !prev)}
          style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
        >
          {showForm ? 'Cancel' : 'Add New Incident'}
        </button>
      </div>

      {/* Incident Cards */}
      {paginatedIncidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}

      {/* Pagination */}
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Conditional Form */}
      {showForm && (
        <>
          <h2>Add New Incident</h2>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newIncident.title}
              onChange={handleInputChange}
              required
            />
            <br />
            <label htmlFor="severity">Severity: </label>
            <select
              id="severity"
              name="severity"
              value={newIncident.severity}
              onChange={handleInputChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <br />
            <label htmlFor="description">Description: </label>
            <textarea
              id="description"
              name="description"
              value={newIncident.description}
              onChange={handleInputChange}
              required
            />
            <br />
            <button type="submit">Add Incident</button>
          </form>
        </>
      )}
    </div>
  );
};

export default App;
