import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

	const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/leads/${userId}`);
  }

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label>Enter userId:
					<input type='text' onChange={(e) => setUserId(e.target.value)} />
				</label>
			</form>
		</>
	)
}

export default MainPage