import { Request, Response } from 'express';
import AuthService from '@/services/auth.service';
import { Role } from '@/types/interface';

const AuthController = {
  signup: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, encryptedPassword, role } = req.body;

      // Validate all the fields are required
      if (!firstName) {
        return res.status(400).json({ message: 'Firstname is required' });
      }

      if (!lastName) {
        return res.status(400).json({ message: 'Lastname is required' });
      }

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      if (!encryptedPassword) {
        return res.status(400).json({ message: 'Password is required' });
      }

      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }

      // Check if role's value is the Role enum
      if (!Object.values(Role).includes(role as Role)) {
        return res.status(400).json({ message: 'Invalid Role Value' });
      }

      // Call the authentication service - signup
      const token = await AuthService.signup({
        firstName,
        lastName,
        email,
        encryptedPassword,
        role,
      });

      // Return the response
      res.status(200).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
};

export default AuthController;
