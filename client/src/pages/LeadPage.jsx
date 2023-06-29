import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const LeadPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/auth/user`,
        { withCredentials: true }
      );
      const { success, user = null } = data;
      return success
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const logOut = () => {
    removeCookie("token");
    navigate("/signup");
  };

  // useEffect(() => {
  //   const eventSource = new EventSource(`${import.meta.env.VITE_APP_API_URL}/api/v1/sse`);

  //   eventSource.onmessage = (event) => {
  //     const leadData = JSON.parse(event.data);
  //     if (leadData.userId === userId) {
  //       setLeads((prevLeads) => [...prevLeads, leadData]);
  //     }
  //   };

  //   return () => eventSource.close();
  // }, [userId]);
	
	return (
		<>
      <h3>Your Webhook URL</h3>
      {import.meta.env.VITE_APP_API_URL}/api/v1/webhook/{userId}
      <button onClick={logOut}>Log Out</button>
      {/* {leads.length > 0 && 
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
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      } */}
      <ToastContainer />
    </>
	)
}

export default LeadPage