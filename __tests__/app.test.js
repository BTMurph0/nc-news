const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpointsFile = require('../endpoints.json')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("status 404 when given an invalid path", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((response) => {
        expect(response.error.text).toBe("Sorry can't find that!");
      });
  });
});
describe('GET /api', () => {
  test('GET:200 sends an object containing description of the endpoints', () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((response) => {
      const endPoints = response.body.parsedEndpoints;
        expect(endPoints).toEqual(endpointsFile)
      });
    });
})
