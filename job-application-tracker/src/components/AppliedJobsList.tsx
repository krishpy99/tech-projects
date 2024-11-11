import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Job {
  id: string;
  title: string;
  company: string;
  appliedDate: string;
}

interface AppliedJobsListProps {
  refreshTrigger: number;
}

export const AppliedJobsList: React.FC<AppliedJobsListProps> = ({ refreshTrigger }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get<Job[]>('YOUR_BACKEND_API_URL/applied-jobs');
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchJobs();
  }, [refreshTrigger]);

  return (
    <div className="applied-jobs-list">
      <h3>Applied Jobs</h3>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <h4>{job.title}</h4>
            <p>Company: {job.company}</p>
            <p>Applied Date: {new Date(job.appliedDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}