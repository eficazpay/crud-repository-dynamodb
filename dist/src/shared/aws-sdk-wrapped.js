"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS = void 0;
const AWSXRay = require("aws-xray-sdk-core");
const PureAWS = require("aws-sdk");
// Do not enable tracing for 'invoke local'
exports.AWS = process.env.IS_LOCAL || process.env.REGION == 'localhost'
    ? PureAWS
    : AWSXRay.captureAWS(PureAWS);
//# sourceMappingURL=aws-sdk-wrapped.js.map