import fs from "fs";
import path from "path";

interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

export const writeFile = (
  filePath: string,
  data: any
): Promise<Error | boolean> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(filePath),
      data,
      { encoding: "utf-8" },
      (err: ErrnoException | null): void => {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
};

export const makeFolder = (targetPath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(targetPath), (err) => {
      return err ? reject(false) : resolve(true);
    });
  });
};

export const readFile = (
  targetPath: string,
  verbose: boolean
): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(targetPath), "utf-8", (err, data) => {
      if (err) reject(err);
      if (!verbose) resolve(isJSON(data) ? JSON.parse(data) : data);
      else
        resolve({
          data: isJSON(data) ? JSON.parse(data) : data,
          stats: fs.lstatSync(path.resolve(targetPath)),
        });
    });
  });
};

export const readDir = async (targetPath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!exists(targetPath) || !isFolder(targetPath))
      reject("Path is not a folder or does not exist");
    fs.readdir(
      path.resolve(targetPath),
      { encoding: "utf-8" },
      (err, files) => {
        if (err) reject(err);
        resolve(files);
      }
    );
  });
};

export const isFolder = (targetPath: string): boolean => {
  return fs.lstatSync(path.resolve(targetPath)).isDirectory();
};

export const exists = (targetPath: string): boolean => {
  return fs.existsSync(path.resolve(targetPath));
};

function isJSON(data: string): boolean {
  try {
    JSON.parse(data);
    return true;
  } catch (err) {
    return false;
  }
}
