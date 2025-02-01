import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-[#023047] h-[81px] flex-shrink-0 flex items-center justify-between px-[100px]">
      <Link to="/" className="text-[#E1AE46] text-3xl font-bold hover:text-[#E56F2E] transition-colors">
        Buy, Sell @ IIITH
      </Link>
      <div className="flex items-center gap-10">
        <Link to="/search" className="text-[#8BDAFF] font-medium hover:text-[#E56F2E] transition-colors">Buy Items</Link>
        <Link to="/sell" className="text-[#8BDAFF] font-medium hover:text-[#E56F2E] transition-colors">Sell Item</Link>
        <Link to="/orders" className="text-[#8BDAFF] font-medium hover:text-[#E56F2E] transition-colors">Orders History</Link>
        <Link to="/delivery" className="text-[#8BDAFF] font-medium hover:text-[#E56F2E] transition-colors">Deliver Items</Link>
        <Link to="/support" className="text-[#8BDAFF] font-medium hover:text-[#E56F2E] transition-colors">Support</Link>
        <Link to="/cart" className="text-[#8BDAFF] hover:text-[#E56F2E] transition-colors">
          <ShoppingCart size={24} />
        </Link>
        <Link to="/profile" className="text-[#8BDAFF] hover:text-[#E56F2E] transition-colors">
          <User size={24} />
        </Link>
        <button
          onClick={logout}
          className="bg-[#219EBC] text-white px-6 py-2 rounded-full hover:bg-[#E56F2E] transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;