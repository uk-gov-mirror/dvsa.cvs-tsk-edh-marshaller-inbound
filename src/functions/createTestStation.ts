import {APIGatewayProxyEvent, Handler} from "aws-lambda";
import {ISubSeg} from "../models";
import {ERROR, TARGET, CHANGE} from "../models/enums";
import {MarshallingService} from "../services/MarshallingService";
/* tslint:disable */
let AWS:any;
if (process.env._X_AMZN_TRACE_ID) {
  /* tslint:disable */
  AWS = require("aws-xray-sdk");
} else {
  console.log("Serverless Offline detected; skipping AWS X-Ray setup");
}
/* tslint:enable */
const createTestStation: Handler = async (event: APIGatewayProxyEvent) => {
  let subseg: ISubSeg | null = null;
  if (process.env._X_AMZN_TRACE_ID) {
    const segment = AWS.getSegment();
    AWS.capturePromise();
    if (segment) {
      subseg = segment.addNewSubsegment("postTestResults");
    }
  }

  const payload = event.body;
  const testStationId = event.pathParameters?.testStationId;
  const headers = event.headers;
  console.log("Trace Header: ", headers["X-Amzn-Trace-Id"]);

  try {
    if (!payload) {
      if (subseg) { subseg.addError(ERROR.INVALID_PAYLOAD); }
      throw new Error(ERROR.INVALID_PAYLOAD);
    }

    if (!testStationId) {
      if (subseg) { subseg.addError(ERROR.INVALID_PATH_PARAM); }
      throw new Error(ERROR.INVALID_PATH_PARAM);
    }

    const marshallingService = new MarshallingService();
    return await marshallingService.processRequest(payload, TARGET.TEST_STATIONS, CHANGE.CREATE, testStationId)
  } finally {
    if (subseg) {
      subseg.close();
    }
  }
}
