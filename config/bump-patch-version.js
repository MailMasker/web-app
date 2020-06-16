var versiony = require("versiony");

versiony
  .patch()
  .from("./config/app-version.json")
  .to()
  .to("package.json")
  .end();
