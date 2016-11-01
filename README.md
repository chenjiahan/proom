# proom
A tiny library to cache script with localStorage

### Usage
```HTML
<script>!function(t,e){var i=t.localStorage,s={init:function(t){return this.prefix=t.prefix||"proom_",this.jsPrefix="js_",this.reload=t.version!==this.get("version")||-1!==location.href.indexOf("cleanroom"),this.store={},this.clean().set("version",t.version),this},set:function(t,e){if(i)try{i.setItem(this.prefix+t,e)}catch(s){22===s.code&&i.clear()}},get:function(t){return i?i.getItem(this.prefix+t):""},inject:function(t){var i=this.store[t],s=e.createElement("script");return s.innerHTML=i.code,e.head.appendChild(s),this},fetch:function(t){var e=new XMLHttpRequest,i=this.store[t],s=this;e.open("get",i.url),e.onreadystatechange=function(){4==e.readyState&&(e.status>=200&&e.status<300||304==e.status)&&(i.code=e.responseText,s.set(s.jsPrefix+t,e.responseText),i.cb())},e.send()},clean:function(){if(this.reload)for(var t in i)0===t.indexOf(this.prefix)&&i.removeItem(t);return this},load:function(t){var e=t.name;return this.store[e]=t,this.reload?this.fetch(e):(t.code=this.get(this.jsPrefix+e),t.code?t.cb():this.fetch(e)),this},has:function(t){return this.store[t]&&this.store[t].code}};t.proom=s}(window,document);</script>
```

### Demo
```javascript
// config
proom.init({
    version: '1.0.0',
    prefix: 'test_'
});

// load script
proom.load({
    name: 'bundle',
    url: './dist/bundle.js',
    cb: function() {
        proom.inject('index');
    }
});
```
