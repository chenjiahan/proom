export interface Proom {
    reload?: boolean;
    store?: ProomStore;
    prefix?: string;
    init?: (conf: ProomInitConfig) => Proom;
    set?: (key: string, value: string) => void;
    get?: (key: string) => string;
    inject?: (key: string | string[]) => Proom;
    fetch?: (key: string) => void;
    clean?: () => Proom;
    load?: (conf: ProomLoadConfig) => Proom;
    has?: (key: string | string[]) => boolean;
}
export interface ProomInitConfig {
    prefix?: string;
    version: string;
}
export interface ProomLoadConfig {
    [key: string]: ProomStoreItem;
}
export interface ProomStore {
    [key: string]: ProomStoreItem;
}
export interface ProomStoreItem {
    url: string;
    type: string;
    code?: string;
    onLoad?: (key: string) => void;
}
