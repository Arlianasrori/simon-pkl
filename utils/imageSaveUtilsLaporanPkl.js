import responseError from "../error/responseError.js";
import path from "path";

export const fileLaporaPkl = async (image, url) => {
  const fileName = image.name;
  console.log(fileName);
  const extFileRequired = [".jpg", ".png", ".jpeg"];
  const extFile = path.extname(fileName);
  if (!extFileRequired.includes(extFile)) {
    throw new responseError(400, `extensi file ${extFile} tidak didukung`);
  }
  const fullName = `${new Date().getTime()}-${fileName}`;
  const fullPath = `${url}/${fullName}`;
  const pathSaveFile = `./public/laporan_pkl/${fullName}`;

  return { fullPath, pathSaveFile };
};