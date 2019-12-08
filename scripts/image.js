/**
 * Converts images within the `static/img` folder to webp.  This should be done
 * before deploying with the results committed to the repo
 *
 * NOTE: Decided not to use this for now in favor of Cloudinary, but leaving it here.
 */
const mkdirp = require("mkdirp");
const path = require("path");
const sharp = require("sharp");
const fg = require("fast-glob");
const fs = require("fs");
const { promisify } = require("util");

const options = {
  quality: 85,
};

const [, , arg] = process.argv;

if (arg) {
  convertGlob(arg);
} else {
  convertGlob("static/img/**/*.jpg");
}

async function convertGlob(glob) {
  const jpegs = await fg([glob]);

  for (let jpeg of jpegs) {
    await convert(jpeg);
    await convert(jpeg, "tiny");
    await convert(jpeg, "small");
    await convert(jpeg, "medium");
    await convert(jpeg, "large");
  }
}

function getWidth(size) {
  switch (size) {
    case "tiny":
      return 20;
    case "small":
      return 500;
    case "medium":
      return 800;
    case "large":
      return 1200;
  }
}

async function convert(imagePath, size = "original") {
  const webpOutPath = getWebpOutPath(imagePath, size);
  const jpegOutPath = getJpegOutPath(imagePath, size);
  console.log(webpOutPath);

  mkdirp.sync(path.dirname(webpOutPath));
  mkdirp.sync(path.dirname(jpegOutPath));

  try {
    await sharp(imagePath)
      .resize(getWidth(size))
      .webp({ quality: options.quality, force: true })
      .toFile(webpOutPath);

    await sharp(imagePath)
      .resize(getWidth(size))
      .toFile(jpegOutPath);

    console.log(`Converted ${imagePath} -> ${webpOutPath}`);
    console.log(`Converted ${imagePath} -> ${jpegOutPath}`);
  } catch (err) {
    console.error(`Error converting ${imagePath}`);
    console.error(err);
  }
}

// static/img/artwork/the-air-on-earth-front.jpg
function getBasePath(inPath, size) {
  return path.join(
    "static/img-opt",
    size,
    path.dirname(inPath.replace("static/img", ""))
  );
}

function getWebpOutPath(inPath, size) {
  console.log(getBasePath(inPath, size));
  return path.join(
    getBasePath(inPath, size),
    `${path.basename(inPath, path.extname(inPath))}.webp`
  );
}

function getJpegOutPath(inPath, size) {
  return path.join(
    getBasePath(inPath, size),
    `${path.basename(inPath, path.extname(inPath))}.jpg`
  );
}
