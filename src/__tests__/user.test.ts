import * as UserService from "../services/user.service";
import * as SessionService from "../services/session.service";
import supertest from "supertest";
import { IUserInput } from "../models/user.model";
import mongoose from "mongoose";
import { createServer } from "../utils/server";
import { ISession, ISessionInput } from "../models/session.model";
import { createUserSessionHanlder } from "../controllers/session.controller";

const app = createServer();

const mockUserId = new mongoose.Types.ObjectId().toString();
interface IMockUser extends Omit<IUserInput, "password"> {
  _id: string;
}
const mockUserPayload: IMockUser = {
  _id: mockUserId,
  email: "jane@doe.com",
  name: "Jane Doe",
};

interface IMockUserInput extends IUserInput {
  password_confirmation: string;
}
const mockUserInput: IMockUserInput = {
  email: "jane@doe.com",
  name: "Jane Doe",
  password: "Password123",
  password_confirmation: "Password123",
};

interface IMockSessionInput extends ISessionInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const mockSessionPayload: IMockSessionInput = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: mockUserId,
  valid: true,
  userAgent: "chrome",
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

describe("User", () => {
  // user registration

  describe("User registration", () => {
    // the username and password get validated
    describe("given the username and password are valid", () => {
      it("should return the user payload", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(mockUserPayload);

        const { statusCode, body } = await supertest(app).post("/api/users").send(mockUserInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(mockUserPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(mockUserInput);
      });
    });

    describe("given the passwords do not match", () => {
      it("should return 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(mockUserPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send({ ...mockUserInput, password_confirmation: "doesntmatch" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    // verify that handlers handle any errors
    describe("given the user service throws", () => {
      it("should handle the error by returning 409", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          .mockRejectedValue("Oh no rejected");

        const { statusCode, body } = await supertest(app).post("/api/users").send(mockUserInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  // creating the user session

  describe("Create user session", () => {
    // a user can login with a valid email and password
    describe("given the username and password are valid", () => {
      it("should return a signed accessToken and refreshToken", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          //@ts-ignore
          .mockReturnValue(mockUserPayload);
        jest
          .spyOn(SessionService, "createSession")
          // @ts-ignore
          .mockReturnValue(mockSessionPayload);

        const req = {
          get: () => {
            return "a user agent";
          },
          body: {
            email: mockUserInput.email,
            password: mockUserInput.password,
          },
        };

        const send = jest.fn();

        const res = {
          send,
        };

        // @ts-ignore
        await createUserSessionHanlder(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
