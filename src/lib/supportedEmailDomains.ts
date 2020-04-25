const supportedEmailDomains =
  process.env.REACT_APP_ENVIRONMENT === "local"
    ? ["mailmasker-local.com"]
    : process.env.REACT_APP_ENVIRONMENT === "dev"
    ? ["mailmasker-dev.com"]
    : ["mailmasker.com"];

export default supportedEmailDomains;
