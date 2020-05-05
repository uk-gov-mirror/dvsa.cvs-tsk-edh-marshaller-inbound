import {ITarget} from "../../src/models";
import {Configuration} from "../../src/utils/Configuration";
import {MarshallingService} from "../../src/services/MarshallingService";
import demoStation from "../resources/demoStation.json"
describe("isValidMessageBody", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  const target: ITarget = {
    queue: "",
    swaggerSpecFile: "API_Test_Stations_EDH->CVS_v1.yaml",
    schemaItem: "testStation"
  };
  describe("When validation = true", () => {
    let secretMock: any;
    afterEach(() => {
      jest.clearAllMocks();
    });
    afterAll(() => {
      secretMock.mockRestore();
    });
    beforeAll(() => {
      secretMock = jest.spyOn(Configuration.prototype, "getSecretConfig").mockResolvedValue(Promise.resolve({
        baseUrl: "",
        apiKey: "",
        host: "",
        validation: "true"
      }));
    });

    it("returns false when evaluating a completely invalid record against a valid spec", async () => {
      const svc = new MarshallingService();
      const output = await svc.isValidMessageBody({something: "invalid"}, target);
      expect(secretMock).toHaveBeenCalled();
      expect(output).toEqual(false);
    });
    it("returns true when evaluating a 'good' record against a valid spec", async () => {
      const svc = new MarshallingService();
      const output = await svc.isValidMessageBody(demoStation, target);
      expect(output).toEqual(true);
    });
  });
  describe("when validation = false", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("always returns true", async () => {
      const secretMock = jest.spyOn(Configuration.prototype, "getSecretConfig").mockResolvedValue(Promise.resolve({
        baseUrl: "",
        apiKey: "",
        host: "",
        validation: false
      }));
      const svc = new MarshallingService();
      const output = await svc.isValidMessageBody({something: "invalid"}, target);
      expect(output).toEqual(true);
      secretMock.mockRestore();
    });
  });
  describe("when validation is not set in secrets", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("always returns true", async () => {
      const secretMock = jest.spyOn(Configuration.prototype, "getSecretConfig").mockResolvedValue(Promise.resolve({}));
      const svc = new MarshallingService();
      const output = await svc.isValidMessageBody({something: "invalid"}, target);
      expect(output).toEqual(true);
      secretMock.mockRestore();
    });
  });
});
