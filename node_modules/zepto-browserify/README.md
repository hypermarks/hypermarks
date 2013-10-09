
Zepto-browserify
------

This is a fork based on [components/zepto](https://github.com/components/zepto).

```
npm install --save zepto-browserify
```

```js
$ = require('zepto-browserify').$
Zepto = require('zepto-browserify').Zepto
$ === Zepto // true
```

How I made this:

```
git rm *json zepto.min.js Makefile
npm init
subl zepto.js
subl README.md
git diff zepto.js
```

```diff
-
-window.Zepto = Zepto
-'$' in window || (window.$ = Zepto)
-
-
-
+// @@ original loader
+// window.Zepto = Zepto
+// '$' in window || (window.$ = Zepto)
+// @@ modified by jiyinyiyong
+module.exports.$ = Zepto;
+module.exports.Zepto = Zepto;
+// @@ modifications end
```