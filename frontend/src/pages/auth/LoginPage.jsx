import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { AuthContext } from '../../context/AuthContext';
import { CAS_CONFIG } from '../../../../backend/config/cas.config';

const LoginPage = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState({
    image: '',
    id: '',
    answer: ''
  });
  const [error, setError] = useState(''); // New state for handling errors

  useEffect(() => {
    fetchCaptcha();
    const token = new URLSearchParams(location.search).get('token');
    const casLogin = new URLSearchParams(location.search).get('casLogin');

    if (token && casLogin) {
      handleCASTokenLogin(token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const destination = location.state?.from || '/profile';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location]);

  const handleCASTokenLogin = async (token) => {
    const result = await login(token);
    if (result.success) {
      navigate('/profile');
    }
  };

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get('/api/captcha/generate');
      const data = await response.data;
      setCaptcha(prev => ({
        ...prev,
        image: data.image,
        id: data.id,
        answer: ''
      }));
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'captcha') {
      setCaptcha(prev => ({ ...prev, answer: value }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleCASLogin = () => {
    window.location.href = 'https://login.iiit.ac.in/cas/login?service=http://localhost:4000/api/user/cas/callback';
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captcha.answer) {
      setError('Please complete the captcha');
      return;
    }

    const loginData = {
      ...formData,
      captchaId: captcha.id,
      captchaAnswer: captcha.answer
    };

    try {
      // Add logging
      console.log('Sending login request with data:', loginData);

      const response = await axios.post('/api/user/login', loginData);
      console.log('Login response:', response.data);

      if (response.data.success) {
        const result = await login(response.data.token);
        console.log('Auth result:', result);

        if (result.success) {
          navigate('/profile');
        } else {
          setError(result.message);
          fetchCaptcha();
        }
      }
    } catch (error) {
      // Enhanced error logging
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Login failed');
      fetchCaptcha();
    }
  };

  // const handleCASLogin = () => {
  //   window.location.href = `${CAS_CONFIG.CAS_URL}/login?service=${encodeURIComponent(CAS_CONFIG.SERVICE_URL)}`;
  // };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#93ddff] flex justify-center items-center overflow-y-auto">
      <div className="w-full max-w-[603px] mx-5 p-10 bg-white rounded-[30px] shadow-md">
        <div className="flex flex-col items-center gap-10">
          <h1 className="font-poppins text-3xl text-[#023047] font-medium">Log In</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-[392px]">
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-poppins text-base text-[#023047]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full h-14 px-6 border border-[#023047] rounded-xl font-poppins text-base bg-white text-[#000000] placeholder:text-[#666666]"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="font-poppins text-base text-[#023047]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="w-full h-14 px-6 border border-[#023047] rounded-xl font-poppins text-base bg-white text-[#000000] placeholder:text-[#666666]"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#023047] font-poppins"
                  onClick={togglePassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              {captcha.image ? (
                <div className="w-full max-w-[200px] h-[70px] overflow-hidden rounded-xl border border-[#023047]">
                  <img
                    src={`data:image/png;base64,${captcha.image}`}
                    alt="Captcha"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading captcha image');
                      fetchCaptcha();
                    }}
                  />
                </div>
              ) : (
                <div className="w-full max-w-[200px] h-[70px] bg-gray-200 rounded-xl border border-[#023047] flex items-center justify-center">
                  <span className="text-gray-500">Loading captcha...</span>
                </div>
              )}
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  name="captcha"
                  placeholder="Enter captcha"
                  className="flex-1 h-14 px-6 border border-[#023047] rounded-xl font-poppins text-base bg-white text-[#000000] placeholder:text-[#666666]"
                  value={captcha.answer}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  className="px-4 py-2 bg-[#219EBC] hover:bg-[#E56F2E] rounded-xl text-white"
                >
                  ↻
                </button>
              </div>
            </div>

            <div className="flex justify-center w-full mt-4">
              <button
                type="submit"
                className="w-[194px] h-[65px] bg-[#219EBC] hover:bg-[#E56F2E] rounded-[40px] text-white font-poppins text-xl cursor-pointer transition-colors duration-300"
              >
                Log in
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-[#333333]">or</p>
              <button
                type="button"
                onClick={handleCASLogin}
                className="w-full h-14 bg-[#e0dfdf] hover:bg-[#E56F2E] rounded-xl text-black font-poppins text-base cursor-pointer transition-colors duration-300"
              >
                Login with CAS
              </button>
            </div>

            <p className="text-center text-[#333333] mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="text-[#023047] underline cursor-pointer hover:text-[#219EBC]"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;