declare var proom: Proom;

interface ProomInitConfig {
    prefix?: string;
    version: string;
}

interface ProomLoadConfig {
    name: string;
    url: string;
    cb: Function;
}

interface Proom {
    init: (conf: ProomInitConfig) => this;
    set: (key: string, value: string) => void;
    get: (key: string) => string;
    inject: (name: string) => this;
    fetch: (name: string) => void;
    clean: () => void;
    load: (conf: ProomLoadConfig) => this;
    has: (name: string) => boolean;
}
