import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Logout failed';
      toast.error(errorMessage);
    } finally {
      navigate('/login');
    }
  };

  return { logout };
};
