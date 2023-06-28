import { useParams } from 'react-router-dom';

const LeadPage = () => {
  const { userId } = useParams();
	
	return (
		<>
      <h3>Your Webhook URL</h3>
      {import.meta.env.VITE_APP_API_URL}/webhook
      {/* TODO: populate table with each row having data from the payload */}
      <br/>
      UserId: {userId}
    </>
	)
}

export default LeadPage