import { statSync, readdirSync } from "fs";

import { FileTreeNode, JoinPath, ParsePath, GetRootPath } from "./type";

export const joinPath: JoinPath = (...args) => args.join("/");

export const parsePath: ParsePath = (path) =>
  path.split("/").filter((pathParams) => pathParams !== "");

export const getRootPath: GetRootPath = () => process.cwd();

export class FileSystemController {
  static getFileName(path: string): string {
    return path.split("/").pop() || "";
  }

  static getFileExtension(path: string): string {
    return path.split(".").pop() || "";
  }

  // See https://www.typescriptlang.org/docs/handbook/utility-types.html
  static getFileStatus(
    path: string
  ): Exclude<NonNullable<ReturnType<typeof statSync>>, "BigIntStats"> | null {
    try {
      return statSync(path);
    } catch (error: unknown) {
      console.error("error :", error);
      return null;
    }
  }

  static listDirectoryContents(path: string): string[] | null {
    const fileStatus = this.getFileStatus(path);
    if (fileStatus === null || fileStatus.isFile()) return null;
    return readdirSync(path);
  }

  static createFileTree(
    path: string,
    depth: number = 1,
    regex?: RegExp,
    rootPath?: string
  ): FileTreeNode | null {
    const status = this.getFileStatus(path);
    if (status === null) return null;
    const node: FileTreeNode = {
      name: this.getFileName(path),
      path: path.replace(rootPath ?? path, ""),
      isDirectory: status.isDirectory(),
      createdAt: status.birthtime,
      updatedAt: status.mtime,
      children: null,
    };
    // TODO: 파일 탐색 시에는 빈 폴더 포함, 검색 시에는 빈 폴더 제외
    if (!node.isDirectory && regex && !regex.test(path)) return null;
    if (node.isDirectory && depth > 0)
      node.children = this.listDirectoryContents(path)!
        .map(
          (child) =>
            this.createFileTree(
              joinPath(path, child),
              depth - 1,
              regex,
              rootPath ?? path
            )!
        )
        .filter((child) => child !== null);
    if (node.isDirectory && !node.children?.length) return null;
    return node;
  }

  static createCompleteFileTree(
    rootPath: string = process.cwd(),
    regex?: RegExp
  ): FileTreeNode | null {
    return this.createFileTree(rootPath, Infinity, regex);
  }

  // TODO: 파일 탐색 시에는 빈 폴더 포함, 검색 시에는 빈 폴더 제외
  static listAllFiles(
    path: string,
    regex?: RegExp,
    rootPath?: string
  ): string[] {
    const fileStatus = this.getFileStatus(path);
    if (fileStatus === null) return [];

    if (fileStatus.isFile()) {
      if (regex && !regex.test(this.getFileName(path))) return [];
      return [path.replace(rootPath ?? path, "")];
    }
    return readdirSync(path).flatMap((child) =>
      this.listAllFiles(joinPath(path, child), regex, rootPath ?? path)
    );
  }
}
