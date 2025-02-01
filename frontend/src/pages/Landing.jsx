import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Landing.css';
import cardImage from '../assets/card.png';

const Landing = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-x-hidden">
      <nav className="h-[75px] w-full bg-[#023047] relative flex justify-between items-center md:px-[50px] px-5 lg:flex-row flex-col lg:h-[75px] lg:py-0 py-5">
        <div className="h-full flex items-center lg:ml-[100px] ml-0">
          <h1 className="font-poppins font-bold text-3xl text-[#e1ae46]">
            Buy, Sell @ IIITH
          </h1>
        </div>

        <div className="flex gap-5 lg:mr-[100px] mr-0 lg:flex-row flex-col">
          {user ? (
            <>
              <button
                onClick={handleProfileClick}
                className="px-[50px] py-3 bg-[#219ebc] rounded-[68px] border-none cursor-pointer font-poppins font-medium text-base text-white transition-colors duration-400 hover:bg-[#E56F2E]"
              >
                <span>Profile</span>
              </button>
              <button
                onClick={logout}
                className="px-[50px] py-3 bg-[#219ebc] rounded-[68px] border-none cursor-pointer font-poppins font-medium text-base text-white transition-colors duration-400 hover:bg-[#E56F2E]"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="px-[50px] py-3 bg-[#219ebc] rounded-[68px] border-none cursor-pointer font-poppins font-medium text-base text-white transition-colors duration-400 hover:bg-[#E56F2E]"
              >
                <span>Log In</span>
              </button>
              <button
                onClick={handleSignInClick}
                className="px-[50px] py-3 bg-[#219ebc] rounded-[68px] border-none cursor-pointer font-poppins font-medium text-base text-white transition-colors duration-400 hover:bg-[#E56F2E]"
              >
                <span>Sign In</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-[#93ddff] w-full lg:px-[100px] md:px-[50px] px-5 lg:py-[60px] py-8 min-h-[calc(100vh-100px)]">
        <div className="max-w-[1440px] mx-auto h-full px-10">
          {/* Hero Section */}
          <div className="flex lg:flex-row flex-col justify-between items-center h-full gap-10">
            <div className="max-w-[600px]">
              <h2 className="font-poppins lg:text-[54px] md:text-[40px] text-[32px] font-semibold text-[#023047] mb-6 leading-[1.4]">
                Connecting IIITH, One Trade at a Time!
              </h2>
              <p className="font-poppins lg:text-[21px] text-base text-[#023047] mb-12 leading-[1.6]">
                Escape the 10% tax on Whatscap! Buy, Sell @ IIITH is a dedicated marketplace for the IIIT Hyderabad community. From gadgets to books, food to furniture, connect & trade within IIIT!
              </p>

              {/* Stats */}
              <div className="flex lg:flex-row flex-col gap-12 lg:text-left text-center">
                <div className="text-center">
                  <h3 className="font-poppins text-3xl font-bold text-[#023047] mb-2">200+</h3>
                  <p className="font-poppins text-base text-[#023047]">IIIT Student Users</p>
                </div>
                <div className="text-center">
                  <h3 className="font-poppins text-3xl font-bold text-[#023047] mb-2">200+</h3>
                  <p className="font-poppins text-base text-[#023047]">Items Listed</p>
                </div>
                <div className="text-center">
                  <h3 className="font-poppins text-3xl font-bold text-[#023047] mb-2">200+</h3>
                  <p className="font-poppins text-base text-[#023047]">Successful Transactions</p>
                </div>
              </div>
            </div>

            {/* Card Image */}
            <div className="flex-shrink-0 lg:w-[600px] md:w-[350px] w-full max-w-[650px] flex items-center justify-center mx-auto">
              <img src={cardImage} alt="Credit Cards" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;