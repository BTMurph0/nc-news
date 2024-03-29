const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpointsFile = require("../endpoints.json");

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
describe("GET /api", () => {
  test("GET:200 sends an object containing description of the endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endPoints = response.body;
        expect(endPoints).toEqual(endpointsFile);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.title).toBe("Z");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("I was hungry.");
        expect(article.created_at).toBe(new Date(1578406080000).toISOString());
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("GET /api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET:200 sends an array of articles to the client sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 sends an array of articles to the client which do not include the articles body column", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments for a single article to the client", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("GET:200 sends an array of comments for a single article to the client with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:404 reponds with an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/34324/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("34324 does not exist in articles");
      });
  });
  test("GET:400 responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("GET:200 responds with an appropriate  message when given an article id for an article which does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 inserts a new comment to the db and sends the new comment back to the client", () => {
    const newComment = {
      author: "butter_bridge",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("a new comment");
      });
  });
  test("POST:201 inserts a new comment to the db and sends the new comment back to the client when unnecessary properties are included", () => {
    const newComment = {
      author: "butter_bridge",
      body: "a new comment",
      unnecessary_prop: "unnecessary prop",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("a new comment");
        expect(comment).not.toHaveProperty("unnecessary_prop");
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with missing key", () => {
    const newComment = {
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Bad Request");
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided a non-existing article id", () => {
    const newComment = {
      author: "butter_bridge",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/3432432/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("3432432 does not exist in articles");
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided a non-existing article id", () => {
    const newComment = {
      author: "butter_bridge",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/3432432/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("3432432 does not exist in articles");
      });
  });
  test("POST:400 responds with an appropriate error message when given an invalid id", () => {
    const newComment = {
      author: "butter_bridge",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided a non-existing username", () => {
    const newComment = {
      author: "fdsfdsf",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("fdsfdsf does not exist in users");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 responds with appropriate status and sends the updated article to the client", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:200 responds with appropriate status and sends the updated article to the client", () => {
    const input = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:404 responds with an appropriate status and error message when provided a non-existing article id", () => {
    const input = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/3432432")
      .send(input)
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("3432432 does not exist in articles");
      });
  });
  test("PATCH:400 responds with an appropriate status and error message when provided a non-valid article id", () => {
    const input = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(input)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Bad Request");
      });
  });
  test("PATCH:400 responds with an appropriate status and error message when provided a non-valid input", () => {
    const input = { inc_votes: "string" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Bad Request");
      });
  });
  test("PATCH:400 responds with an appropriate status and error message when provided a non-valid key", () => {
    const input = { inc_vo: "string" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 deletes the comment and does not return content", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
        return db.query("SELECT * FROM comments;");
      })
      .then((finalResponse) => {
        expect(finalResponse.rows.length).toBe(17);
      });
  });
  test("DELETE:404 responds with error message when passed a non-existing comment id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("999 does not exist in comments");
      });
  });
  test("DELETE:400 responds with an error message when passed an invalid id", () => {
    return request(app)
      .delete("/api/comments/six")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("GET /api/users", () => {
  test("GET:200 responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api/articles topic query", () => {
  test("GET:200 sends an array of articles filtered by a topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET:200 sends an empty array when passed a valid topic on which there are no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toEqual([]);
      });
  });
  test("GET:404 returns error message when passed an non-existing topic", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("dogs does not exist in topics");
      });
  });
});
describe("GET /api/articles/:article_id (comment_count)", () => {
  test("GET:200 returns the article with the passed id and the comment_count for that article", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.comment_count).toBe(String(2));
        expect(article.article_id).toBe(9);
        expect(article.title).toBe("They're not exactly dogs, are they?");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("Well? Think about it.");
        expect(article.created_at).toBe("2020-06-06T09:10:00.000Z");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:200 returns the article with the passed id and a comment_count of 0 if the article has no comments", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.comment_count).toBe(String(0));
        expect(article.article_id).toBe(4);
      });
  });
});
describe("GET /api/articles (sorting)", () => {
  test("GET:200 returns articles sorted by passed query", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });
  test("GET:400 returns error message when passed an invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=name&order=asc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test("GET:400 returns error message when passed an invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=alphabetic")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});
describe('GET /api/users/:username', () => {
  test('GET:200 returns a single user to the client', () => {
    return request(app)
    .get('/api/users/icellusedkars')
    .expect(200)
    .then((response) => {
      const user = response.body.user;
      expect(user.username).toBe('icellusedkars');
      expect(user.name).toBe('sam');
      expect(user.avatar_url).toBe(
        "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
      );
    })
  })
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent username", () => {
    return request(app)
      .get("/api/users/bruce")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("bruce does not exist in users");
      });
  });
})
