const { upload } = require("bugsnag-sourcemaps");
const glob = require("glob");
const fs = require("fs");
const appVersion = require("./package.json").version;
const reportBuild = require("bugsnag-build-reporter");

// https://medium.com/sovtech-insights/upload-create-react-app-source-maps-to-bugsnag-for-easier-debugging-and-delete-them-afterwards-for-c834c729506a

/**
 * Find all of the map files in ./build
 */
function findSourceMaps(callback) {
  return glob("build/**/*/*.map", callback);
}

/**
 * Uploads the source map with accompanying sources
 * @param sourceMap - single .map file
 * @returns {Promise<string>} - upload to Bugsnag
 */
function uploadSourceMap(sourceMap) {
  // Remove .map from the file to get the js filename
  const minifiedFile = sourceMap.replace(".map", "");

  // Remove absolute path to the static assets folder
  const minifiedFileRelativePath = minifiedFile.split("build/")[1];

  if (!process.env.REACT_APP_SITE_HOSTNAME) {
    throw new Error("process.env.REACT_APP_SITE_HOSTNAME missing");
  }
  if (!process.env.REACT_APP_BUGSNAG_API_KEY) {
    throw new Error("process.env.REACT_APP_BUGSNAG_API_KEY missing");
  }

  return upload({
    apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
    appVersion: appVersion,
    overwrite: true,
    minifiedUrl: `http*://${process.env.REACT_APP_SITE_HOSTNAME}/${minifiedFileRelativePath}`,
    sourceMap,
    minifiedFile,
    projectRoot: __dirname,
    uploadSources: true,
  });
}

/**
 * Delete the .map files
 * We do this to protect our source
 * @param files - array of sourcemap files
 */
function deleteFiles(files) {
  files.forEach((file) => {
    const path = `${__dirname}/${file}`;
    fs.unlinkSync(path);
  });
}

/**
 * Notifies Bugsnag of the new release
 */
function notifyRelease() {
  reportBuild({
    apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
    appVersion,
    releaseStage: process.env.REACT_APP_RELEASE_STAGE,
  })
    .then(() => console.log("Bugsnag build reported"))
    .catch((err) =>
      console.log("Reporting Bugsnag build failed", err.messsage)
    );
}

/**
 * Find, upload and delete Source Maps
 */
function processSourceMaps() {
  findSourceMaps((error, files) =>
    Promise.all(files.map(uploadSourceMap))
      .then(() => {
        // deleteFiles(files);
        notifyRelease();
      })
      .catch((e) => {
        console.log(e);
      })
  );
}

processSourceMaps();
