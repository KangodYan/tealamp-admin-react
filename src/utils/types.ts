export type ZustandHookSelectors<StateType> = {
    [Key in keyof StateType as `use${Capitalize<string & Key>}`]: () => StateType[Key];
};
export interface ZustandGetterSelectors<StateType> {
    getters: {
        [key in keyof StateType]: () => StateType[key];
    };
}

export interface PageMeta {
    currentPage: number;
    itemCount: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}

export interface QueryResultType<T> {
    items: T[];
    meta: PageMeta;
}

export interface ResponseResultType {
    error: string;
    message: string[];
    statusCode: number;
}

export interface OSSType {
    expire: string;
    policy: string;
    signature: string;
    accessId: string;
    host: string;
    dir: string;
}

export interface TreeNode {
    id: number;
    label: string;
    parent: TreeNode | null;
    children: TreeNode[];
}
