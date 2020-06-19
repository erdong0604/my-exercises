## 前言


## 数据类型

`JavaScript`中只有两种数据类型，一种是基本类型，一种是引用类型。而引用类型就是我们今天的主角。

* 基本数据类型：`Number、String、Boolean、Null、 Undefined、Symbol、BigInt`。
* 引用数据类型：`Object、Array、Function、Date、RegExp、Error`等(除基本类型外的数据,都是引用类型)。


当我们声明一些变量时，它在内存中的储存大致如下。

``` javascript
let a = 'str';
let b = {
    c:1,
}
let d = [1,2,3,4];
```
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfxefqb0ejj30io0aiweg.jpg)

通过图示可以看到，当变量的值为基本类型时,储存在栈内存中，值为当前的常量。当变量的值为引用类型时，也是储存在栈内存中，不同的是值不是一个常量，而是一个堆内存中的地址。当我们访问变量`a`时，可以直接得到`str`。当访问变量`b`时，通过`堆内存中的地址1`找到堆内存中的对象`{ c:1 }`，返回给我们。

当我们执行赋值操作时:

``` javascript
let e = a;
e = 'erdong'

console.log(a); // str
console.log(e); // erdong

let f = b;
f.c = 2;

console.log(f.c); // 2
console.log(f.c); // 2

```
通过示例可以看到,当修改变量`g`时，会影响到变量`c`。

我们再来看看此时内存的变化。





通过图示表示当前内存中的大致变化:

当我们将一个值为基本类型的变量赋值给另一个变量时**其实是将值复制了一份给这个变量**。

当我们将一个值为引用类型的变量赋值给另一个变量时**其实是将其储存的堆内存中的地址复制了一份给这个变量**。




## 简单的深拷贝

很多人把下面所讲的拷贝方法称之为浅拷贝。我认为这种说法不是很恰当，在这里我称它为简单的深拷贝。

话不多说，直接进入主题。

### 循环赋值

循环赋值进行拷贝，其实就是循环源数据，把源数据上的元素的值依次赋值一份到指定变量上。

``` javascript
function shallowDeepCopy(obj){
    let _obj = {};
    // 循环源数组
    for(let key in obj){
    	 // 由于for...in... 会查找原型链，所以使用hasOwnProperty筛选，只拷贝自身的元素
        if(obj.hasOwnProperty(key)){
            _obj[key] = obj[key];
        }
    }
    return _obj;
}
```

通过示例验证`shallowDeepCopy`。

``` javascript
let obj = {
    a:1,
    b:'str',
    c:[1,2,3],
    d:{
        e:1
    }
}


let obj1 = obj;
let obj2 = obj;

// 修改值为基本类型元素时
obj1.a = 2;
console.log(obj.a); // 2

obj2.a = 3;
console.log(obj.a); // 2

// 修改值为引用类型元素时
obj.c.push(4);
console.log(obj.c); // [1,2,3,4]

obj2.c.push(4);
console.log(obj.c); // [1,2,3,4,4]

```

通过上述示例可以看到，通过直接赋值得到的变量`obj1`，当修改`obj1`时，即使修改的是值为基本类型的元素，也会影响到源数据。这是因为，直接赋值时，是将变量`obj`储存的`堆内存中的地址`复制一份赋值给`obj`。当修改`obj1`时，通过`堆内存中的地址`，实际上修改的是堆内存中对应地址的对象。由于此时`obj`和`obj1`储存的`堆内存中的地址`一致，所以指向同一个对象。当对象修改了，再访问它时，自然是修改后的。而`obj2`是通过`shallowDeepCopy`拷贝的`obj`。此时`obj2`储存的`堆内存中的地址`跟`obj`储存的`堆内存中的地址`并不是同一个。因此指向不同的对象。

那为什么修改`obj2.c`也会影响到`obj`呢？

那是因为`obj.c`也是一个引用类型，将`obj.c`赋值给`obj2.c`时，其实也是复制了一份`堆内存中的地址`赋值给`obj2.c`。所以修改`obj2.c`时，实际上修改的是`obj.c`和`obj2.c`共同指向的对象。

结论：当使用`shallowDeepCopy`拷贝一个对象时，如果对象中的元素的值全是基本类型时，达到期望的效果。如果有值为引用类型时，则无效。


### Object.assign()

`Object.assign`方法可用于将所有课内聚属性的值从一个或多个源对象赋值到目标对象，并返回该对象。

当我第一次接触这个方法时，就在想这不就是拷贝吗。其实不然。我们直接看例子：

``` javascript
let obj = {
    a:1,
    b:'str',
    c:[1,2,3],
    d:{
        e:1
    }
}

let obj1 = Object.assign({},obj);

//修改值为基本类型的元素
obj1.a = 2;
console.log(obj.a); // 1

//修改值为引用类型的元素
obj.c.push(4); 
console.log(obj.c); // [1,2,3,4]
```

`waht?` 这不是跟上面封装的`shallowDeepCopy`一样吗？没错，`Object.assign`方法，在拷贝值全为基本类型时，也可以达到深拷贝的目的。

`Object.assign`在工作中常用来合并一个或多个对象。后面的对象会覆盖前面对象中相同`key`的值。

举个🌰，简单的介绍一下`Object.assign`

``` javascript
let target = {
    a:1,
    b:[1,2,3],
    c:{
        d:1
    }
}

let target2 = {
    a:1,
    b:[4,5,6],
    e:'str'
}

let target3 = Object.assign({},target,target2);

console.log(target3);

// {
//     a: 1
//     b:  [4, 5, 6]
//     c: {d: 1}
//     e: "str"
// }

```


### Array.prototype.slice(begin,end)

`Array.prototype.slice`方法，将返回指定数组的`begin`位置的元素到`end`位置的元素组成的数组。

下面直接看示例：

``` javascript
let arr = [
    1,
    [1,2,3]
]

let arr1 = arr.slice();

arr1[0] = 2;
console.log(arr[0]); // 1

arr[1].push(4);
console.log(arr[1]); // [1,2,3,4]

```

通过上述示例，可以看到`slice`方法还是只能拷贝数组中不是值是基本类型的元素。遇到引用类型的元素不行了。



### Array.prototype.concat()

`Array.prototype.concat`方法用于合并两个或多个数组。

``` javascript
let arr = [
    1,
    [1,2,3]
]

let arr1 = [].concat(arr);

arr1[0] = 2;
console.log(arr[0]); // 1

arr[1].push(4);
console.log(arr[1]); // [1,2,3,4]

```

可以看到`concat`方法也是只能拷贝基本类型的元素。


### (...)展开运算符

展开运算符，可以将可迭代对象转为用逗号分隔的参数序列。

``` javascript
let obj = {
    a:1,
    b:'str',
    c:[1,2,3],
    d:{
        e:1
    }
}

let obj1 = {...obj};

//修改值为基本类型的元素
obj1.a = 2;
console.log(obj.a); // 1

//修改值为引用类型的元素
obj1.c.push(4);
console.log(obj.c); // [1,2,3,4]

```

展开运算符如上述的几种方法类似，也是只能拷贝值为基本类型的元素。


### 总结

上述的几种方法，都可以实现数组的拷贝，但是都是只能拷贝对象中值为基本类型的元素。对于引用类型的元素，修改后还是会影响到源对象。

##	复杂的深拷贝

### JSON.parse(JSON.stringify(obj))

`JSON.parse`方法和`JSON.stringify`方法的组合是我们日常工作中常用的深拷贝的方式。

对于这种个方法的使用，这里不做过多介绍，直接看示例：

``` javascript
let obj = {
    a:1,
    b:'str',
    c:[1,2,3],
    d:{
        e:1
    }
}

let obj1 = JSON.parse(JSON.stringify(obj));

//修改值为基本类型的元素
obj1.a = 2;
console.log(obj.a); // 1

//修改值为引用类型的元素
obj1.c.push(4);
console.log(obj.c); // [1,2,3]

obj1.d.e = '111';
console.log(obj.d.e); // 1

```

看似这种组合的方式是可以满足我们的需求。它首先用`JSON.stringify(obj)`将`obj`对象转成一个JSON字符串`"{"a":1,"b":"str","c":[1,2,3],"d":{"e":1}}"`。再用`JSON.parse("{"a":1,"b":"str","c":[1,2,3],"d":{"e":1}}")`将这个字符串再转成对象赋值给`obj1`。此时`obj1`储存的是新对象的引用地址。跟`obj`无关。

但是这种组合的方式还是有一定的局限性，这里尽可能的设置一些我们日常中常用类型的值来测试一下。

``` javascript
let obj = {
    a:1, 
    b:'2',
    c:function fn(){},
    d:[1,2,3],
    e:undefined,
    f:NaN,
    g:null,
    h:{
        a:1,
        b:2
    },
    i:Symbol(),
    j:new Date(),
    k:Infinity,
    l:/\w+/,
    [Symbol()]:'333'
}

let obj1 = JSON.parse(JSON.stringify(obj));

console.log(obj);
console.log(obj1);
```

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfxl309zrqj30ea04uglk.jpg)

通过上图示可以很清楚的看到，通过`JSON.parse(JSON.stringify(obj))`拷贝后的对象跟源对象区别还是很大的。

* 值为`Function`类型的元素消失了。
* 值为`undefined`的元素消失了。
* `NaN`变成了`null`。
* 值为`Symbol`类型的元素也消失了。
* 值为`Date`类型的元素变成了字符串。
* 值为`Infinity`被变成了`null`。
* 值为`RegExp`类型的元素变成了`{}`。
* 属性值为`Symbol`的元素也消失了


如果数据中不存在这类值，是可以使用`JSON.parse(JSON.stringify(obj))`来实现深拷贝的。

### 实现深拷贝

这就是今天的主角，上述的所有例子就是为了凸显它的重要性。

实现思路：

利用浅拷贝+递归，深度拷贝对象中所有引用类型的元素。包括元素中引用类型的元素。

简单实现：

``` javascript

/**
* @param {object} source 要拷贝的对象
*/

function deepCopy(source){
    let result = {};
    for(let key in source){
        let value = source[key];
        if(source.hasOwnProperty(key)){
            if(typeof value === 'object'){
                // 如果元素的值为引用类型时，继续深拷贝
                result[key] = deepCopy(value);
            }else{
                // 如果元素的值为基本类型，返回当前值。
                result[key] = value;
            }
        }
    }
    return result;
}

```

测试一下：

``` javascript
let obj = {
    a:1,
    b:{
        c:1
    },
}

let obj1 = deepCopy(obj);

obj1.a = 2;
console.log(obj.a); // 1

obj1.b.c = 2;
console.log(obj.b.c); // 1
```

上述`deepCopy`只实现了元素为`Object`引用类型时的拷贝。
但是还是有很多问题，下面一步一步的解决这些问题。



当元素的值为引用类型时，我们需要继续递归拷贝，仅仅`typeof value === 'object'`是不行的，因为`typeof null`也是`'object'`，而`typeof Function`是`function`。并且当要拷贝的值为数组时`let result = {}`肯定是不行的。

改造`deepCopy`

``` javascript

function deepCopy(source){

    //  检测需要拷贝的数据，根据需要拷贝的数据类型来声明一个相同的数据类型来储存拷贝后的值
    let result = Array.isArray(source)?[]:{};
    for(let key in source){
        let value = source[key];
        if(source.hasOwnProperty(key)){
            if(isObject(value)){
                // 如果元素的值为引用类型时，继续深拷贝
                result[key] = deepCopy(value);
            }else{
                // 如果元素的值为基本类型，返回当前值。
                result[key] = value;
            }
        }
    }
    return result;
}

// 检测数据是否是引用类型。
function isObject(value){
    return value&&(typeof value === "object"||typeof value === "function");
}

```


这次比第一版更加完善了，用我们的终极数据来测试。

``` javascript
let obj = {
    a:1, 
    b:'2',
    c:function fn(){},
    d:[1,2,3],
    e:undefined,
    f:NaN,
    g:null,
    h:{
        a:1,
        b:2
    },
    i:Symbol(),
    j:new Date(),
    k:Infinity,
    l:/\w+/,
    [Symbol()]:'333'
}

let obj1 = deepCopy(obj);

console.log(obj);
console.log(obj1);

```

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfxmnenwc8j30ck05mmx4.jpg)

通过图示的输出结果可以看到:

* `Function`类型的值变成了`{}`
* `Date`类型的值变成了`{}`
* `RegExp`类型的值也变成了`{}`
* 属性值为`Symbol`类型的元素消失了

为什么这几种不是`Array`和`Object`引用类型的值变成了`{}`呢？

原因很简单:

``` javascript
let result = Array.isArray(source)?[]:{};
```

1. 通过这一行代码判断，如果不是`Array`类型的数据，都默认为`Object`类型。这是不行的。
2. `Function`或者`Date`等不可迭代的引用类型是不能使用for...in...遍历的。


怎么样拷贝`Function`、`Date`这种引用类型呢？

思路：

``` javascript
let date = new Date();

let date1 = new Date(date);

```

利用相同的构造函数重新构造出一个相同值的数据。

继续改造：

``` javascript
function deepCopy(source){

    //  检测需要拷贝的数据，根据需要拷贝的数据类型来声明一个相同的数据类型来储存拷贝后的值
    let result = Array.isArray(source)?[]:{};

    for(let key in source){
        let value = source[key];
        if(source.hasOwnProperty(key)){
            if(isObject(value)){
                // 如果元素的值为引用类型时，继续深拷贝
                if(isNeedNew(value)){
                    // 如果数据为引用类型，并且不是可遍历的数据。
                    result[key] = dataByNew(value);
                }else{
                    // 如果数据为引用类型，并且是可遍历的数据。
                    result[key] = deepCopy(value);
                }
                
            }else{
                // 如果元素的值为基本类型，返回当前值。
                result[key] = value;
            }
        }
    }
    return result;
}

function isObject(value){
    return value&&(typeof value === "object"||typeof value === "function");
}

// 是否需要通过new 重新构造数据
function isNeedNew(value){
    let type = Object.prototype.toString.call(value);
    switch(type){
        case '[object Date]':
        case '[object RegExp]':
        case '[object Error]':
        case '[object Number]':
        case '[object Boolean]':
        case '[object String]':
        case '[object Function]':
        return true;
        default :
        return false;
    }
}


// 通过new 构造出来的数据
function dataByNew(value){
    console.log(value);
    // 获取当前引用类型值对应的构造函数
    let Constructor = value.constructor;

    // 通过构造函数重新构造出值相似的数据
    return new Constructor(value);
}
```

测试：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfxokr41hyj30hl05f0sr.jpg)

这里还有两个问题：

1) `Function`类型的数据通过`new Function()`并不能得到我们期望的数据。

``` javascript
function fn(){
}

let fn2 = new Function(fn);
console.log(fn2);

最终输出如下:

ƒ anonymous( ) {
	function fn(){
    }
}

```

由于`new Function()`并未使用过，查阅资料得知:

``` javascript
new Function ([arg1[, arg2[, ...argN]],] functionBody);
```

第一个参数为数组时，当做函数的参数，第二个参数为函数体。

只有一个参数时，默认为函数体。

这里怎样处理呢？ 

参考[ConardLi](https://github.com/ConardLi/ConardLi.github.io/blob/master/demo/deepClone/src/clone_6.js)大大的函数克隆：

``` javascript
function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

```

修改`dataByNew `方法。

``` javascript
// 通过new 构造出来的数据
function dataByNew(value){
    console.log(value);
    // 获取当前引用类型值对应的构造函数
    let Constructor = value.constructor;

    // 通过构造函数重新构造出值相似的数据
    if(Object.prototype.toString.call(value) === '[object Function]'){
    	  // 当类型为 `Function `时，使用cloneFunction
        return cloneFunction(value);
    }
    return new Constructor(value);
}

```

2)属性值为`Symbol`时。

这里又涉及到一个知识点：获取对象的`Symbol`类型值的属性。

`Object.getOwnPropertySymbols()`：获取对象上所有的`Symbol`类型值的属性，组成数组。

`Object.getOwnPropertyNames()`：获取对象上所有的属性(包括不可枚举的，但不包括Symbol类型的属性)。

`Reflect.ownKeys()`：获取对象上的所有属性值，组成数组。包括不可枚举的属性，`Symbol`类型的属性。

因此我们使用`Reflect.ownKeys()`获取到对象上的所有属性。

继续改造：

``` javascript
function deepCopy(source){
    if(!isObject(source)){
        return source;
    }
    //  检测需要拷贝的数据，根据需要拷贝的数据类型来声明一个相同的数据类型来储存拷贝后的值
    let result = Array.isArray(source)?[]:{}; 
    if(isNeedNew(source)){
        // 如果数据为引用类型，并且不是可遍历的数据。
        return dataByNew(source);
    }
    // 自身所有属性(包括不可枚举的+Symbol类型的属性)
    let keys = Reflect.ownKeys(source);
    
    keys.forEach(key => {
        let value = source[key];
        if(source.hasOwnProperty(key)){
            if(isObject(value)){
                // 如果元素的值为引用类型时，继续深拷贝
                result[key] = deepCopy(value);
            }else{
                // 如果元素的值为基本类型，返回当前值。
                result[key] = value;
            }
        }
    });
    return result;
}
```

继续测试：

``` javascript
let obj = {
    a:1, 
    b:'2',
    c:function fn(){
        console.log(1)
    },
    d:[1,2,3],
    e:undefined,
    f:NaN,
    g:null,
    h:{
        a:1,
        b:2
    },
    i:Symbol(),
    j:new Date(),
    k:Infinity,
    l:/\w+/,
    [Symbol()]:'333'
}

let obj1 = deepCopy(obj);

console.log(obj);
console.log(obj1);

```

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfxqtnt3bfj30ii055jrf.jpg)

现在已经完全拷贝了我们定义的数据。

比较一下引用类型拷贝之后是否相等：

```
Reflect.ownKeys(obj1).forEach(key => {
    console.log(obj[key],obj1[key], obj[key] === obj1[key]);
})

```

最后一个问题：循环引用。

解决思路：

把深拷贝的对象储存起来，当执行deepCopy时先去查找是否拷贝过这个对象，如果拷贝过则，取出即可。

最终版：

```
function deepCopy(source,map = new WeakMap()){
    if(!isObject(source)){
        return source;
    }
    if(map.get(source)){
        return map.get(source);
    }
    map.set(source,source);
    //  检测需要拷贝的数据，根据需要拷贝的数据类型来声明一个相同的数据类型来储存拷贝后的值
    let result = Array.isArray(source)?[]:{}; 
    if(isNeedNew(source)){
        // 如果数据为引用类型，并且不是可遍历的数据。
        return dataByNew(source);
    }
    // 自身所有属性(包括不可枚举的+Symbol类型的属性)
    let keys = Reflect.ownKeys(source);
    
    keys.forEach(key => {
        let value = source[key];
        if(source.hasOwnProperty(key)){
            if(isObject(value)){
                // 如果元素的值为引用类型时，继续深拷贝
                result[key] = deepCopy(value,map);
            }else{
                // 如果元素的值为基本类型，返回当前值。
                result[key] = value;
            }
        }
    });
    return result;
}

function isObject(value){
    return value&&(typeof value === "object"||typeof value === "function");
}

// 是否需要通过new 重新构造数据
function isNeedNew(value){
    let type = Object.prototype.toString.call(value);
    switch(type){
        case '[object Date]':
        case '[object RegExp]':
        case '[object Error]':
        case '[object Number]':
        case '[object Boolean]':
        case '[object String]':
        case '[object Function]':
        return true;
        default :
        return false;
    }
}


// 通过new 构造出来的数据
function dataByNew(value){
    console.log(value);
    // 获取当前引用类型值对应的构造函数
    let Constructor = value.constructor;

    // 通过构造函数重新构造出值相似的数据
    if(Object.prototype.toString.call(value) === '[object Function]'){
        return cloneFunction(value);
    }
    return new Constructor(value);
}

// 克隆函数
function cloneFunction(func) {
    const funcString = func.toString();
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return  new Function();
        }
    } else {
        return eval(funcString);
    }
}

```

其实日常工作中不会这么写一个深拷贝。以上几种克隆方式足以满足业务场景。主要是实现一个深拷贝设计的知识点很多。
