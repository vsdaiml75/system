import React, { useState } from 'react';
import ResourceDatesTable from './ResourceDatesTable';
import ResourceDistribution from './ResourceDistribution';

function CreateTicket() {
  const [ticket, setTicket] = useState({
    mandatorySkills: '',
    optionalSkills: '',
    priority: 'medium',
    type: 'resource_requisition',
    requisitionCategory: 'new_resource',
    project: 'project_1',
    designation: 'test_engineer',
    numberOfResources: '',
    sameDates: 'yes',
    startDate: '',
    endDate: '',
    onboardDate: '',
    skillsSimilarTo: '',
    department: '',
    reportingManager: '',
    workLocation: ''
  });

  const [errors, setErrors] = useState({});
  const [resourceDates, setResourceDates] = useState([]);
  const [distribution, setDistribution] = useState({
    fullTime: '',
    partTime: '',
    contract: '',
    intern: ''
  });
  const [isDistributionValid, setIsDistributionValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      'mandatorySkills', 'type', 'requisitionCategory', 'project', 
      'designation', 'numberOfResources', 'startDate', 'endDate', 'onboardDate'
    ];

    requiredFields.forEach(field => {
      if (!ticket[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Number of resources validation
    if (ticket.numberOfResources) {
      const num = parseInt(ticket.numberOfResources);
      if (num <= 0) {
        newErrors.numberOfResources = 'Number of resources must be greater than 0';
      }
    }

    // Date sequence validation
    if (ticket.startDate && ticket.endDate && ticket.onboardDate) {
      if (new Date(ticket.endDate) < new Date(ticket.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
      if (new Date(ticket.startDate) < new Date(ticket.onboardDate)) {
        newErrors.startDate = 'Start date must be after onboard date';
      }
    }

    // Validate resource dates when sameDates is 'no'
    if (ticket.sameDates === 'no') {
      if (resourceDates.length !== parseInt(ticket.numberOfResources)) {
        newErrors.resourceDates = 'Please fill dates for all resources';
      }
      
      resourceDates.forEach((resource, index) => {
        if (!resource.startDate || !resource.endDate || !resource.onboardDate) {
          newErrors.resourceDates = 'Please fill all dates for each resource';
        }
        // Validate date sequence for each resource
        if (new Date(resource.endDate) < new Date(resource.startDate)) {
          newErrors.resourceDates = `Resource ${index + 1}: End date must be after start date`;
        }
        if (new Date(resource.startDate) < new Date(resource.onboardDate)) {
          newErrors.resourceDates = `Resource ${index + 1}: Start date must be after onboard date`;
        }
      });
    }

    if (!isDistributionValid) {
      newErrors.distribution = 'Please properly distribute the total resources';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Ticket data:', ticket);
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'numberOfResources' 
      ? e.target.value.replace(/[^0-9]/g, '')
      : e.target.value;
      
    const maxLength = e.target.name === 'skillsSimilarTo' ? 100 : 500;
    
    setTicket({
      ...ticket,
      [e.target.name]: value.slice(0, maxLength)
    });

    // Clear error when field is changed
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleDistributionChange = (newDistribution, isValid) => {
    setDistribution(newDistribution);
    setIsDistributionValid(isValid);
  };

  const renderError = (field) => {
    return errors[field] ? (
      <span className="text-red-500 text-xs mt-1">{errors[field]}</span>
    ) : null;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Ticket</h2>
      
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Ticket Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={ticket.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="resource_requisition">Resource Requisition</option>
          </select>
          {renderError('type')}
        </div>

        <div>
          <label htmlFor="requisitionCategory" className="block text-sm font-medium mb-2">
            Requisition Category <span className="text-red-500">*</span>
          </label>
          <select
            id="requisitionCategory"
            name="requisitionCategory"
            value={ticket.requisitionCategory}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="new_resource">New Resource</option>
          </select>
          {renderError('requisitionCategory')}
        </div>

        <div>
          <label htmlFor="project" className="block text-sm font-medium mb-2">
            Select Project <span className="text-red-500">*</span>
          </label>
          <select
            id="project"
            name="project"
            value={ticket.project}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="project_1">Project 1</option>
          </select>
          {renderError('project')}
        </div>

        <div>
          <label htmlFor="designation" className="block text-sm font-medium mb-2">
            Select Designation <span className="text-red-500">*</span>
          </label>
          <select
            id="designation"
            name="designation"
            value={ticket.designation}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="test_engineer">Test Engineer</option>
          </select>
          {renderError('designation')}
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={ticket.department}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white"
            required
          >
            <option value="">Select Department</option>
            <option value="engineering">Engineering</option>
            <option value="qa">Quality Assurance</option>
            {/* Add more departments */}
          </select>
          {renderError('department')}
        </div>

        <div>
          <label htmlFor="reportingManager" className="block text-sm font-medium mb-2">
            Reporting Manager <span className="text-red-500">*</span>
          </label>
          <select
            id="reportingManager"
            name="reportingManager"
            value={ticket.reportingManager}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white"
            required
          >
            <option value="">Select Reporting Manager</option>
            {/* Add managers list */}
          </select>
          {renderError('reportingManager')}
        </div>

        <div>
          <label htmlFor="workLocation" className="block text-sm font-medium mb-2">
            Work Location <span className="text-red-500">*</span>
          </label>
          <select
            id="workLocation"
            name="workLocation"
            value={ticket.workLocation}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white"
            required
          >
            <option value="">Select Work Location</option>
            <option value="office">Office</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {renderError('workLocation')}
        </div>

        <div>
          <label htmlFor="numberOfResources" className="block text-sm font-medium mb-2">
            Number of Resources <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="numberOfResources"
            name="numberOfResources"
            value={ticket.numberOfResources}
            onChange={handleChange}
            placeholder="Enter number of resources"
            className="w-full p-2 border rounded-md bg-white"
            pattern="[0-9]*"
            inputMode="numeric"
            required
          />
          {renderError('numberOfResources')}
        </div>

        {ticket.numberOfResources > 0 && (
          <div>
            <ResourceDistribution
              totalResources={parseInt(ticket.numberOfResources)}
              distribution={distribution}
              onChange={handleDistributionChange}
            />
            {renderError('distribution')}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Are the start and end dates of all these resources same? <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sameDates"
                value="yes"
                checked={ticket.sameDates === 'yes'}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sameDates"
                value="no"
                checked={ticket.sameDates === 'no'}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {renderError('sameDates')}
        </div>

        {ticket.sameDates === 'yes' ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium mb-2">
                Resource Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={ticket.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white"
                required
              />
              {renderError('startDate')}
            </div>
            
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                Resource End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={ticket.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white"
                min={ticket.startDate}
                required
              />
              {renderError('endDate')}
            </div>

            <div className="flex-1">
              <label htmlFor="onboardDate" className="block text-sm font-medium mb-2">
                On-board on or before <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="onboardDate"
                name="onboardDate"
                value={ticket.onboardDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white"
                max={ticket.startDate}
                required
              />
              {renderError('onboardDate')}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <ResourceDatesTable
              numberOfResources={ticket.numberOfResources}
              distribution={distribution}
              onDatesChange={setResourceDates}
            />
            {renderError('resourceDates')}
          </div>
        )}

        <div>
          <label htmlFor="skillsSimilarTo" className="block text-sm font-medium mb-2">
            Skills similar to
            <span className="text-xs text-gray-500 ml-2">
              ({100 - ticket.skillsSimilarTo.length} characters remaining)
            </span>
          </label>
          <input
            type="text"
            id="skillsSimilarTo"
            name="skillsSimilarTo"
            value={ticket.skillsSimilarTo}
            onChange={handleChange}
            placeholder="Enter names of existing employees with whom the skills of the new resource should be matching"
            className="w-full p-2 border rounded-md bg-white text-sm placeholder:text-sm placeholder:text-gray-400"
            maxLength="100"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mandatorySkills" className="block text-sm font-medium mb-1">
            Mandatory Skills <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">
              ({500 - ticket.mandatorySkills.length} characters remaining)
            </span>
          </label>
          <textarea
            id="mandatorySkills"
            name="mandatorySkills"
            value={ticket.mandatorySkills}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            className="w-full p-2 border rounded-md"
            required
          />
          {renderError('mandatorySkills')}
        </div>

        <div>
          <label htmlFor="optionalSkills" className="block text-sm font-medium mb-1">
            Optional Skills
            <span className="text-xs text-gray-500 ml-2">
              ({500 - ticket.optionalSkills.length} characters remaining)
            </span>
          </label>
          <textarea
            id="optionalSkills"
            name="optionalSkills"
            value={ticket.optionalSkills}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">Priority</label>
          <select
            id="priority"
            name="priority"
            value={ticket.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Ticket
        </button>
      </form>
    </div>
  );
}

export default CreateTicket; 