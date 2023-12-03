import './Register.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios({
        method: 'post',
        withCredentials: true,
        url: '/api/v1/users/signup',
        data: { userName, email, password, passwordConfirm },
      });
      console.log(res);
      if (res.data.status === 'success') {
        setTimeout(() => {
          navigate('/');
        }, 500);
        setLoading(false);
        toast.success('Signin Successful', {
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
      toast.error('Signin Failed', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };
  return (
    <div className='container'>
      <ToastContainer />
      <h1>Register</h1>
      <form onSubmit={handleLogin} id='register-form'>
        <div className='input-field'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            name='username'
            required
          />
        </div>
        <div className='input-field'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name='email'
            required
          />
        </div>
        <div className='input-field'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id='password'
            name='password'
            required
          />
        </div>
        <div className='input-field'>
          <label htmlFor='confirm-password'>Confirm Password</label>
          <input
            type='password'
            id='confirm-password'
            name='confirm-password'
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
            required
          />
        </div>
        <button type='submit'>{loading ? 'Submitting..' : 'Register'}</button>
      </form>
    </div>
  );
};

export default Register;
