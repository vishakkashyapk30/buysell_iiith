import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../axios'; // Import the Axios instance
import { useLocation } from "react-router-dom";

const SigninPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const casEmail = queryParams.get('email');
    const isCasLogin = queryParams.get('casLogin');
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        contactNumber: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/register', formData);
            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    useEffect(() => {
        if (isCasLogin) {
            setFormData(prev => ({
                ...prev,
                email: queryParams.get('email') || '',
                firstName: queryParams.get('firstName') || '',
                lastName: queryParams.get('lastName') || '',
            }));
        }
    }, [isCasLogin]);

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen bg-[#93ddff]">
            <div className="w-full min-h-screen py-10 flex justify-center items-center">
                <div className="bg-white w-full max-w-[613px] p-10 rounded-[30px] shadow-lg mx-4">
                    <h1 className="text-3xl font-poppins font-medium text-[#023047] text-center mb-6">
                        Sign Up
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* First Name */}
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="text-[#023047] font-poppins mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="w-full h-14 px-4 text-[#111111] border border-[#023047] rounded-lg focus:outline-none bg-white"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="text-[#023047] font-poppins mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="w-full h-14 px-4 text-[#111111] border border-[#023047] rounded-lg focus:outline-none bg-white"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-[#023047] font-poppins mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full h-14 px-4 text-[#111111] border border-[#023047] rounded-lg focus:outline-none bg-white"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Age */}
                        <div className="flex flex-col">
                            <label htmlFor="age" className="text-[#023047] font-poppins mb-1">
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                className="w-full h-14 px-4 text-[#111111] border border-[#023047] rounded-lg focus:outline-none bg-white"
                                placeholder="Enter your age"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                max="120"
                                required
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="flex flex-col">
                            <label htmlFor="contactNumber" className="text-[#023047] font-poppins mb-1">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                className="w-full h-14 px-4 text-[#111111] border border-[#023047] rounded-lg focus:outline-none bg-white"
                                placeholder="Enter your contact number"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col relative">
                            <label htmlFor="password" className="text-[#023047] font-poppins mb-1">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="w-full h-14 px-4 text-[#111111] border border-[#023047] rounded-lg focus:outline-none bg-white"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-11 text-sm text-[#023047] font-poppins"
                                onClick={togglePassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center w-full">
                            <button
                                type="submit"
                                className="w-[194px] h-[65px] bg-[#219EBC] hover:bg-[#E56F2E] rounded-[40px] text-white font-poppins text-xl cursor-pointer transition-colors duration-300"
                            >
                                <span className="text-xl">Sign Up</span>
                            </button>
                        </div>

                        <p className="text-center text-[#333333] mt-4">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[#023047] underline cursor-pointer hover:text-[#219EBC]"
                            >
                                Log In
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;