import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeadPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [webhookUrl, setWebhookUrl] = useState(null);
  const [isWebhookSet, setIsWebhookSet] = useState(false);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/user`, {
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
          if (user.webhookUrl) {
            setWebhookUrl(`${import.meta.env.VITE_API_URL}/${user.webhookUrl}`);
            setIsWebhookSet(true);
          } else {
            setWebhookUrl(`${import.meta.env.VITE_API_URL}/api/v1/webhook/${userId}`);
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
  }, [navigate, token, userId]);

  useEffect(() => {
    if (!isWebhookSet) {
      return;
    }
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/v1/sse`);

    eventSource.onmessage = (event) => {
      const leadData = JSON.parse(event.data);
      if (leadData.userId === parseInt(userId, 10)) {
        setLeads((prevLeads) => [...prevLeads, leadData]);
      }
    };

    return () => eventSource.close();
  }, [isWebhookSet, userId]);

  const updateWebhookUrl = async () => {
    try {
      if (token) {
        const { data } = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${userId}`, {
            webhookUrl: webhookUrl.replace(`${import.meta.env.VITE_API_URL}/`, ''),
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { error = null, user = null } = data;
        if (user) {
          setWebhookUrl(`${import.meta.env.VITE_API_URL}/${user.webhookUrl}`);
          setIsWebhookSet(true);
        } else if (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error('Unable to update webhookUrl on user');
    }
  }
	
	return (
		<div className='leadPageContainer'>
      <button className='logoutButton' onClick={logOut}>Log Out</button>
      <h3>Your Webhook URL</h3>
      <div className=''>
        <input type="text" value={webhookUrl} disabled />
        {!isWebhookSet && (
          <button className="secondaryButton" onClick={updateWebhookUrl}>
          Confirm
        </button>)}
      </div>
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