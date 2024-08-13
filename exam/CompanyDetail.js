/**
 * Displays a page containing the companies name, description,
 * and a list of offered jobs. 
 */
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import JoblyApi from '../api';
import AuthContext from '../auth/AuthContext';
import Loading from '../common/Loading';
import JobList from '../jobs/JobList';
import './CompanyDetail.css';

const CompanyDetail = () => {
  const { handle } = useParams();
  const [company, setCompany] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const history = useHistory();
  
  // fetch company data from api
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const company = await JoblyApi.getCompany(handle);
        // if user has applied for job, hasApplied=true
        company.jobs = company.jobs.map(job => {
          const hasApplied = user.applications.includes(job.id);
          return ({ ...job, hasApplied });
        });
        setCompany(company);
        setIsLoading(false);
      } catch (e) {
        alert(e);
        history.push('/companies');
      }
    }
    fetchCompany();
  }, [handle, history, user.applications]);


  if (isLoading) return <Loading />;

  return (
    <div className="CompanyDetail col-md-8 offset-md-2">
      <h1>{company.name}</h1>
      <p>{company.description}</p>
      <JobList jobs={company.jobs} />
    </div>
  );
};

export default CompanyDetail;