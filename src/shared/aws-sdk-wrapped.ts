import * as AWSXRay from "aws-xray-sdk-core";
import * as PureAWS from "aws-sdk";

// Only enable tracing when it's running in the Lambda runtime environment, not by 'invoke local'
export const AWS = !process.env.IS_LOCAL && process.env.AWS_LAMBDA_FUNCTION_VERSION?.length > 0
    ? AWSXRay.captureAWS(PureAWS)
    : PureAWS;
