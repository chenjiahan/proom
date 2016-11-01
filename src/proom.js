; (function (w, d) {
    var ls = w.localStorage,
        proom = {
            // init proom
            init: function (conf) {
                this.prefix = conf.prefix || 'proom_';
                this.jsPrefix = 'js_';
                this.reload = conf.version !== this.get('version') || location.href.indexOf('cleanroom') !== -1;
                this.store = {};
                this.clean().set('version', conf.version);
                return this;
            },

            // localStorage.setItem
            set: function (key, value) {
                if (ls) {
                    try {
                        ls.setItem(this.prefix + key, value);
                    } catch (e) {
                        e.code === 22 && ls.clear();
                    }
                }
            },

            // localStorage.getItem
            get: function (key) {
                return ls ? ls.getItem(this.prefix + key) : '';
            },

            // inject script
            inject: function (name) {
                var conf = this.store[name],
                    script = d.createElement('script');
                script.innerHTML = conf.code;
                d.head.appendChild(script);
                return this;
            },

            // get script by ajax
            fetch: function (name) {
                var xhr = new XMLHttpRequest(),
                    conf = this.store[name],
                    self = this;
                xhr.open('get', conf.url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {
                        conf.code = xhr.responseText;
                        self.set(self.jsPrefix + name, xhr.responseText);
                        conf.cb();
                    }
                };
                xhr.send();
            },

            // clean old version file
            clean: function () {
                if (this.reload) {
                    for (var item in ls) {
                        item.indexOf(this.prefix) === 0 && ls.removeItem(item);
                    }
                }
                return this;
            },

            // load file
            load: function (conf) {
                var name = conf.name;
                this.store[name] = conf;
                if (this.reload) {
                    this.fetch(name);
                } else {
                    conf.code = this.get(this.jsPrefix + name);
                    if (conf.code) {
                        conf.cb();
                    } else {
                        this.fetch(name)
                    }
                }
                return this;
            },

            // check store contains target code
            has: function (name) {
                return this.store[name] && this.store[name].code;
            }
        };

    w.proom = proom;
})(window, document);
