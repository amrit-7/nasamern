const request = require("supertest");
const app = require("../../app");
const { mongoConnection, mongoDisconnect } = require("../../services/mongo");

describe("launches API ", () => {
  beforeAll(async () => {
    await mongoConnection();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test GET /launches", () => {
    test("It should respond 200", async () => {
      const res = await request(app).get("/v1/launches");
      expect(res.statusCode).toBe(200);
    });
  });
});
