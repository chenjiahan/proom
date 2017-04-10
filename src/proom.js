/**
 * proom v1.1.0
 */

;(function (w, d) {
    var ls = w.localStorage,
        self = {
            // init proom
            init: function (conf) {
                self.prefix = conf.prefix || '';
                self.reload = conf.version !== self.get('version') || ~location.href.indexOf('cleanroom');
                self.store = {};
                self.clean().set('version', conf.version);
                return self;
            },

            // localStorage.setItem
            set: function (key, value) {
                if (ls) {
                    try {
                        ls.setItem(self.prefix + key, value);
                    } catch (e) {
                        e.code === 22 && ls.clear();
                    }
                }
            },

            // localStorage.getItem
            get: function (key) {
                return ls ? ls.getItem(self.prefix + key) : void 0;
            },

            // localStorage.removeItem
            remove: function (key) {
                ls && ls.removeItem(self.prefix + key);
            },

            // inject script
            inject: function (arr) {
                return (Array.isArray(arr) ? arr : [arr]).map(function (key) {
                    var tag = d.createElement(self.store[key].type === 'css' ? 'style' : 'script');
                    tag.innerHTML = self.store[key].code;
                    d.head.appendChild(tag);
                }), self;
            },

            // fetch script by ajax
            fetch: function (key) {
                var xhr = new XMLHttpRequest(),
                    conf = self.store[key];
                xhr.open('get', conf.url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)) {
                        conf.code = xhr.responseText
                        self.set(conf.type + '_' + key, conf.code);
                        conf.onLoad(key);
                    }
                };
                xhr.send();
            },

            // clean old version file
            clean: function () {
                if (self.reload) {
                    for (var item in ls) {
                        !item.indexOf(self.prefix) && ls.removeItem(item);
                    }
                }
                return self;
            },

            // load file
            load: function (obj) {
                Object.keys(obj).forEach(function (key) {
                    var conf = obj[key];
                    conf.type = conf.url.split('.').pop();
                    conf.onLoad = conf.onLoad || self.inject;
                    self.store[key] = conf;
                    if (self.reload) {
                        self.fetch(key);
                    } else {
                        conf.code = self.get(conf.type + '_' + key);
                        conf.code ? conf.onLoad(key) :self.fetch(key);
                    }
                })
                return self;
            },

            // check if store contains target code
            has: function (arr) {
                return (Array.isArray(arr) ? arr : [arr]).every(function (key) {
                    return self.store[key] && self.store[key].code;
                })
            }
        };
    w.proom = self;
})(window, document);
