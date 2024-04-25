import { User } from '../models/user';
import * as authServices from '../services/authServices';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
jest.mock('../models/user', () => ({
    User: {
      findOneBy: jest.fn()
    }
  }));
  jest.mock('bcrypt', () => ({
    compare: jest.fn()
  }));
  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
  }));


  describe("login", () => {
    it("should return a token and user data when credentials are correct", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "$2b$10$examplehashedpassword"
      };
      const mockToken = "generated.jwt.token";

      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
  
      const result = await authServices.login("test@example.com", "password123");
  
      expect(User.findOneBy).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id }, config.jwtSecret);
      expect(result).toEqual({ token: mockToken, user: mockUser });
    });
    it("should throw an error if the password is incorrect", async () => {
        const mockUser = {
          id: 1,
          email: "test@example.com",
          password: "$2b$10$examplehashedpassword"
        };
        
        (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
        await expect(authServices.login("test@example.com", "wrongpassword"))
          .rejects
          .toThrow('Incorrect password');
      
        expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", mockUser.password);
      });
    it("should throw an error if the user is not found", async () => {
        (User.findOneBy as jest.Mock).mockResolvedValue(null);
      
        await expect(authServices.login("www", "password"))
            .rejects
            .toThrow('User not found');
        });
  });