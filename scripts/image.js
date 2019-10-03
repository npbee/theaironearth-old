/**
 * Converts images within the `static/img` folder to webp.  This should be done
 * before deploying with the results committed to the repo
 */
const path = require("path");
const sharp = require("sharp");
const fg = require("fast-glob");

const options = {
  quality: 85,
};

convertAll();

async function convertAll() {
  const jpegs = await fg(["static/img/**/*.jpg"]);

  for (let jpeg of jpegs) {
    await convert(jpeg);
  }
}

async function convert(imagePath) {
  const outPath = getWebpOutPath(imagePath);

  try {
    await sharp(imagePath)
      .webp({ quality: options.quality, force: true })
      .toFile(outPath);
    console.log(`Converted ${imagePath} -> ${outPath}`);
  } catch (err) {
    console.error(`Error converting ${imagePath}`);
    console.error(err);
  }
}

function getWebpOutPath(inPath) {
  return path.join(
    path.dirname(inPath),
    `${path.basename(inPath, path.extname(inPath))}.webp`
  );
}
