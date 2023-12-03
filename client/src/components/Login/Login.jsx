import { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios({
        method: 'post',
        withCredentials: true,
        url: '/api/v1/users/login',
        data: { email, password },
      });
      if (res.data.status === 'success') {
        setLoading(false);
        setTimeout(()=>{
          window.open('http://localhost:3000/run_script')
        }, 500);
        toast.success('Login Successful', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        throw new Error('failed');
      }
    } catch (err) {
      setLoading(false);
      toast.error('Login Failed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };
  return (
    <section className='login-main-container'>
      <ToastContainer />
      <div className='login-container'>
        <div className='circle circle-one'></div>
        <div className='form-container'>
          <img
            src='https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png'
            alt='illustration'
            className='illustration'
          />
          <h1 className='opacity'>SUBMIT</h1>
          <form onSubmit={handleLogin}>
            <input
              type='text'
              onChange={(e) => setEmail(e.target.value)}
              placeholder='USERNAME'
              value={email}
            />
            <input
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              placeholder='PASSWORD'
              value={password}
              minLength='8'
            />
            <button>{loading? "Checking..": "Submit"}</button>
          </form>
          <div className='register-forget opacity'>
            <button onClick={() => navigate('/register')}>REGISTER</button>

            <button>FORGOT PASSWORD</button>
          </div>
        </div>
        <div className='circle circle-two'></div>
      </div>
      <div className='theme-btn-container'></div>
    </section>
  );
};

export default Login;
