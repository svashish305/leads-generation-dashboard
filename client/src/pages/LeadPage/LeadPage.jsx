import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import './LeadPage.css';

const LeadPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isWebhookUrlInputClicked, setIsWebhookUrlInputClicked] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isWebhookSet, setIsWebhookSet] = useState(false);
  const [leads, setLeads] = useState([]);
  const [otherLeadFields, setOtherLeadFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const inputRef = useRef(null);
  const tableRef = useRef(null);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const token = localStorage.getItem('token');

  const handleCopy = () => {
    setIsWebhookUrlInputClicked(true);
    inputRef.current.select();
    inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    setTimeout(() => {
      setIsWebhookUrlInputClicked(false);
    }, 1000);
  };

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
          const { success, user = null, message } = data;
          if (!success || user.userId !== parseInt(userId, 10)) {
            setErrorMessage(message);
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
        setErrorMessage('Error fetching user data');
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
        const { error = null, message, user = null } = data;
        if (user) {
          setWebhookUrl(`${import.meta.env.VITE_API_URL}/${user.webhookUrl}`);
          setIsWebhookSet(true);
        } else if (error) {
          setErrorMessage(message);
        }
      }
    } catch (error) {
      setErrorMessage('Error updating webhook URL');
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
        setOtherLeadFields(data.otherFields ? Object.keys(data.otherFields) : [])
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
          const { success, message, leads = [], totalPages = 0 } = data;
          if (success) {
            if (page === 1) {
              setLeads(leads);
            } else {
              setLeads((prevLeads) => [...prevLeads, ...leads]);
            }
            /* 
              EDGE CASE: below code for setOtherLeadFields assumes that otherFields is a flat object, it won't work for nested object, 
              in that case, we need to use a recursive function 
            */
            setOtherLeadFields(Array.from(
              new Set(leads.flatMap((lead) => lead.otherFields ? Object.keys(lead.otherFields) : []))
            ));
            setTotalPages(totalPages);
          } else {
            setErrorMessage(message);
          }
        }
      } catch (error) {
        setErrorMessage('Error fetching leads');
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
    <>
      <div className='leadPageContainer'>
        <button className='logoutButton' onClick={logOut}>Log Out</button>
        <h3>Your Webhook URL</h3>
        <div className='webhookUrlContainer'>
          <input 
            type='text'
            readOnly 
            value={webhookUrl} 
            ref={inputRef} 
            onClick={handleCopy}
            onBlur={() => setIsWebhookUrlInputClicked(false)}
            data-tooltip-id='webhookUrlInput'
            data-tooltip-place='bottom' 
            data-tooltip-content={isWebhookUrlInputClicked ? 'Copied!' : 'Click to copy'} 
          />
          <Tooltip id='webhookUrlInput' />
          {!isWebhookSet && (
            <>
              <button 
                className='confirmButton' 
                onClick={updateWebhookUrl}
                data-tooltip-id='confirmWebhookBtn'
                data-tooltip-place='top' 
                data-tooltip-content='Click to confirm subscription for new leads!' 
              >
                Confirm
              </button>
              <Tooltip id='confirmWebhookBtn' />
            </>
          )}
        </div>
        {isLoading && <div className='loading'>Loading...</div>}
        {errorMessage && <div className="error">{errorMessage}</div>}
        {leads.length > 0 && 
          <div className='leadsTable' onScroll={handleScroll}>
            <table>
              <thead>
                <tr className='capitalizeFirstLetter'>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  {otherLeadFields.length > 0 && otherLeadFields.map((key) => (
                    key && <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody ref={tableRef}>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    {otherLeadFields.length > 0 && otherLeadFields.map((key) => (
                      lead.otherFields?.[key] ? <td key={key}>{lead.otherFields[key]}</td> : <td key={key}></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
      <div className='imageAttribution'>
        Image by{' '}
        <Link to='https://www.freepik.com/free-vector/abstract-realistic-technology-particle-background_6881076.htm#query=technology%20abstract%20purple%20background&position=10&from_view=search&track=ais'>
          Freepik
        </Link>
      </div>
    </>
	)
}

export default LeadPage