import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeadPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        if (token) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { success, user = null } = data;
          if (!success || user.userId !== parseInt(userId, 10)) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/');
          }
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      }

      try {
        if (token) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/lead`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { success, leads = [] } = data;
          if (success) {
            setLeads(leads);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate, userId]);

  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/v1/sse`);

    eventSource.onmessage = (event) => {
      const leadData = JSON.parse(event.data);
      if (leadData.userId === parseInt(userId, 10)) {
        setLeads((prevLeads) => [...prevLeads, leadData]);
      }
    };

    return () => eventSource.close();
  }, [userId]);
	
	return (
		<div className='lead_page_container'>
      <h3>Your Webhook URL</h3>
      {import.meta.env.VITE_API_URL}/api/v1/webhook/{userId}
      <button className='logout_button' onClick={logOut}>Log Out</button>
      {leads.length > 0 && 
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
	)
}

export default LeadPage