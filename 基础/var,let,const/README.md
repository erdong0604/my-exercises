### 变量声明
--
在javascript中有三种声明变量的方式：var、let、const

#### var
在 es6 之前我们声明一个变量都是用`var`关键字:

```
var x = 1;
console.log(x);//1
```
或者省略`var`:

```
x = 1; // 在严格模式下会抛出 ReferenceError 异常
console.log(x);//1
```
省略`var`声明的变量为全局变量即`Window.x`。

用`var`声明的变量具有变量提升的特点:

```
console.log(x); // undefined
var x = 1;
```
当`javascript解析器`执行上面的代码时实际上是:

```
var x;
console.log(x);
x = 1;
```
这就是变量提升。

我们继续看下面的例子:

```
var x = 1;
if(x === 1){
	var y = 2;
}else{
	var z = 3;
}
console.log(x); //1
console.log(y); //2
console.log(z); //undefined
```
这个例子就会令人困惑：一些新手会认为输出的结果为：
x输出1，console.log(y)报错，下面的不执行；

其实并不是：在`es6`之前`javascript`是没有块级作用域的，只有全局作用域和函数作用域，所以这里的`if`语句后的 { } 并不会产生块级作用域，这里声明的变量都是当前执行环境的全局变量。`else`中声明的变量 z 也会提升到执行环境的最顶部，当执行`else`中的代码时，变量 z 会被赋值。

来看下一个例子：

```
for(var i = 0; i < 3; i++){
}
console.log(i); // 3
```
上述例子中的变量 i 其实全局的变量，所以在`for` 循环的外部可以获取到变量 i ； 
 
#### let 和 const

在`es6`中引入了块级作用域，加强对变量生命周期的控制。
块级作用域存在于：

* 函数中
* 在被 `{ }`包裹的块中

使用`let`和`const`声明的变量是有块级作用域的：就是其声明的变量只能在当前的块级作用域中访问，在外部是访问不到的。

```
if(true){
	let x = 1;
}
console.log(x) // Uncaught ReferenceError: x is not defined
```
对比 `var`:

```
if(true){
	var y = 1;
}
console.log(y) // 1
```

在上面说了 `if` 语句是不会产生块级作用域的 但是在 `if`后的 `{ }`中使用`let`声明变量，就形成了一个块级作用域，所以 x 只能在当前块级作用域中访问。
 


```
console.log(x); //Uncaught ReferenceError: Cannot access 'x' before initialization(无法在初始化之前访问“x”)
console.log(y); //2
let x = 1;
var y = 2;
```
我们都知道


#### 1.let和const声明的变量不会被提升。




