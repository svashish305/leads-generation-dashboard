import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeadPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isWebhookSet, setIsWebhookSet] = useState(false);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  
  const tableRef = useRef(null);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
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
    };

    fetchUser();
  }, [navigate, token, userId]);

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
  
  useEffect(() => {
    if (!isWebhookSet) {
      return;
    }
    let eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/v1/sse`);

    eventSource.onmessage = (event) => {
      const { type = null, data = null } = JSON.parse(event.data);
      if (type === 'lead' && data?.userId === parseInt(userId, 10)) {
        setLeads((prevLeads) => [...prevLeads, data]);
      }
    };

    return () => {
      eventSource.close();
      eventSource = null;
    };
  }, [isWebhookSet, userId]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        if (token) {
          setIsLoading(true);
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/lead?page=${page}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { success, leads = [], totalPages = 0, totalCount = 0, pageSize } = data;
          if (success) {
            setShowScrollbar(totalCount > pageSize);
            if (page === 1) {
              setLeads(leads);
            } else {
              setLeads((prevLeads) => [...prevLeads, ...leads]);
            }
            setTotalPages(totalPages);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, [token, page]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = tableRef.current;
  
    if (scrollTop + clientHeight >= scrollHeight) {

      if (page < totalPages) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };
	
	return (
		<div className='leadPageContainer'>
      <button className='logoutButton' onClick={logOut}>Log Out</button>
      <h3>Your Webhook URL</h3>
      <div className='webhookUrlContainer'>
        <input type='text' value={webhookUrl} disabled />
        {!isWebhookSet && (
          <button className='secondaryButton' onClick={updateWebhookUrl}>
          Confirm
        </button>)}
      </div>
      {isLoading && <div className='loading'>Loading...</div>}
      {leads.length > 0 && 
        <div className={`leadsTable ${showScrollbar ? 'showScrollbar' : ''}`} onScroll={handleScroll}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody ref={tableRef}>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
	)
}

export default LeadPage