import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { FastifyInstance } from "fastify";
import supertest from "supertest";
import { v4 as uuid } from "uuid";

import { isoCodes } from "../src/utils";
import { setup } from "../src/setup";

describe("Countries test", () => {
  let app: FastifyInstance;
  const sessionId = uuid();

  beforeAll(async () => {
    app = setup();

    await app.ready();
    await app.orm.runMigrations();
    await app.listen({ port: 4242 });
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Status", () => {
    it("Session error", async () => {
      const response = await supertest(app.server)
        .patch("/api/countries/status")
        .send({
          enabled: true,
          code: "CU",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.headers["set-cookie"]?.[0]).toBeUndefined();
      expect(response.headers.session).toBeUndefined();
    });

    it("Enable/Disable", async () => {
      const _temp = await supertest(app.server)
        .patch("/api/countries/status")
        .send({
          enabled: true,
          code: "US",
        })
        .set("Cookie", `session=${sessionId}`);

      const response = await supertest(app.server)
        .patch("/api/countries/status")
        .send({
          enabled: true,
          code: "CU",
        })
        .set("Cookie", `session=${sessionId}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        type: "Country",
        data: {
          enabled: expect.any(Boolean),
          code: expect.any(String),
        },
      });

      expect(response.headers["set-cookie"][0]).toContain(
        `session=${sessionId}`
      );

      expect(response.headers.session).toBe(sessionId);
      expect(response.body.data.enabled).toBe(true);
      expect(response.body.data.code).toBe("CU");
    });
  });

  describe("List", () => {
    it("All without session", async () => {
      const response = await supertest(app.server)
        .get("/api/countries?all=true&page=1")
        .expect(200);

      expect(response.body.data.length).toBe(response.body.meta.limit);

      expect(response.body.meta).toMatchObject({
        limit: expect.any(Number),
        page: expect.any(Number),
      });

      response.body.data.forEach((country) => {
        const expected: any = isoCodes.getByCountryCode(country.code);
        expect(country).toMatchObject(expected);
      });

      expect(response.body.meta).toMatchObject({
        limit: expect.any(Number),
        page: expect.any(Number),
      });
    });

    it("Only me by session", async () => {
      const response = await supertest(app.server)
        .get("/api/countries?page=1")
        .set("Cookie", `session=${sessionId}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.data.length).toBe(2);

      response.body.data.forEach((country) => {
        const expected: any = isoCodes.getByCountryCode(country.code);

        expect(["US", "CU"].includes(country.code)).toBeTruthy();
        expect(country).toMatchObject(expected);
      });
    });
  });

  describe("Status", () => {
    it("All", async () => {
      const response = await supertest(app.server)
        .get("/api/countries/status")
        .set("Cookie", `session=${sessionId}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

      Object.entries(response.body.data).forEach(([countryCode, enabled]) => {
        expect(!!isoCodes.getByCountryCode(countryCode)).toBeTruthy();
        expect(["US", "CU"].includes(countryCode)).toBeTruthy();
        expect(enabled).toBeTruthy();
      });
    });

    it("Only selected", async () => {
      const _temp = await supertest(app.server)
        .patch("/api/countries/status")
        .send({
          enabled: true,
          code: "AT",
        })
        .set("Cookie", `session=${sessionId}`);

      const first = await supertest(app.server)
        .get(`/api/countries/status?codes=${["CU", "US"].join(",")}`)
        .set("Cookie", `session=${sessionId}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

      Object.entries(first.body.data).forEach(([countryCode, enabled]) => {
        expect(!!isoCodes.getByCountryCode(countryCode)).toBeTruthy();
        expect(["US", "CU"].includes(countryCode)).toBeTruthy();
        expect(enabled).toBeTruthy();
      });

      const second = await supertest(app.server)
        .get(`/api/countries/status?codes=${["CU", "US", "AT"].join(",")}`)
        .set("Cookie", `session=${sessionId}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

      Object.entries(second.body.data).forEach(([countryCode, enabled]) => {
        expect(!!isoCodes.getByCountryCode(countryCode)).toBeTruthy();
        expect(["US", "CU", "AT"].includes(countryCode)).toBeTruthy();
        expect(enabled).toBeTruthy();
      });
    });
  });
});
