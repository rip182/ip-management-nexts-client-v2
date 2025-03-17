import { useState } from 'react';
import api from '@/lib/axios'; // Axios instance configured with Sanctum token

// Define the shape of an IP address object (adjust based on your backend)
type IPAddress = {
  id: number;
  ip_address: string;
  label: string;
  comment: string;
};

// Define filter criteria type
type FilterCriteria = {
  ipStart?: string;
  ipEnd?: string;
  label?: string;
  comment?: string;
};

// Props for the component
type FilterComponentProps = {
  onFilterApply: (filteredIPs: IPAddress[]) => void; // Callback to update parent component
};

export default function IPFilter({ onFilterApply }: FilterComponentProps) {
  const [filters, setFilters] = useState<FilterCriteria>({}); // State for filter inputs
  const [error, setError] = useState<string | null>(null);    // Error state

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters by making an API call
  const applyFilters = async () => {
    try {
      const response = await api.get<IPAddress[]>('/api/ips', { params: filters });
      onFilterApply(response.data); // Pass filtered IPs to parent
      setError(null);
    } catch (err) {
      setError('Failed to apply filters. Please try again.');
    }
  };

  // Clear filters and reset the list
  const clearFilters = () => {
    setFilters({});
    onFilterApply([]); // Optionally fetch all IPs again instead
  };

  return (
    <div className="filter-component" style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Filter IPs</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>IP Start: </label>
        <input
          type="text"
          name="ipStart"
          value={filters.ipStart || ''}
          onChange={handleInputChange}
          placeholder="e.g., 192.168.1.1"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>IP End: </label>
        <input
          type="text"
          name="ipEnd"
          value={filters.ipEnd || ''}
          onChange={handleInputChange}
          placeholder="e.g., 192.168.1.255"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Label: </label>
        <input
          type="text"
          name="label"
          value={filters.label || ''}
          onChange={handleInputChange}
          placeholder="e.g., Office Router"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Comment: </label>
        <input
          type="text"
          name="comment"
          value={filters.comment || ''}
          onChange={handleInputChange}
          placeholder="e.g., Main gateway"
        />
      </div>
      <button onClick={applyFilters} style={{ marginRight: '10px' }}>
        Apply Filters
      </button>
      <button onClick={clearFilters}>Clear Filters</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}