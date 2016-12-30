# proom
A tiny library to cache script with localStorage

### Usage
```HTML
<script src="proom.js"></script>
```

### Demo
``` typescript
// single file
proom.init({
    prefix: 'project_',
    version: '1.0.0'
}).load({
    index: {
        url: './index.js'
    }
})

// multi files
// load vendor before index
proom.init({
    prefix: 'project_',
    version: '1.0.1'
}).load({
    vendor: {
        url: './vendor.js',
        onLoad: onLoad
    },
    index: {
        url: './index.js',
        onLoad: onLoad
    }
})

var onLoad = function () {
    var files = ['vendor', 'index'];
    proom.has(files) && proom.inject(files);
}
```