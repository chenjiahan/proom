declare var proom: Proom;

interface ProomInitConfig {
    prefix?: string;
    version: string;
}

interface ProomLoadConfig {
    [key: string]: {
        url: string;
        onLoad?: (key: name) => void;
    }
}

interface ProomStore {
    [key: string]: {
        url: string;
        code?: string;
        onLoad?: (key: name) => void;
    }
}

interface Proom {
    reload: boolean;
    store: ProomStore;
    prefix: string;
    init: (conf: ProomInitConfig) => this;
    set: (key: string, value: string) => void;
    get: (key: string) => string;
    inject: (key: string | string[]) => this;
    fetch: (key: string) => void;
    clean: () => void;
    load: (conf: ProomLoadConfig) => this;
    has: (key: string | string[]) => boolean;
}
