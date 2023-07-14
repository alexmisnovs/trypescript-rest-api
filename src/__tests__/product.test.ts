import supertest from "supertest";
import { createServer } from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createProduct } from "../services/product.service";
import { IProductInput } from "../models/product.model";
import { signJWT } from "../utils/jwt";
import { IUserInput } from "../models/user.model";

const mockUserId = new mongoose.Types.ObjectId().toString();

export const mockProductPayload: IProductInput = {
  user: mockUserId,
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
  image: "https://i.imgur.com/QlRphfQ.jpg",
  price: 699.99,
};

interface IMockUser extends Omit<IUserInput, "password"> {
  _id: string;
}
export const mockUserPayload: IMockUser = {
  _id: mockUserId,
  email: "jane.doe@app.com",
  name: "Jane Doe",
};

const app = createServer();

describe("product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("Healthcheck", () => {
    it("should return 200", async () => {
      await supertest(app).get(`/healthcheck`).expect(200);
    });
  });

  describe("get product route", () => {
    describe("given the product does not exist: ", () => {
      it("should return a 404", async () => {
        const productId = "123";
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe("given the product does exist: ", () => {
      // create product first

      it("should return a 200 status and a product", async () => {
        const product = await createProduct(mockProductPayload);

        const productId = product.productId;

        const { body, statusCode } = await supertest(app).get(`/api/products/${productId}`);

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });

  describe("create product route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post(`/api/products/`);
        expect(statusCode).toBe(403);
      });
    });
    // can use skip() or only() on both describe and it if necessary
    describe("given the user is logged in", () => {
      it("should return a 200 and a product", async () => {
        // sign JWT
        const jwt = signJWT(mockUserPayload);

        const { body, statusCode } = await supertest(app)
          .post(`/api/products/`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(mockProductPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description:
            "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
          image: "https://i.imgur.com/QlRphfQ.jpg",
          price: 699.99,
          productId: expect.any(String),
          title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
