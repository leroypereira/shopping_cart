import { Button } from '@mui/material'
import { logout } from '../../network/auth';
import useAuthStore from '../../store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../../network/auth';

const Dashboard = () => {
  const navigate = useNavigate();

  const {idToken} = useAuthStore((state)=>state);

  const handleLogout=()=>{
    logout().then(
      (res)=>{
        navigate("/");
    });
  };

  const displayProfile=()=>{
    currentUser()
      .then((res)=>{
        console.log(res)
    })
  }

  return (
    <div className="Dashboard">
      <Button
        style={{ margin: "10px" }}
        variant="contained"
        onClick={displayProfile}
      >
        Profile
      </Button>
      <Button
        style={{ margin: "10px" }}
        variant="contained"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}

export default Dashboard