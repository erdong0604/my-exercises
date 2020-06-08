#### 可执行代码
--
`JavaScript`中可执行代码有三种：

1. 全局代码
	**全局代码不包括在任何function体内的代码**。这是个默认的执行环境，一旦代码被载入，引擎最先进入的就是这个环境。
2. 函数代码
	任何一个函数体内的代码，但需要注意的是，**具体的函数体内的代码时不包括内部函数的代码**
3. eval代码
	eval内部的代码



下面是有关执行上下文的概念关键词：

* `EC`(Execution Context) ：执行上下文(执行环境)。
* `ECS`(Execution Context Stack) ：执行上下文栈(执行环境栈)
* `VO`(Variable Object)：变量对象
* `AO`(Active Object)：活动对象
* `scopechain`：作用域链
*  `this`


下面来一一介绍这些概念：

##### EC（执行上下文）

每当`JavaScript`引擎遇到可执行代码(上面介绍的三种)的时候，就会进入到一个执行上下文。

这只是对`EC`的介绍，下面才是对`EC`详细的解释。

##### VO（变量对象）/ AO（活动对象）

其实这两个是一个东西，AO 其实就是被激活的 VO 。都是规范概念上的东西。说白了只不过是鞋架上的鞋，和脚上穿的鞋之间的区别，本质上都是鞋。

 * **VO（变量对象）**是说`JavaScript`的执行上下文都有个对象用来存放执行上下文中可被访问但是不能被`delete`的函数标识符，形参，变量声明等。他们会挂在这个对象上，对象的属性对应他们的名字，对象的属性的值对应它们的值。但是这个对象时规范上的或者说是引擎是线上的不可在`JavaScript`中访问到的活动对象。

 * **AO（活动对象）**有了变量对象存每个上下文的东西，但是它什么时候能被访问到呢？就是没进入一个执行上下文时，这个执行上下文中的变量对象就被激活，也就是改上下文中的函数标识符，形参，变量声明等就可以被访问到了。

 
####   EC 创建可以分为两步

1. 创建阶段 函数被调用，但是未执行任何其内部代码之前。

	* 创建作用域链 scope chain
	* 创建变量，函数和形参
	* 求 this 的值
		

1. 执行阶段。
	* 	执行代码


**我们可以将每个执行上下文抽象为一个对象，这个对象具有三个属性**

```
ECobj:{
	scopeChain:{} //作用域链
	VO:{ }//活动对象
	this:{ }
}
```

**函数被调用时引擎执行代码的伪逻辑**

1. 调用函数
2. 执行代码之前，先进入创建上下文阶段


```
	2-1.  初始化作用域链
	
	2-2.  创建变量对象：
	
	    2-2-1  创建 arguments`对象。用实参的值一次赋给形参，如果没有对应的实参，则值为 undefined
		
	    2-2-2  扫描上下文中的函数声明(并非函数表达式，函数表达式相当于变量声明)
		
			2-2-2-1  为发现的每一个函数，在变量对象上创建一个属性，确切的说是函数的名字，其值就是当前函数名指向的函数的引用。
			2-2-2-2  如果属性(函数)名已经存在，则将值覆盖为后面一个函数名指向的函数引用(值被后面的函数覆盖，因为是同一个函数名)
			
		2-2-3  扫描上下文中的变量声明
			
			2-2-3-1  当发现变量声明时，在变量对象上创建一个属性，属性名就为变量的名字，并将属性(变量)的值初始化为 undefined
			2-2-3-2 如果变量对象上的属性已经存在，则忽略这次声明
2-3.  求出上下文内部的 this 指向
```			

3. 激活/执行代码


```
	3-1.  VO (变量对象) 变成 AO (活动对象)
	3-2.  执行代码
```

我们用一段代码来解释上面的行为：

```
function foo(a){
	var b = 1;
	function c(){
		console.log(111);
	}
	function c(){
		console.log(222);
	}
	var d = function (){
		console.log(333);
	}
}

foo(1);
```

当执行 foo 函数时。**VO(变量对象)** 的创建过程如下：

```
// 第一步
ECobj = {
    scopChain： {...},
     VO: {
        arguments: { // 形参对象
            0: 1,
            length: 1
        },
        a: 1,
    },
    this: { ... }
}

// 第二步
ECobj = {
    scopChain： {...},
     VO: {
        arguments: { // 形参对象
            0: 1,
            length: 1
        },
        a: 1,
        c: function(){ console.log(111) }, // +++   
    },
    this: { ... }
}
// 第三步
ECobj = {
    scopChain： {...},
     VO: {
        arguments: { // 形参对象
            0: 1,
            length: 1
        },
        a: 1,
        c: function(){ console.log(222) }, // +++ c的值被覆盖
    },
    this: { ... }
}

// 第四步
ECobj = {
    scopChain： {...},
     VO: {
        arguments: { // 形参对象
            0: 1,
            length: 1
        },
        a: 1,
        c: function(){ console.log(222) }, 
        b: undefined // +++ 
    },
    this: { ... }
}
// 第五步
ECobj = {
    scopChain： {...},
     VO: {
        arguments: { // 形参对象
            0: 1,
            length: 1
        },
        a: 1,
        c: function(){ console.log(222) },
        b: undefined,
        d: undefined // +++
        
    },
    this: { ... }
}
```

上述步骤中：第一步对应 2-2-1，第二步对应 2-2-2-1 ，第三步对应 2-2-2-2 , 第四步和第五步对应 2-2-3-1 。

当我们输出上面的例子：

```
function foo(a){
	console.log(a);
	console.log(b);
	console.log(c);
	console.log(d);
	var b = 1;
	function c(){
		console.log(111);
	}
	function c(){
		console.log(222);
	}
	var d = function (){
		console.log(333);
	}
}

foo(1);
```
输出结果：

```
1
undefined
ƒ c(){
	console.log(222);
}
undefined
undefined
```

我们看到输出结果刚好对应 VO 对象属性里的值。

**上述 VO 的创建过程就可以理解为变量提升。**

当我们在执行代码时，VO 此时“变成” AO 。上面说了其实 VO 和 AO 其实是一个东西。因为 VO 是不可被访问的，当代码执行时我们是要去访问 VO 的，所以现在 AO 就出现了。总结一句话 : **VO 和 AO 只不过是同一个对象处在执行上下文不同生命周期内 叫不同的名字而已** 。

```
function foo(a) {
    1    b(); // 1
    2   console.log(a); // function a(){}
    3   var a=123;
    4   console.log(a); // 123
    5   function a() {}
    6   function b() {
            console.log(1);
         }
}
foo(123);
```

下面来解释上面的输出:

1）.为什么第 1行 会输出 1 。

> 因为 foo 函数执行，我们在 VO 的创建阶段 ，如果函数内部有函数声明，我们就会把它"存到"变量对象中，所以在开始执行函数内部代码时，函数 b 就已经存在。因此能执行并且输出 1 。

 2）.为什么第二行会输出 `function a(){ }.` 

> 因为 foo 内部有一个函数声明 a(){} 。因此首先会把它放到变量对象 VO 中，此时 VO 多了个属性 a 其值为 function a(){ } 。 当再遇到 var a = 123时，会先检测变量对象 VO 中是否有 a 这个属性存在，因为刚才我们在 VO 对象在加了一个属性 a ， 所以在 VO 创建时 此句话跳过。因此在打印 a 时，AO里面的 a 的值还是 function a(){ } 。

3）. 为什么第四行打印 123

> 因为此时是代码执行阶段，代码执行到第 3行 时 AO 里面的 a 就会被赋值为 123 。所有会输出 123

再来举个例子：

```
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```
在函数开始执行时，AO 的的状态：

```
AO : {
	arguments: { // 形参对象
	    0: 1,
	    length: 1
	},
	a: 1,
	c: function c(){  },
	b: undefined,
	d: undefined 
}

```

接下来顺序执行代码，AO属性(变量)被依次赋值、修改，当代码执行完，AO 的状态如下：

```
AO : {
	arguments: { // 形参对象
	    0: 1,
	    length: 1
	},
	a: 1,
	c: function c(){  },
	b: 3,
	d: function c(){  }, 
}

```

总结：

1. `EC`分为两个阶段，创建阶段和代码执行阶段。
2. 每个`EC`可以抽象为一个对象，这个对象具有是三个属性，分别为 ：作用域链(scopeChain)、创建 VO(AO)阶段，以及 this 求值。
3. 在执行函数时，VO 中就存放了函数内部的变量，函数等。执行函数开始 VO 变成 AO ，可以进行变量的使用和赋值。
4. `EC`创建的过程查找变量(函数)是有先后顺序的：参数声明 > 函数声明 > 变量声明

#### ECS 执行上下文栈
--

我们上面说了 每当`JavaScript`引擎遇到可执行代码(上面介绍的三种)的时候，就会进入到一个执行上下文。由于`JavaScript`是单线程的，那么当同时进入多执行个上下文，`JavaScript`又该怎么处理呢？这个时候就引出了 执行上下文栈 。是由一个或多个执行上下文组成的。 我们直到 “栈” 都要遵循 “后入先出” 的规则。我们看看`JavaScript`中的栈是怎样 “后入先出” 的。

我们可以定义一个数组来模拟执行上下文堆栈：

```
ECStack = [];
```
每当 `JavaScript`遇到一个可执行代码时，都会进入一个执行上下文，这个执行上下问都会被压入执行上下文栈。

在初始化阶段，`JavaScript`默认进入全局执行上下文，如果全局执行上下文默认在栈的最底部。只有当整个应用程序结束时，全局执行上下文才会出栈，`ECStack` 也会被清空。否则它永远存在栈的最底部。我们用`globalContext`来表示全局执行上下文。

```
ECStack = [
  globalContext
];
```

当一个函数执行时，就会进入一个执行上下文，并且把它压入执行上下文栈，当函数执行完毕，从栈顶弹出。那我们看看指向下面代码时执行上下文栈是如何变化的。


```
function foo() {
    bar();
    console.log('foo 执行完毕');
}
function bar() {
	console.log('bar 执行完毕');
}
foo();
```

当开始执行 foo 函数时，进入 foo 的执行上下文，所以foo 的执行上下文会被压入执行上下文栈：

```
//执行上下文栈变化如下
ECStack = [
	<foo> functionContext
  	globalContext
];
```
但是 foo 函数还未执行完毕时，又碰到了 bar 函数的执行，因此又进入了 bar 的执行上下文，所以bar 的执行上下文会被压入执行上下文栈：

```
//执行上下文栈变化如下
ECStack = [
	<bar> functionContext
	<foo> functionContext
  	globalContext
];
```
此时执行上下文栈**堆栈**工作已经完成，下面执行**出栈**：

当 bar 函数执行完毕：

```
//执行上下文栈变化如下
ECStack = [
	<bar> functionContext ---> 出栈
	<foo> functionContext
  	globalContext
];
// 变成
ECStack = [
	<foo> functionContext
  	globalContext
];
```

当 foo 函数执行完毕：

```
//执行上下文栈变化如下
ECStack = [
	<foo> functionContext ---> 出栈
  	globalContext
];
// 变成
ECStack = [
  	globalContext
];
```

用一张图来表示 ECStack 的变化
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gecvrxxqjdj30t00ejmx9.jpg)


总结：

* JavaScript引擎是单线程的，所以一次只能进入一个函数执行上下文。
* 程序开始执行时，首先创建全局执行上下文，然后将该执行上下为压入执行上下文栈的底部。
* 每当执行一个函数，就会创建一个执行上下文，然后将其压入栈中，函数执行完成后，执行上下文从栈中弹出，等待垃圾回收。
* 全局上下文只有唯一的一个，它在程序退出(关闭浏览器)时出栈。


#### ES6之后的执行上下文

上面介绍的是`ES3`中的执行上下文和执行上下文栈，但是现在都`ES2020`了。从`ES6`之后执行上下文的创建就发生了变化，不是说创建过程发生变化，而是在创建阶段的产物发生了变化。

我们知道执行上下文分为两个阶段：

1. 创建阶段
2. 执行阶段

##### 创建阶段

在`ES6`之前，创建阶段会产生三个对象：`作用域链、thisValue、VO/AO`，而在`ES6`之后就变成了：`thisValue、词法环境组件、变量环境组件`

##### 词法环境

>定义：词法环境是一种规范类型，基于ECMAScript代码的词法嵌套结构来定义标识符和具体变量和函数的关联。一个词法环境由环境记录和一个可能的引用outer词法环境的空值组成。

词法环境是一种**标识符-变量映射**的结构。(标识符即为变量/函数的名字，而变量是对实际对象[包括函数类型对象]或原始值的引用)。

词法环境包括：

1. 环境记录
2. 对外部环境引入记录

**环境记录器**是储存当前作用域中的变量和函数声明的实际位置。

**外部环境引入记录**是保存自身环境可以访问的其它外部环境。

词法环境也分为两种：

1. 全局词法环境
2. 函数词法环境

全局词法环境中的外部环境引入记录为` null `，因为它本身就是最外层的执行环境。环境记录器里存放着全局的变量及函数。

函数词法环境中的外部环境引入为可能为全局词法环境或者是外部函数的词法环境。环境记录器里存放着用户声明的变量及函数

环境记录器也分为两种：

1. 在全局环境中，环境记录器是对象环境记录器
2. 在函数环境中，环境记录器是声明式环境记录器

```
//全局执行上下文
GlobalEC = {
    // 词法环境
    LexicalEnvironment: {
        //环境记录器
        EnvironmentRecord: {
            Type: 'object'  // 对象环境记录器
        }
        //外部环境引入记录  null
        outer: <null>
    }
}

//函数执行上下文

FunctionEC = {
    // 词法环境
    LexicalEnvironment: {
        //环境记录器
        EnvironmentRecord: {
            Type: 'Declarative' // 声明式环境记录器
        },
        //外部环境引入记录  全局词法环境或者外部函数词法环境
        outer: <Global or outerfunction environment reference>
    }
}
```

##### 变量环境

它同样是一个词法环境，在`ES6`之后的唯一区别在于`词法环境用于储存函数声明与leo const声明的变量`，而`变量环境仅仅储存var声明的变量`。

```
let a = 20;  
const b = 30;  
var c;

function multiply(e, f) {  
 var g = 20;  
 return e * f * g;  
}

c = multiply(20, 30);
```

此时的全局执行上下文和函数执行上下文：

```
//伪代码
//全局执行上下文
GlobalEC = {
    //全局执行上下文中的this为全局对象
    ThisBinding:<Global Object>
    //词法环境
    LexicalEnvironment:{
        //环境记录器
        EnvironmentRecord:{
            Type:'object' // 环境记录器类型(对象环境记录器)

            //下面是全局用let const声明的变量、函数声明。
            a:<uninitialized>  // 未定义
            b:<uninitialized>  // 未定义
            multiply:<function> // 函数声明
        }
        // 外部环境引入记录
        outer:<null>
    }
    //变量环境
    VariableEnvironment:{
        //环境记录器
        EnvironmentRecord:{
            Type:'object' //环境记录器类型(对象环境记录器)
            c:<undefined> // 值为undefined
        }
        //外部环境引入记录
        outer:<null>
    }
}
//函数执行上下文
FunctionEC = {
    //函数执行上下文中的this为全局对象(因为它是独立调用)
    ThisBinding:<Global Object>
        //词法环境
    LexicalEnvironment:{
        //环境记录器
        EnvironmentRecord:{
            Type:'Declarative' // 环境记录器类型(声明环境记录器)
            
            //下面是全局用let const声明的变量、函数声明以及Arguments对象。
            m:<uninitialized> // 未定义
            Arguments: {0: 20, 1: 30, length: 2},  
        }
        // 外部环境引入记录 全局词法环境
        outer:<GlobalEnvironment>
    }
    //变量环境
    VariableEnvironment:{
        //环境记录器
        EnvironmentRecord:{
            Type:'Declarative' // 环境记录器类型(声明环境记录器)
            //下面是用var声明的变量
            g:<undefined> // 值为undefined
        }
        // 外部环境引入记录 全局词法环境
        outer:<GlobalEnvironment>
    }
}
```

只有在函数执行时才会进入函数执行上下文。

当进入全局执行上下文时，先去查找var 声明的变量放入到变量环境中，赋值为`undefined`。然后查找 let，const声明的标识符和函数声明，放入到词法环境中，let，cont声明的标识符赋值为`uninitialized(未定义)`，函数声明赋值为当前的函数引用。这也就是为什么用let，const声明一个变量时，虽然不会有变量提升，但是我们在声明变量之前使用该变量就会抛出引用错误。而用var声明的变量则不会抛出错误。

##### 执行阶段

也就是执行全局或者函数内部代码。给对应的表示符赋值。




