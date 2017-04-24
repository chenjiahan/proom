/**
 * proom v1.2.0
 */

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

; (function (): void {
    const ls = window.localStorage;
    const toArray = (item: any): any[] => Array.isArray(item) ? item : [item];
    const self = {
        // init proom
        init(conf: ProomInitConfig): Proom {
            this.prefix = conf.prefix || '';
            this.reload = conf.version !== this.get('version') || location.href.indexOf('cleanroom') !== -1;
            this.store = {};
            this.clean().set('version', conf.version);
            return this;
        },

        // localStorage.setItem
        set(key: string, value: string): void {
            if (ls) {
                try {
                    ls.setItem(this.prefix + key, value);
                } catch (e) {
                    e.code === 22 && ls.clear();
                }
            }
        },

        // localStorage.getItem
        get(key: string): string {
            return ls ? ls.getItem(this.prefix + key) : void 0;
        },

        // localStorage.removeItem
        remove(key: string): void {
            ls && ls.removeItem(this.prefix + key);
        },

        // inject script
        inject(arr: string | string[]): Proom {
            return toArray(arr).map((key: string): void => {
                const tag = document.createElement(this.store[key].type === 'css' ? 'style' : 'script');
                tag.innerHTML = this.store[key].code;
                document.head.appendChild(tag);
            }), this;
        },

        // fetch script by ajax
        fetch(key: string): void {
            const xhr = new XMLHttpRequest();
            const conf = this.store[key];
            xhr.open('get', conf.url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)) {
                    conf.code = xhr.responseText
                    this.set(conf.type + '_' + key, conf.code);
                    conf.onLoad(key);
                }
            };
            xhr.send();
        },

        // clean old version file
        clean(): Proom {
            if (this.reload) {
                for (const item in ls) {
                    !item.indexOf(this.prefix) && ls.removeItem(item);
                }
            }
            return this;
        },

        // load file
        load(obj: ProomLoadConfig): Proom {
            Object.keys(obj).forEach((key: string) => {
                const conf = obj[key];
                conf.type = conf.url.split('.').pop();
                conf.onLoad = conf.onLoad || this.inject;
                this.store[key] = conf;
                if (this.reload) {
                    this.fetch(key);
                } else {
                    conf.code = this.get(conf.type + '_' + key);
                    conf.code ? conf.onLoad(key) : this.fetch(key);
                }
            })
            return this;
        },

        // check if store contains target code
        has(arr: string | string[]): boolean {
            return toArray(arr).every((key: string) => 
                !!(this.store[key] && this.store[key].code)
            );
        }
    } as Proom;

    window['proom'] = self;
})();
