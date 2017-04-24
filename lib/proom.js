;
(function () {
    var ls = window.localStorage;
    var toArray = function (item) { return Array.isArray(item) ? item : [item]; };
    var self = {
        init: function (conf) {
            this.prefix = conf.prefix || '';
            this.reload = conf.version !== this.get('version') || location.href.indexOf('cleanroom') !== -1;
            this.store = {};
            this.clean().set('version', conf.version);
            return this;
        },
        set: function (key, value) {
            if (ls) {
                try {
                    ls.setItem(this.prefix + key, value);
                }
                catch (e) {
                    e.code === 22 && ls.clear();
                }
            }
        },
        get: function (key) {
            return ls ? ls.getItem(this.prefix + key) : void 0;
        },
        remove: function (key) {
            ls && ls.removeItem(this.prefix + key);
        },
        inject: function (arr) {
            var _this = this;
            return toArray(arr).map(function (key) {
                var tag = document.createElement(_this.store[key].type === 'css' ? 'style' : 'script');
                tag.innerHTML = _this.store[key].code;
                document.head.appendChild(tag);
            }), this;
        },
        fetch: function (key) {
            var _this = this;
            var xhr = new XMLHttpRequest();
            var conf = this.store[key];
            xhr.open('get', conf.url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)) {
                    conf.code = xhr.responseText;
                    _this.set(conf.type + '_' + key, conf.code);
                    conf.onLoad(key);
                }
            };
            xhr.send();
        },
        clean: function () {
            if (this.reload) {
                for (var item in ls) {
                    !item.indexOf(this.prefix) && ls.removeItem(item);
                }
            }
            return this;
        },
        load: function (obj) {
            var _this = this;
            Object.keys(obj).forEach(function (key) {
                var conf = obj[key];
                conf.type = conf.url.split('.').pop();
                conf.onLoad = conf.onLoad || _this.inject;
                _this.store[key] = conf;
                if (_this.reload) {
                    _this.fetch(key);
                }
                else {
                    conf.code = _this.get(conf.type + '_' + key);
                    conf.code ? conf.onLoad(key) : _this.fetch(key);
                }
            });
            return this;
        },
        has: function (arr) {
            var _this = this;
            return toArray(arr).every(function (key) {
                return !!(_this.store[key] && _this.store[key].code);
            });
        }
    };
    window['proom'] = self;
})();
