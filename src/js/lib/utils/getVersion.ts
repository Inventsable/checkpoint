import datum from "../../../../package.json";
import { csi } from "./bolt";
import { fs, path } from "./node";

export const getPackage = () => {
  return datum;
};

export const getVersionSync = (): string => {
  const data = window.cep.fs.readFile(
    path
      .join(csi.getSystemPath("extension"), "CSXS/manifest.xml")
      .replace(/^file\:\\/, "")
      .replace(/\\/gm, "/")
  ).data;
  return new DOMParser()
    .parseFromString(data, "text/xml")
    .getElementsByTagName("ExtensionManifest")[0]
    .getAttribute("ExtensionBundleVersion") as string;
};

export const getVersion = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path
        .join(csi.getSystemPath("extension"), "CSXS/manifest.xml")
        .replace(/^file\:\\/, "")
        .replace(/\\/gm, "/"),
      { encoding: "utf-8" },
      (err: NodeJS.ErrnoException | null, data: string): void => {
        if (err) reject(err);
        else
          resolve(
            new DOMParser()
              .parseFromString(data, "text/xml")
              .getElementsByTagName("ExtensionManifest")[0]
              .getAttribute("ExtensionBundleVersion") as string
          );
      }
    );
  });
};
