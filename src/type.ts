// ======================
// data
// ======================

export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: FileTreeNode[] | null;
}

// ======================
// function
// ======================

export type Request = <Response>(input: RequestInfo | URL) => Promise<Response>;

export type JoinPath = (...args: string[]) => string;

export type ParsePath = (path: string) => string[];

export type GetRootPath = () => string;

// ======================
// api
// ======================

// export type SomeRequestResponse = {};
