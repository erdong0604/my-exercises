## this
`this`是我们在书写代码时最常用的关键词之一，即使如此，它也是`JavaScript`最容易被最头疼的关键词。那么`this`到底是什么呢？

如果你了解执行上下文，那么你就会知道，其实this是执行上下文对象的一个属性：

```
executionContext = {
	scopeChain:[ ... ],
	VO:{
		...
	},
	this:  ? 
}

```

执行上下文中有三个重要的属性，作用域链(scopeChain)、变量对象(VO)和this。

**this是在进入执行上下文时确定的，也就是在函数执行时才确定，并且在运行期间不允许修改并且是永久不变的**

### 在全局代码中的this

在全局代码中this 是不变的，this始终是全局对象本身。

```
var a = 10; 
this.b = 20;
window.c = 30;

console.log(this.a);
console.log(b);
console.log(this.c);

console.log(this === window) // true
// 由于this就是全局对象window，所以上述 a ,b ,c 都相当于在全局对象上添加相应的属性

```
如果我们在代码运行期尝试修改this的值，就会抛出错误：

```
this = { a : 1 } ; // Uncaught SyntaxError: Invalid left-hand side in assignment
console.log(this === window) // true
```

### 函数代码中的this

在函数代码中使用this，才是令我们最容易困惑的，这里我们主要是对函数代码中的this进行分析。

我们在上面说过this的值是，进入当前执行上下文时确定的，也就是在函数执行时并且是执行前确定的。但是同一个函数，作用域中的this指向可能完全不同，但是不管怎样，函数在运行时的this的指向是不变的，而且不能被赋值。

```
function foo() {
    console.log(this);
}

foo();  // window
var obj={
    a: 1,
    bar: foo,
}
obj.bar(); // obj
```

函数中this的指向丰富的多，它可以是全局对象、当前对象、或者是任意对象，当然这取决于函数的调用方式。在`JavaScript`中函数的调用方式有一下几种方式：作为函数调用、作为对象属性调用、作为构造函数调用、使用apply或call调用。下面我们将按照这几种调用方式一一讨论this的含义。

#### 作为函数调用

什么是作为函数调用：就是独立的函数调用，不加任何修饰符。

```
function foo(){
	console.log(this === window); // true
	this.a = 1;
	console.log(b); // 2
}
var b = 2;
foo();
console.log(a); // 1
```

上述代码中this绑定到了全局对象window。`this.a`相当于在全局对象上添加一个属性 a 。

在严格模式下，独立函数调用，`this`的绑定不再是`window`，而是`undefined`。

```
function foo() {
    "use strict";
    console.log(this===window); // false
    console.log(this===undefined); // true
}
foo();
```

这里要注意，如果函数调用在严格模式下，而内部代码执行在非严格模式下，this 还是会默认绑定为 window。


```
function foo() {
    console.log(this===window); // true
}


(function() {
    "use strict";
    foo();
})()
```

对于在函数内部的函数独立调用 this 又指向了谁呢？

```
function foo() {
    function bar() {
        this.a=1;
        console.log(this===window); // true
    }
    bar()
}
foo();
console.log(a); // 1

```
上述代码中，在函数内部的函数独立调用，此时this还是被绑定到了window。

总结：当函数作为独立函数被调用时，内部this被默认绑定为(指向)全局对象window，但是在严格模式下会有区别，在严格模式下this被绑定为undefined。

### 作为对象属性调用

```
var a=1;
var obj={
    a: 2,
    foo: function() {
        console.log(this===obj); // true
        console.log(this.a); // 2
    }
}
obj.foo();
```
上述代码中 foo属性的值为一个函数。这里称 foo 为 对象obj 的方法。foo的调用方式为` 对象 . 方法 ` 调用。此时 this 被绑定到当前调用方法的**对象**。在这里为 obj 对象。

再看一个例子：

```
var a=1;
var obj={
    a: 2,
    bar: {
        a: 3,
        foo: function() {
            console.log(this===bar); // true
            console.log(this.a); // 3
        }
    }
}
obj.bar.foo();
```
遵循上面说的规则 ` 对象 . 属性 ` 。这里的对象为 `obj.bar` 。此时 foo 内部this被绑定到了 obj.bar 。 因此 this.a 即为 obj.bar.a 。

再来看一个例子：

```
var a=1;
var obj={
    a: 2,
    foo: function() {
        console.log(this===obj); // false
        console.log(this===window); // true
        console.log(this.a); // 1
    }
}

var baz=obj.foo;
baz();
```
 这里 foo 函数虽然作为对象obj 的方法。但是它被赋值给变量 baz 。当baz调用时，相当于 foo 函数独立调用，因此内部 this被绑定到 window。
 
### 使用apply或call调用

apply和call为函数原型上的方法。它可以更改函数内部this的指向。

```
var a=1;
function foo() {
    console.log(this.a);
}
var obj1={
    a: 2
}
var obj2={
    a: 3
}
var obj3={
    a: 4
}
var bar=foo.bind(obj1);
bar();// 2  this => obj1
foo(); // 1  this => window
foo.call(obj2); // 3  this => obj2
foo.call(obj3); // 4  this => obj3
```

当函数foo 作为独立函数调用时，this被绑定到了全局对象window，当使用bind、call或者apply方法调用时，this 被分别绑定到了不同的对象。


### 作为构造函数调用

```
var a=1;
function Person() {
    this.a=2;  // this => p;
}
var p=new Person();
console.log(p.a); // 2
```

上述代码中，构造函数 Person 内部的 this 被绑定为 Person的一个实例。

总结：

当我们要判断当前函数内部的this绑定，可以依照下面的原则：

* 函数是否在是通过 new 操作符调用？如果是，this 绑定为新创建的对象

```
var bar = new foo();	 // this => bar;

```
* 函数是否通过call或者apply调用？如果是，this 绑定为指定的对象

```
foo.call(obj1);  // this => obj1;
foo.apply(obj2);  // this => obj2;
```
* 函数是否通过 `对象 . 方法调用`？如果是，this 绑定为当前对象

```
obj.foo(); // this => obj;
```
* 函数是否独立调用？如果是，this 绑定为全局对象。

```
foo(); // this => window
```

### DOM事件处理函数中的this

**1). 事件绑定**

```
<button id="btn">点击我</button>

// 事件绑定

function handleClick(e) {
    console.log(this); // <button id="btn">点击我</button>
}
        document.getElementById('btn').addEventListener('click',handleClick,false);  //   <button id="btn">点击我</button>
        
document.getElementById('btn').onclick= handleClick; //  <button id="btn">点击我</button>
```

根据上述代码我们可以得出：当通过事件绑定来给DOM元素添加事件，事件将被绑定为当前DOM对象。

**2).内联事件**

```
<button onclick="handleClick()" id="btn1">点击我</button>
<button onclick="console.log(this)" id="btn2">点击我</button>

function handleClick(e) {
    console.log(this); // window
}

//第二个 button 打印的是   <button id="btn">点击我</button>

```

我认为内联事件可以这样理解：

```
//伪代码

<button onclick=function(){  handleClick() } id="btn1">点击我</button>
<button onclick=function() { console.log(this) } id="btn2">点击我</button>

```
这样我们就能理解上述代码中为什么内联事件一个指向window，一个指向当前DOM元素。（当然浏览器处理内联事件时并不是这样的）

### 定时器中的this

定时器中的 this 指向哪里呢？

```
function foo() {
    setTimeout(function() {
        console.log(this); // window
    },1000)
}
foo();  

```
再来看一个例子

```
var name="chen";
var obj={
    name: "erdong",
    foo: function() {
        console.log(this.name); // erdong
        setTimeout(function() {
            console.log(this.name); // chen
        },1000)
    }
}
obj.foo();
``` 

到这里我们可以看到，函数 foo 内部this指向为调用它的对象，即：obj 。定时器中的this指向为 window。那么有什么办法让定时器中的this跟包裹它的函数绑定为同一个对象呢？

1). 利用闭包：

```
var name="chen";
var obj={
    name: "erdong",
    foo: function() {
        console.log(this.name)
        var that=this;
        setTimeout(function() {
            console.log(that.name); // window
        },1000)
    }
}
obj.foo();
```
利用闭包的特性，函数内部的函数可以访问含义访问当前词法作用域中的变量，此时定时器中的 that 即为包裹它的函数中的 this 绑定的对象。在下面我们会介绍利用 `ES6`的箭头函数实现这一功能。

当然这里也可以适用bind来实现：

```
var name="chen";
var obj={
    name: "erdong",
    foo: function() {
        console.log(this.name);
        setTimeout(function() {
            console.log(this.name); // window
        }.bind(this),1000)
    }
}
obj.foo();

```
 

## 被忽略的this
如果你把 null 或者 undefined 作为 this 的绑定对象传入 call 、apply或者bind，这些值在调用时会被忽略，实例 this 被绑定为对应上述规则。

```
var a=1;
function foo() {
    console.log(this.a); // 1  this => window
}
var obj={
    a: 2
}
foo.call(null);
```
```
var a=1;
function foo() {
    console.log(this.a); // 1  this => window
}
var obj={
    a: 2
}
foo.apply(null);
```
```
var a=1;
function foo() {
    console.log(this.a); // 1  this => window
}
var obj={
    a: 2
}
var bar = foo.bind(null);
bar();
```

bind 也可以实现函数柯里化：

```
function foo(a,b) {
    console.log(a,b); // 2  3
}
var bar=foo.bind(null,2);
bar(3);
```

更复杂的例子：

```
 var foo={
    bar: function() {
        console.log(this);
    }
};

foo.bar(); // foo
(foo.bar)(); // foo

(foo.bar=foo.bar)(); // window
(false||foo.bar)();  // window
(foo.bar,foo.bar)();  // window
```

上述代码中：

`foo.bar()`为对象的方法调用，因此 this 绑定为 foo 对象。

`(foo.bar)()` 前一个() 中的内容不计算，因此还是 `foo.bar()` 

`(foo.bar=foo.bar)()` 前一个 () 中的内容计算后为 ` function() { console.log(this); }` 所以这里为匿名函数自执行，因此 this 绑定为 全局对象 window

后面两个实例同上。

这样理解会比较好：

```
(foo.bar=foo.bar)  括号中的表达式执行为 先计算，再赋值，再返回值。
(false||foo.bar)()    括号中的表达式执行为 判断前者是否为 true ，若为true，不计算后者，若为false，计算后者并返回后者的值。
(foo.bar,foo.bar)   括号中的表达式之行为分别计算 “，” 操作符两边，然后返回  “，” 操作符后面的值。

```

## 箭头函数中的this

箭头函数时`ES6`新增的语法。

有两个作用：

1. 更简洁的函数
2. 本身不绑定this
 
代码格式为：

```
// 普通函数
function foo(a){
	// ......
}
//箭头函数
var foo = a => {
	// ......
}

//如果没有参数或者参数为多个

var foo = (a,b,c,d) => {
	// ......
}
``` 

我们在使用普通函数之前对于函数的this绑定，需要根据这个函数如何被调用来确定其内部this的绑定对象。而且常常因为调用链的数量或者是找不到其真正的调用者对 this 的指向模糊不清。在箭头函数出现后其内部的 this 指向不需要再依靠调用的方式来确定。

箭头函数有几个特点(与普通函数的区别)



1.  箭头函数不绑定 this 。它只会从作用域链的上一层继承 this。
2. 箭头函数不绑定arguments，使用reset参数来获取实参的数量。
3. 箭头函数是匿名函数，不能作为构造函数。
4. 箭头函数没有prototype属性。
5. 不能使用 yield 关键字，因此箭头函数不能作为函数生成器。

这里我们只讨论箭头函数中的this绑定。

用一个例子来对比普通函数与箭头函数中的this绑定：

```
var obj={
    foo: function() {
        console.log(this); // obj
    },
    bar: () => {
        console.log(this); // window
    }
}
obj.foo();
obj.bar();

```
上述代码中，同样是通过`对象 . 方法`调用一个函数，但是函数内部this绑定确是不同，只因一个数普通函数一个是箭头函数。

用一句话来总结箭头函数中的this绑定：

个人上面说的它会从作用域链的上一层继承 this ，说法并不是很正确。作用域中存放的是这个函数当前执行上下文与所有父级执行上下文的变量对象的集合。因此在作用域链中并不存在 this 。应该说是作用域链上一层对应的执行上下文中继承 this 。

**箭头函数中的this继承于作用域链上一层对应的执行上下文中的this**

```
var obj={
    foo: function() {
        console.log(this); // obj
    },
    bar: () => {
        console.log(this); // window
    }
}
obj.bar();
```
 
 上述代码中obj.bar执行时的作用域链为：
 
 ```
 scopeChain = [
 	obj.bar.AO,
 	global.VO
 ]
 ```
根据上面的规则，此时bar函数中的this指向为全局执行上下文中的this，即：window。

再来看一个例子：

```
var obj={
    foo: function() {
        console.log(this); // obj
        var bar=() => {
            console.log(this); // obj
        }
        bar();
    }
}
obj.foo();
```

在普通函数中，bar 执行时内部this被绑定为全局对象，因为它是作为独立函数调用。但是在箭头函数中呢，它却绑定为 obj 。跟父级函数中的 this 绑定为同一对象。

此时它的作用域链为：

```
 scopeChain = [
 	bar.AO,
 	obj.foo.AO,
 	global.VO
 ]
```

这个时候我们就差不多知道了箭头函数中的this绑定。

继续看例子：

```
var obj={
    foo: () => {
        console.log(this); // window
        var bar=() => {
            console.log(this); // window
        }
        bar();
    }
}
obj.foo();

```

这个时候怎么又指向了window了呢？

我们还看当 bar 执行时的作用域链：

```
 scopeChain = [
 	bar.AO,
 	obj.foo.AO,
 	global.VO
 ]
```

当我们找bar函数中的this绑定时，就会去找foo函数中的this绑定。因为它是继承于它的。这时 foo 函数也是箭头函数，此时foo中的this绑定为window而不是调用它的obj对象。因此 bar函数中的this绑定也为全局对象window。

我们在回头看上面关于定时器中的this的例子：

```
var name="chen";
var obj={
    name: "erdong",
    foo: function() {
        console.log(this.name); // erdong
        setTimeout(function() {
            console.log(this); // chen
        },1000)
    }
}
obj.foo();
```
这时我们就可以很简单的让定时器中的this与foo中的this绑定为同一对象:

```
var name="chen";
var obj={
    name: "erdong",
    foo: function() {
        console.log(this.name); // erdong
        setTimeout(() =>  {
            console.log(this.name); // chen
        },1000)
    }
}
obj.foo();
```




