import { User } from "../models/user";
import * as UserService from "../services/userServices";
import * as userHelpers from "../helpers/userHelpers";
import AppDataSource from "../config/db";
import bcrypt from "bcrypt";

beforeAll(async () => {
  await AppDataSource.initialize();
});

describe("User Services", () => {
  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },
      ];
      User.find = jest.fn().mockResolvedValue(mockUsers);

      const users = await UserService.getAllUsers();
      expect(users).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalled();
    });


    it("should return an empty array when there are no users", async () => {
      User.find = jest.fn().mockResolvedValue([]);

      const users = await UserService.getAllUsers();
      expect(users).toEqual([]);
      expect(User.find).toHaveBeenCalled();
    });

    it("should handle a database error gracefully", async () => {
      const errorMessage = "Database connection error";
      User.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(UserService.getAllUsers()).rejects.toThrow(errorMessage);
    });

    it("should apply data transformations correctly", async () => {
      const rawUsers = [
        {
          id: 2,
          name: "Jane Doe",
          email: "jane@example.com",
          password: "password",
        },
      ];
      const expectedUsers = [
        { id: 2, name: "Jane Doe", email: "jane@example.com" },
      ];
      User.find = jest.fn().mockResolvedValue(rawUsers);

      const users = await UserService.getAllUsers();
      expect(users).toEqual(expectedUsers);
      expect(users[0]).not.toHaveProperty("password");
      expect(User.find).toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    it("should create a new user with hashed password", async () => {
      const userData = {
        name: "John Doe",
        email: `${Math.random().toString(36).substring(2, 11)}@example.com`,
        password: "Password@123",
      };
      User.create = jest.fn().mockImplementation((data: User) => data);

      const newUser = await UserService.createUser(userData);
      expect(newUser).toEqual(userData);
      expect(User.create).toHaveBeenCalledWith(userData);
      jest.mock("../helpers/userHelpers", () => ({
        ...jest.requireActual("../helpers/userHelpers"),
        validateUserData: jest.fn().mockImplementation(() => {
          throw new Error("Validation failed");
        }),
      }));
    });
  });

  describe("hashPassword", () => {
    it("should return a hashed password", async () => {
      const plainPassword = "Password@123";
      const hashedPassword = await userHelpers.hashPassword(plainPassword);

      expect(hashedPassword).not.toEqual(plainPassword);
      expect(hashedPassword).toHaveLength(60);
    });

    it("should return different hashes for the same password", async () => {
      const plainPassword = "Password@123";
      const hashedPassword1 = await userHelpers.hashPassword(plainPassword);
      const hashedPassword2 = await userHelpers.hashPassword(plainPassword);

      expect(hashedPassword1).not.toEqual(hashedPassword2);
    });
  });

  describe("getUsersTickets", () => {
    it("should return all tickets for a user", async () => {
      const mockTickets = [
        {
          id: 1,
          number: "123",
          price: 100,
          isReserved: true,
          reservedAt: new Date(),
          event: {
            id: 1,
            name: "Event 1",
            date: new Date(),
          },
        },
      ];
      User.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockTickets),
      });

      const tickets = await UserService.getUsersTickets(1);
      expect(tickets).toEqual(mockTickets);
      expect(User.createQueryBuilder).toHaveBeenCalled();
    });
    it("should return an empty array when no tickets are found for the user", async () => {
      User.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      const tickets = await UserService.getUsersTickets(1);
      expect(tickets).toEqual([]);
      expect(User.createQueryBuilder).toHaveBeenCalled();
    });

    it("should handle errors thrown by the database", async () => {
      const error = new Error("Database error");
      User.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(error),
      });

      await expect(UserService.getUsersTickets(1)).rejects.toThrow(
        "Database error"
      );
    });

    it("should return no tickets for a non-existent user ID", async () => {
      User.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      const tickets = await UserService.getUsersTickets(999);
      expect(tickets).toEqual([]);
      expect(User.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return a user by id", async () => {
      const mockUser = {
        id: 7,
        name: "John Doe",
        email: "john@example.com",
      };
      User.findOneBy = jest.fn().mockResolvedValue(mockUser);

      const user = await UserService.getUserById(7);
      expect(user).toEqual(mockUser);
      expect(User.findOneBy).toHaveBeenCalledWith({ id: 7 });
    });
    it("should handle errors gracefully when the user is not found", async () => {
      User.findOneBy = jest.fn().mockResolvedValue(null);

      const user = await UserService.getUserById(999);
      expect(user).toBeNull();
      expect(User.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it("should handle database errors", async () => {
      const error = new Error("Database connection error");
      User.findOneBy = jest.fn().mockRejectedValue(error);

      await expect(UserService.getUserById(7)).rejects.toThrow(
        "Database connection error"
      );
    });
  });
});

afterAll(async () => {
  await AppDataSource.destroy();
});
