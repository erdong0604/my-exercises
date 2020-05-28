## Object.create 

#### 定义

> 创建一个新对象，使用现有的对象来提供新创建对象的`__proto__`

#### 使用方式

```
var obj={
    name: 'erdong',
    age: "27"
}

var o = Object.create(obj);
console.log(o.name);// erdong
console.log(o.age);// 27
console.log(o.__proto__ === obj); // true

// getPrototypeOf 获取指定对象的__proto__属性指向的对象
console.log(Object.getPrototypeOf(o) === obj); // true
// 判断前者是否在后者的原型链上
console.log(obj.isPrototypeOf(o));// true

```
Object.create的实现也是基于原型链。好像什么都离不开原型链。。。 这里再复习一下：

每个对象默认都会有一个隐式的(不建议外部使用的)属性[[prototype]]，在Chrome等浏览器实现里，称它为`__proto__`，它默认指向构造当前对象的构造函数的`prototype `属性(这里为什么不说它是构造函数的原型对象呢，因为在很多书籍里对prototype描述都不一样，有的说是构造函数的原型对象，有的说是实例的原型对象，我就一直称它为构造函数的prototype属性)，当对象访问一个属性时首先会在自身去查找，如果自身上没有该属性，就通过`__proto__`向上查找，默认上一层是构造当前对象的prototype属性，如果也未找到，就通过`构造函数.prototype.__proto__`向上查找，直到找到最顶层`Object.prototype`，如果始终为找到该属性，返回undefined。这就是一条完整的原型链。

当我们使用`Object.create`创建一个新对象时，相当于把新对象的`__proto__`修改为当前对象。上面我们说过，对象的`__proto__`默认指向的是构造当前对象的构造函数的`ptototype`属性，当我们修改了`__proto__`指向时，原型链也会发生变化：


此时o对象的原型链为：

```javascript
o => o.__proto__ => obj => obj.__proto__ => Object.prototype

```

上述就是使用`Object.create`创建一个对象o的原型链。


#### 创建一个空对象

`Object.create`可以接受null，当第一个参数为null时：

```
var o = Object.create(null);
console.log(o); // { }
```
它创建出来的对象是真正意义上的`空对象`，它默认是没有`__proto__`的，因此它的原型链中只有它自己。也不能访问Object原型上的一些方法，比如`toString()，valueOf()`



#### 设置属性描述符
`Object.create`第二个参数为属性描述符：

```
var obj={
    name: 'erdong',
    age: "27"
}

var o = Object.create(obj,{
    job:{
        enumerable:true, // 属性是否是可枚举的 默认为false
        writable:true, // 是否是可以修改的 默认为false
        configurable:true, // 属性描述符是否可以重新配置&该属性是否可以删除
        value: "前端" // 该属性的值
    }
}); 

console.log(o.job); // 前端
```
来看一些奇怪的事情：

```
var obj={
    name: 'erdong',
    age: "27"
}

var o = Object.create(obj);

o.job = '前端';

console.log(o.job);
```
上述代码当执行`o.job = '前端'`时，实际上给o对象自身添加了一个属性。当访问这个属性时，从自身上就可以获取的到。如果原型链的上层也出现了job属性，这里就会屏蔽原型链上层的属性(也就是访问job属性的时候不会再向上查找了，因为当前对象自身就会有这个job属性)。

但是这里所说的屏蔽比我们想象的要复杂，考虑一下三种情况：

以上述代码为例，当我们执行`o.job = '前端'`时：

1) 当o的原型链上层有job属性(在这里可以认为obj上有job属性)，并且没有标记为只读也就属性描述符中的(writable:true)，那么就会在对象o上添加属性job。这样会屏蔽obj中的job属性。

```
var obj={
    name: 'erdong',
    age: '27',
    job:'前端开发' // 默认writable:true
}

var o = Object.create(obj);

o.job = '前端';

// 达到我们的预期
console.log(o.job); // 前端

```

2) 当o的原型链上层有job属性(在这里可以认为obj上有job属性)，并且标记为只读也就属性描述符中的(writable:false)，那么不会在对象o上添加job属性，也不会修改原型中的的job属性

```
var obj={
    name: 'erdong',
    age: '27',
}
Object.defineProperty(obj,'job',{
    writable:false,
    value:'前端开发'
})

var o = Object.create(obj);

o.job = '前端';

// 这里输出的结果并未达到我们的预期
console.log(o.job); // 前端开发

```

3) 当o的原型链上层有job属性(在这里可以认为obj上有job属性)，并且没有标记为只读也就属性描述符中的(writable:true)，并且它是一个setter。

```
 var obj={
    name: 'erdong',
    age: '27',
}

// 给obj添加属性job，并设置属性描述符set。
Object.defineProperty(obj,'job',{
    set(val){
        console.log(val)
    }
})

var o = Object.create(obj);

o.job = '前端'; // 前端 //这里实际上执行了属性描述符中的set

// 这里输出的结果并未达到我们的预期
console.log(o.job); // undefined  由于我们没有设置get，因此默认为undefined
```
综上，当我们简单给一个对象进行赋值时，其实背后不仅仅是简单的赋值。如果不明白原型链的机制，那么很难排查错误。

那么我们怎样让对象按照我们预期来添加属性呢？也就是不受上述第二种和第三种情况的限制？

只有使用`Object.defineProperty `。


## 实现Object.create

综上我们得出Object.create方法所做的操作：

1. 创建一个新对象
2. 将传入的对象作为新对象的`__proto__`的值


那么我们来实现一个create方法：

```
// 实现一
Object.prototype.myCreate=function(obj) {
    // 创建一个对象
    var o=new Object();
    // 将当前传入的对象作为新对象的__proto__的值
    o.__proto__=obj;
    // 返回这个新对象
    return o;
}
```
由于打多少浏览器不支持`__proto__`，所以我们第一种方式实现一个Object.create方法很不理想。

```
// 实现二
Object.prototype.myCreate = function(obj){
    // 创建一个对象
    var o = new Object();
    // 设置对象的__proto__为obj
    Object.setPrototypeOf(f,obj);
    // 返回这个新对象
    return o;
}
```

`Object.setPrototypeOf`是`ES6`的语法，设置一个对象的`__proto__`到另一个对象(可以为null)。也是大部分浏览器不支持

```
// 实现三
Object.prototype.myCreate = function(obj){
    // 创建一个(构造)函数
    function F(){};
    // 将构造函数的prototype属性设置为obj
    F.prototype = obj;
    // 返回一个构造函数的实例 (因为实例的__proto__指向的是F.prototype，即obj)
    return new F();
}
```
这三种方式都可以设置一个新对象的`__proto__`的指向(关联关系)。但是既然是polyfill，只能考虑第三种方式的实现。
