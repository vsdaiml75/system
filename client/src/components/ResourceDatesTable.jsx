import React, { useState } from 'react';

function ResourceDatesTable({ 
  numberOfResources,
  distribution,
  onDatesChange 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [resourceDates, setResourceDates] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({
    count: '',
    type: '',
    startDate: '',
    endDate: '',
    onboardDate: ''
  });

  const getAvailableTypes = () => {
    const currentCounts = resourceDates.reduce((acc, group) => {
      if (group.type) {
        acc[group.type] = (acc[group.type] || 0) + parseInt(group.count);
      }
      return acc;
    }, {});

    const types = {
      fullTime: { label: 'Full-time', count: distribution.fullTime },
      partTime: { label: 'Part-time', count: distribution.partTime },
      contract: { label: 'Contract', count: distribution.contract },
      intern: { label: 'Intern', count: distribution.intern }
    };

    return Object.entries(types).filter(([key, type]) => {
      const currentCount = currentCounts[key] || 0;
      return currentCount < type.count;
    });
  };

  const handleGroupAdd = () => {
    const count = parseInt(currentGroup.count);
    if (!count || !currentGroup.type || !currentGroup.startDate || 
        !currentGroup.endDate || !currentGroup.onboardDate) return;

    // Validate count against available resources of selected type
    const currentTypeCount = resourceDates.reduce((acc, group) => {
      if (group.type === currentGroup.type) {
        return acc + parseInt(group.count);
      }
      return acc;
    }, 0);
    
    const maxForType = distribution[currentGroup.type] || 0;
    
    if (currentTypeCount + count > maxForType) {
      alert(`You can only add ${maxForType - currentTypeCount} more resources of type ${getTypeLabel(currentGroup.type)}`);
      return;
    }

    // Add the group as a single entry
    const newGroup = {
      id: resourceDates.length + 1,
      ...currentGroup,
      count: count
    };

    const updatedDates = [...resourceDates, newGroup];
    setResourceDates(updatedDates);
    onDatesChange(updatedDates);
    setCurrentGroup({
      count: '',
      type: '',
      startDate: '',
      endDate: '',
      onboardDate: ''
    });
  };

  const handleDelete = (id) => {
    const updatedDates = resourceDates.filter(r => r.id !== id)
      .map((r, index) => ({ ...r, id: index + 1 }));
    setResourceDates(updatedDates);
    onDatesChange(updatedDates);
  };

  const getTypeLabel = (type) => {
    const types = {
      fullTime: 'Full-time',
      partTime: 'Part-time',
      contract: 'Contract',
      intern: 'Intern'
    };
    return types[type] || type;
  };

  const handleCountChange = (e) => {
    const newCount = e.target.value;
    const selectedType = currentGroup.type;
    
    if (selectedType) {
      // Check if new count would exceed the distribution limit
      const currentTypeCount = resourceDates.reduce((acc, group) => {
        if (group.type === selectedType) {
          return acc + parseInt(group.count);
        }
        return acc;
      }, 0);
      const maxForType = distribution[selectedType] || 0;
      const remaining = maxForType - currentTypeCount;

      if (parseInt(newCount) > remaining) {
        alert(`You can only add ${remaining} more resources of type ${getTypeLabel(selectedType)}`);
        return;
      }
    }

    setCurrentGroup({
      ...currentGroup,
      count: newCount
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const currentCount = parseInt(currentGroup.count);

    if (currentCount) {
      // Validate count against the newly selected type
      const currentTypeCount = resourceDates.filter(r => r.type === newType).length;
      const maxForType = distribution[newType] || 0;
      const remaining = maxForType - currentTypeCount;

      if (currentCount > remaining) {
        alert(`You can only add ${remaining} more resources of type ${getTypeLabel(newType)}`);
        return;
      }
    }

    setCurrentGroup({
      ...currentGroup,
      type: newType
    });
  };

  const totalAssigned = resourceDates.reduce((sum, group) => sum + parseInt(group.count || 0), 0);
  const remainingResources = numberOfResources - totalAssigned;

  if (!numberOfResources || parseInt(numberOfResources) <= 0) return null;

  return (
    <div className="mt-4 border rounded-md">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
      >
        <span className="font-medium">Resource-wise Dates</span>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="p-3">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[12%] text-xs font-medium text-left pb-2 pl-3">Resources</th>
                <th className="w-[22%] text-xs font-medium text-left pb-2 pl-3">Resource Type</th>
                <th className="w-[22%] text-xs font-medium text-left pb-2 pl-3">Start Date</th>
                <th className="w-[22%] text-xs font-medium text-left pb-2 pl-3">End Date</th>
                <th className="w-[22%] text-xs font-medium text-left pb-2 pl-3">Onboard Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Existing resource groups */}
              {resourceDates.map((group) => (
                <tr key={group.id} className="bg-green-50">
                  <td className="py-2 pl-3 text-sm">{group.count}</td>
                  <td className="py-2 pl-3 text-sm">{getTypeLabel(group.type)}</td>
                  <td className="py-2 pl-3 text-sm">{group.startDate}</td>
                  <td className="py-2 pl-3 text-sm">{group.endDate}</td>
                  <td className="py-2 pl-3 text-sm flex justify-between items-center pr-2">
                    {group.onboardDate}
                    <button
                      onClick={() => handleDelete(group.id)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}

              {/* New group input row */}
              {remainingResources > 0 && (
                <tr className="bg-gray-50">
                  <td className="py-2 pl-3">
                    <input
                      type="number"
                      value={currentGroup.count}
                      onChange={handleCountChange}
                      className="w-full p-1 border rounded text-xs bg-white text-center"
                      min="1"
                      max={remainingResources}
                      required
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <select
                      value={currentGroup.type}
                      onChange={handleTypeChange}
                      className="w-full p-1 border rounded text-xs bg-white pl-2"
                      required
                    >
                      <option value="" className="text-gray-500">Select Type</option>
                      {getAvailableTypes().map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.label} ({type.count - (resourceDates.filter(r => r.type === key).length)} remaining)
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="date"
                      value={currentGroup.startDate}
                      onChange={(e) => setCurrentGroup({
                        ...currentGroup,
                        startDate: e.target.value
                      })}
                      className="w-full p-1 border rounded text-xs bg-white"
                      required
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="date"
                      value={currentGroup.endDate}
                      onChange={(e) => setCurrentGroup({
                        ...currentGroup,
                        endDate: e.target.value
                      })}
                      className="w-full p-1 border rounded text-xs bg-white"
                      min={currentGroup.startDate}
                      required
                    />
                  </td>
                  <td className="py-2 pr-2 flex justify-between items-center">
                    <input
                      type="date"
                      value={currentGroup.onboardDate}
                      onChange={(e) => setCurrentGroup({
                        ...currentGroup,
                        onboardDate: e.target.value
                      })}
                      className="w-full p-1 border rounded text-xs bg-white"
                      max={currentGroup.startDate}
                      required
                    />
                    <button
                      onClick={handleGroupAdd}
                      className="w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center text-sm ml-2"
                    >
                      +
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResourceDatesTable; 