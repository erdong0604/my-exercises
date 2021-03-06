
## 闭包(Closure)的定义

闭包是一个让初级`JavaScript`使用者既熟悉又陌生的一个概念。因为闭包在我们书写`JavaScript`代码时，随处可见，但是我们又不知道哪里用了闭包。

关于闭包的定义，网上(书上)的解释总是千奇百怪，我们也只能“取其精华去其糟粕”去总结一下。


1. 即使函数在当前作用域外调用，但是还能访问当前作用域中的变量和函数
2. 有权访问另一个函数作用域中的变量(函数)的函数。
3. 闭包是指那些能够访问自由变量的函数


ECMAScript中，闭包指的是：

1. 从理论角度：所有的函数都是闭包。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量也就相当于是在访问自由变量，这个时候使用最外层的作用域。
2. 从实践角度：一下才算是闭包：
	* 即使创建它的上下文已经销毁，它仍然存在。
	* 在代码中引用了自由变量。


闭包跟词法作用域，作用域链，执行上下文这几个`JavaScript`中重要的概念都有关系，因此要想真的理解闭包，至少要对那几个概念不陌生。

闭包的优点：

1. 可以是用函数内部的变量(函数)，也可以说是可以访问函数作用域。
2. 拥有私有变量，避免污染全局变量

闭包的缺点：

1. 私有变量一直存在，占用内存。



我们来一步一步引出闭包。

#### 自执行函数 ( IIFE )

自执行函数也叫立即调用函数(IIFE)，是一个在定义时就执行的函数。

```
var a=1;
(function() {
    console.log(a)
})()
```

上述代码是一个最简单的自执行函数。

在ES6之前，是没有块级作用域的，只有全局作用域和函数作用域，因此自执行函数还能在ES6之前实现块级作用域。

```
// ES6 块级作用域

var a = 1;
if(true) {
    let a=111;
    console.log(a); // 111
}
console.log(a); // 1

```

这里 if{} 中用let声明了一个 a。这个 a 就具有块级作用域，在这个 {} 中访问 a ，永远访问的都是 let 声明的a，跟全局作用域中的a没有关系。如果我们把 let 换成 var ，就会污染全局变量 a 。

如果用自执行函数来实现：

```
var a = 1;
(function() {
    if(true) {
        var a=111;
        console.log(a); // 111
    }
})()
console.log(a); // 1
```

为什么要在这里要引入自执行函数的概念呢？因为通常我们会用自执行函数来创建闭包，实现一定的效果。

来看一个基本上面试提问题：

```
for(var i=0;i<5;i++) {
    setTimeout(function() {
        console.log(i);
    },1000)
}
```

在理想状态下我们期望输出的是 0 ，1 ，2 ，3 ，4。但是实际上输出的是5 ，5 ，5 ，5 ，5。为什么是这样呢？其实这里不仅仅涉及到作用域，作用域链还涉及到Event Loop、微任务、宏任务。但是在这里不讲这些。

下面我们先解释它为什么会输出 5个5，然后再用自执行函数来修改它，以达到我们预期的结果。

提示：for 循环中，每一次的都声明一个同名变量，下一个变量的值为上一次循环执行完同名变量的值。

首先用var声明变量 for 是不会产生块级作用域的，所以在 () 中声明的 i 为全局变量。相当于：

```
// 伪代码
var i;
for(i=0;i<5;i++) {
    setTimeout(function() {
        console.log(i);
    },1000)
}
```

setTimeout中的第一个参数为一个全局的匿名函数。相当于：

```
// 伪代码
var i;
var f = function() {
    console.log(i);
}
for(i=0;i<5;i++) {
    setTimeout(f,1000)
}
```

由于setTimeout是在1秒之后执行的，这个时候for循环已经执行完毕，此时的全局变量 i 已经变成了 5 。1秒后5个setTimeout中的匿名函数会同时执行，也就是5个 f 函数执行。这个时候 f 函数使用的变量 i 根据作用域链的查找规则找到了全局作用域中的 i 。因此会输出 5 个5。

那我们怎样来修改它呢？

* 思路1：让setTimeout匿名函数中访问的变量 i  不再访问全局作用域中的 i 。因此把它包裹在一个函数作用域中。这时 匿名函数访问变量 i 时，会先去包裹它的函数作用域中查找。


```
for(var i=0;i<5;i++) {
    (function (){
	    setTimeout(function() {
	        console.log(i);
	    },1000)
    })();
}
```
上述例子会输出我们期望的值吗？答案是否。为什么呢？我们虽然把 setTimeout 包裹在一个匿名函数中了，但是当setTimeout中匿名函数执行时，首先去匿名函数中查找 i 的值，找不到还是会找到全局作用域中，最终 i 的值仍然是全局变量中的 i ，仍然为 5个5.

那我们把外层的匿名函数中声明一个变量 j 让setTimeout中的匿名函数访问这个 j 不就找不到全局变量中的变量了吗。

```
for(var i=0;i<5;i++) {
    (function (){
    	    var j = i;
	    setTimeout(function() {
	        console.log(j);
	    },1000)
    })();
}
```

这个时候才达到了我们预期的结果：0 1 2 3 4。

我们来优化一下：

```
for(var i=0;i<5;i++) {
    (function (i){
	    setTimeout(function() {
	        console.log(i);
	    },1000)
    })(i);
}
```

*思路2：用 let 声明变量，产生块级作用域。 

```
for(let i=0;i<5;i++) {
    setTimeout(function() {
        console.log(i);
    },1000)
}
```

这时for循环5次，产生 5 个块级作用域，也会声明 5 个具有块级作用域的变量 i ，因此setTimeout中的匿名函数每次执行时，访问的 i 都是当前块级作用域中的变量 i 。

#### 理论中的闭包

什么是理论中的闭包？就是看似像闭包，其实并不是闭包。它只是类似于闭包。

```
 function foo() {
    var a=2;
    function bar() {
        console.log(a); // 2
    }
    bar();
}
foo();
```

上述代码根据最上面我们对闭包的定义，它并不完全是闭包，虽然是一个函数可以访问另一个函数中的变量，但是被嵌套的函数是在当前词法作用域中被调用的。

#### 实践中的闭包

我们怎样把上述代码foo 函数中的bar函数，在它所在的词法作用域外执行呢？

下面的代码就清晰的展示了闭包：

```
function foo() {
    var a=2;
    function bar() {
        console.log(a);
    }
    return bar;
}
var baz=foo();
baz(); // 2 —— 朋友，这就是闭包的效果。
```

上述代码中 bar 被当做 foo函数返回值。foo函数执行后把返回值也就是 bar函数 赋值给了全局变量 baz。当 baz 执行时，实际上也就是 bar 函数的执行。我们知道 foo 函数在执行后，foo 的内部作用域会被销毁，因为引擎有垃圾回收期来释放不再使用的内存空间。所以在bar函数执行时，实际上foo函数内部的作用域已经不存在了，理应来说 bar函数 内部再访问 a 变量时是找不到的。但是闭包的神奇之处就在这里。由于 bar 是在 foo 作用域中被声明的，所以 bar函数 会一直保存着对 foo 作用域的引用。这时就形成了闭包。


我们先看个例子：

```
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```

我们用伪代码来解释`JavaScript`引擎在执行上述代码时的步骤：

1. 当`JavaScript`引擎遇到可执行代码时，就会进入一个执行上下文(环境)
2.  首先遇到的是全局代码，因此进入全局执行上下文，把全局执行上下文压入执行上下文栈。
3.  全局上下文创建时会先在内部创建VO/AO，作用域链，this。然后执行代码。
4. 当遇到 checkscope 函数执行时，进入checkscope的执行上下文，然后压入执行上下文栈。
5. checkscope 执行上下文创建时会先在内部创建VO/AO，作用域链，this。然后执行代码。
6. 当checkscope 函数执行完毕时，会从执行上下文栈中弹出，此时它的AO也会被浏览器回收。(这是理想状态下)
7. 执行foo函数，向上查找foo的值，发现foo的值为checkscope函数内部函数f。因此这一步为执行 checkscope 内部函数f。
8. 执行f函数同执行 checkscope 的步骤一致。
9. f 函数执行完毕，从执行上下文栈中弹出。

但是我们想一个问题，checkscope函数执行完毕，它的执行上下文从栈中弹出，也就是销毁了不存在了，f 函数还能访问包裹函数的作用域中的变量(scope)吗？答案是可以。

理由是在第6步，我们说过当checkscope 执行函数执行完毕时，它的执行上下文会从栈中弹出，此时活动对象也会被回收，按理说当 f 在访问checkscope的活动对象时是访问不到的。

其实这里还有个概念，叫做作用域链：当 checkscope 函数被创建时，会创建对应的作用域链，里面值存放着包裹它的作用域对应执行上下文的变量对象，在这里只是全局执行上下文的变量对象，当checkscope执行时，此时的作用域链变化了 ，里面存放的是变量对象(活动对象)的集合，最顶端是当前函数的执行上下文的活动对象。最低端是全局执行上下文的变量对象。类似于：

```
checkscope.scopeChain = [
	checkscope.AO
	global.VO
]

```

当checkscope执行碰到了 f 函数的创建，因此 f 函数也会创建对应的作用域链，默认以包裹它的函数执行时对应的作用域链为基础。因此此时 f 函数创建时的作用域链如下：

```
checkscope.scopeChain = [
	checkscope.AO
	global.VO
]
```

当 f 函数执行时，此时的作用域链变化如下：

```
checkscope.scopeChain = [
	f.AO
	checkscope.AO
	global.VO
]
```

当checkscope函数执行完毕，内部作用域会被回收，但是 f函数 的作用域链还是存在的，里面存放着 checkscope函数的活动对象，因此在f函数执行时会从作用域链中查找内部使用的 scope 标识符，从而在作用域链的第二位找到了，也就是在 checkscope.AO 找到了变量scope的值。

正是因为`JavaScript`做到了这一点，因此才会有闭包的概念。还有人说闭包并不是为了拥有它采取设计它的，而是设计作用域链时的副作用产物。

闭包是`JavaScript`中最难的点，也是平常面试中常问的问题，我们必须要真正的去理解它，如果只靠死记硬背是经不起考验的。

