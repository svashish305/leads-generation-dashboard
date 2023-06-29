import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const LeadPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [leads, setLeads] = useState([]);

  const logOut = () => {
    removeCookie('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!cookies.token) {
        navigate('/login');
      } else {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/auth/user`,
            { withCredentials: true }
          );
          const { success } = data;
          if (!success) {
            removeCookie('token');
            navigate('/login');
          }
        } catch (error) {
          console.error(error);
          removeCookie('token');
          navigate('/login');
        }
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/lead`,
          { withCredentials: true }
        );
        const { success, leads = [] } = data;
        if (success) {
          setLeads(leads);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_APP_API_URL}/api/v1/sse`);

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
      {import.meta.env.VITE_APP_API_URL}/api/v1/webhook/{userId}
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