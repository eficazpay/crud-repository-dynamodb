"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS = void 0;
const AWSXRay = require("aws-xray-sdk-core");
const PureAWS = require("aws-sdk");
// Only enable tracing when it's running in the Lambda runtime environment, not by 'invoke local'
exports.AWS = !process.env.IS_LOCAL && ((_a = process.env.AWS_LAMBDA_FUNCTION_VERSION) === null || _a === void 0 ? void 0 : _a.length) > 0
    ? AWSXRay.captureAWS(PureAWS)
    : PureAWS;
//# sourceMappingURL=aws-sdk-wrapped.js.map