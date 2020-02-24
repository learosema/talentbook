import { mocked } from "ts-jest/utils";
import { Fakexpress } from "../test-utils/fakexpress";
import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { getAuthUser } from "../auth-helper";
import { createIdentity } from "../entities/identity";
import { SkillService } from "./skill-service";

/**
 * mock typeORM database stuff.
 */
jest.mock("typeorm", () => ({
  PrimaryColumn: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  Like: jest.fn(),
  getConnection: jest.fn(),
  getRepository: jest.fn()
}));

/**
 * mock auth cookie stuff
 */
jest.mock("../auth-helper", () => ({
  getAuthUser: jest.fn()
}));

beforeEach(() => {
  mocked(getAuthUser).mockClear();
  mocked(getRepository).mockClear();
});

/**
 * SkillService.getSkill tests
 */
describe("SkillService.getSkills", () => {
  test("SkillService.getSkills - happy path", async () => {
    const xp = new Fakexpress({});
    const searchResult = [
      {
        name: "react",
        description: "declarative web framework",
        homepage: "https://reactjs.org"
      }
    ];
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return {
          find: () => Promise.resolve(searchResult)
        };
      }
      throw Error("Not supported");
    });
    await SkillService.getSkills(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    expect(xp.responseData).toStrictEqual(searchResult);
  });
});

/**
 * SkillService.addSkill tests
 */
describe("SkillService.addSkill", () => {
  test("SkillService.addSkill - happy path", async () => {
    const xp = new Fakexpress({
      body: {
        name: "react",
        description: "declarative web framework",
        homepage: "https://reactjs.org"
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );
    const fakeRepo = {
      insert: jest.fn(),
      count: jest.fn().mockImplementation(() => Promise.resolve(0))
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return fakeRepo;
      }
      throw Error("Not supported");
    });
    await SkillService.addSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: "ok" });
    expect(xp.res.statusCode).toBe(200);
    expect(fakeRepo.count.mock.calls.length).toBe(1);
    expect(fakeRepo.insert.mock.calls.length).toBe(1);
  });

  test("SkillService.addSkill - not logged in", async () => {
    const xp = new Fakexpress({
      body: {
        name: "react",
        description: "declarative web framework",
        homepage: "https://reactjs.org"
      }
    });
    mocked(getAuthUser).mockImplementation(req => Promise.resolve(null));

    await SkillService.addSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: "Unauthorized" });
    expect(xp.res.statusCode).toBe(401);
  });

  test("SkillService.addSkill - skill already exists", async () => {
    const xp = new Fakexpress({
      body: {
        name: "react",
        description: "declarative web framework",
        homepage: "https://reactjs.org"
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );
    const fakeRepo = {
      insert: jest.fn(),
      count: jest.fn().mockImplementation(() => Promise.resolve(1))
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return fakeRepo;
      }
      throw Error("Not supported");
    });
    await SkillService.addSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: "Skill already exists" });
    expect(xp.res.statusCode).toBe(403);
    expect(fakeRepo.count.mock.calls.length).toBe(1);
    expect(fakeRepo.insert.mock.calls.length).toBe(0);
  });

  test("SkillService.addSkill - no request body", async () => {
    const xp = new Fakexpress({});
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );

    await SkillService.addSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toBeDefined();
    expect(xp.responseData.error).toBe("Bad request");
    expect(xp.res.statusCode).toBe(400);
  });

  test("SkillService.addSkill - missing name property", async () => {
    const xp = new Fakexpress({
      body: {
        description: "A framework without a name"
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );

    await SkillService.addSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toBeDefined();
    expect(xp.responseData.error).toBe("Bad request");
    expect(xp.res.statusCode).toBe(400);
  });
});

/**
 * SkillService.updateSkill tests
 */
describe("SkillService.updateSkill", () => {
  test("SkillService.updateSkill - happy path", async () => {
    const xp = new Fakexpress({
      params: {
        name: "react"
      },
      body: {
        description: "A cool framework",
        homepage: "https://reactjs.org"
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );
    const fakeRepo = {
      findOne: jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: 1,
          name: "react",
          description: "",
          homepage: ""
        })
      ),
      save: jest.fn()
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return fakeRepo;
      }
      throw Error("Not supported");
    });
    await SkillService.updateSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: "ok" });
    expect(xp.res.statusCode).toBe(200);
    expect(fakeRepo.findOne.mock.calls.length).toBe(1);
    expect(fakeRepo.save.mock.calls.length).toBe(1);
  });

  test("SkillService.updateSkill - not logged in", async () => {
    const xp = new Fakexpress({
      params: {
        name: "react"
      },
      body: {
        description: "A cool framework",
        homepage: "https://reactjs.org"
      }
    });
    mocked(getAuthUser).mockImplementation(req => Promise.resolve(null));
    await SkillService.updateSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: "Unauthorized" });
    expect(xp.res.statusCode).toBe(401);
  });

  test("SkillService.updateSkill - skill not found", async () => {
    const xp = new Fakexpress({
      params: {
        name: "react"
      },
      body: {
        description: "A cool framework",
        homepage: "https://reactjs.org"
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );
    const fakeRepo = {
      findOne: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
      save: jest.fn()
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return fakeRepo;
      }
      throw Error("Not supported");
    });
    await SkillService.updateSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: "Skill not found" });
    expect(xp.res.statusCode).toBe(404);
    expect(fakeRepo.findOne.mock.calls.length).toBe(1);
    expect(fakeRepo.save.mock.calls.length).toBe(0);
  });

  test("SkillService.updateSkill - bad request", async () => {
    const xp = new Fakexpress({
      params: {
        name: "react"
      },
      body: {
        description: "A cool framework",
        homepage: "www.reactjs.org" // invalid: must be a valid url (https:// prefix missing)
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );
    const fakeRepo = {
      findOne: jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: 1,
          name: "react",
          description: "",
          homepage: ""
        })
      ),
      save: jest.fn()
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return fakeRepo;
      }
      throw Error("Not supported");
    });
    await SkillService.updateSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toBeDefined();
    expect(xp.responseData.error).toBe("Bad request");
    expect(xp.res.statusCode).toBe(400);
    expect(fakeRepo.findOne.mock.calls.length).toBe(1);
    expect(fakeRepo.save.mock.calls.length).toBe(0);
  });
});

describe("SkillService.deleteSkill", () => {
  test("SkillService.deleteSkill - happy path", async () => {
    const xp = new Fakexpress({
      params: {
        name: "jquery"
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );
    const fakeRepo = {
      delete: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ affected: 1 }))
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return fakeRepo;
      }
      throw Error("Not supported");
    });
    await SkillService.deleteSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: "ok" });
    expect(xp.res.statusCode).toBe(200);
    expect(fakeRepo.delete.mock.calls.length).toBe(1);
  });

  test("SkillService.deleteSkill - skill not found", async () => {
    const xp = new Fakexpress({
      params: {
        name: "jquery"
      }
    });
    mocked(getAuthUser).mockImplementation(req =>
      Promise.resolve(createIdentity("Max", "Max Muster"))
    );
    const fakeRepo = {
      delete: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ affected: 0 }))
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === "function" && func.name === "Skill") {
        return fakeRepo;
      }
      throw Error("Not supported");
    });
    await SkillService.deleteSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: "Skill not found" });
    expect(xp.res.statusCode).toBe(404);
    expect(fakeRepo.delete.mock.calls.length).toBe(1);
  });

  test("SkillService.deleteSkill - not logged in", async () => {
    const xp = new Fakexpress({
      params: {
        name: "jquery"
      }
    });
    mocked(getAuthUser).mockImplementation(req => Promise.resolve(null));
    await SkillService.deleteSkill(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: "Unauthorized" });
    expect(xp.res.statusCode).toBe(401);
  });
});
