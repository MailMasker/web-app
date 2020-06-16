var versiony = require("versiony");

versiony
  .minor()
  .from("./config/app-version.json")
  .to()
  .to("package.json")
  .end();
