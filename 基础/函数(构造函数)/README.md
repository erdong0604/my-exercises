### 函数
-
>函数实际上是对象。每个函数都是`Function` 类型的实例，而且都与其他引用类型一样具有属性和方法

### 定义函数
-

定义函数常用的两种方式：函数声明，函数表达式

函数声明创建一个函数：

```
function fn(num1, num2) {
	return num1 + num2;
}
```
函数表达式创建一个函数：

```
var fn = (num1, num2) {
	return num1 + num2;
}
```
这两种方式都可以创建一个名为`fn`的函数, 表面区别就是函数表达式创建函数时没有函数名。因为由于函数是对象，因此函数名实际上就是一个函数对象的指针，以上两种创建函数方式`fn`都会指向函数对象。

为什么说函数名仅仅是指向函数的指针，看下面的例子

```
function sum(num1, num2) {
	return num1 + num2;
}
alert(sum(10,10));        //20

var anotherSum = sum;
alert(anotherSum(10,10)); //20

sum = null;
alert(anotherSum(10,10)); //20
```
上述代码定义一个名为`sum`的函数，与声明了一个变量`anotherSum `将其值设置为`sum`的值，此时`sum`和`anotherSum`就都是同一个函数的指针，即使将`sum`设置为null，`anotherSum `仍然可以调用。



类似于对象：

```
var obj1 = { a:1 };
console.log(obj1.a);// 1

var obj2 = obj1;
obj2.a = 1;

obj1 = null;
console.log(obj2.a) ; //1
```
### 没有重载
-

函数是没有重载的概念的：

```
function addSomeNumber(num){
        return num + 100;
}
function addSomeNumber(num) {
    return num + 200;
}
var result = addSomeNumber(100); //300
```
上述例子中创建了两个同名的函数，因为函数名仅仅是函数对象的一个指针，所以一个函数名只能指向一个函数对象，结果则是后者覆盖前者。

看下面例子就很清楚了：

```
var addSomeNumber = function (num){
    return num + 100;
};
 addSomeNumber = function (num) { 6 return num + 200;
};
var result = addSomeNumber(100); //300
```
在创建第二个函数时是实际上是覆盖了第一个变量的值(函数的引用)。

### 函数的变量提升
-

上面说过函数的两种声明方式，在普通使用来说是没有什么区别的，都是声明一个函数，用这个函数来处理一些事情。而实际上，解析器在向执行环境环境中加载数据时，用函数声明和函数表达式创建的函数并不是一样的

对于函数声明：

```
alert(sum(10,10)); // 20
function sum(num1, num2){
    return num1 + num2;
}
```
以上代码正常输出

对于函数表达式

```
alert(sum(10,10)); // Uncaught TypeError: sum is not a function
var sum = (num1, num2){
    return num1 + num2;
}
```
以上代码产生错误

原因是当`javascript解析器`在执行当前环境(作用域)中的代码时，会把函数声明提前，也就是把整个函数声明创建的函数放到当前执行环境的最顶部，所以即使在函数声明之前访问函数，也是可以访问到的。当访问函数表达式创建的函数时，只是相当于给变量`sum`赋值一个函数对象，这时只会把变量名`sum`提升到顶部，所以当在函数表达式创建的函数之前调用函数，此时`sum`的值为`undefined`。

构造函数
-
构造函数是`javascript`中一个很重要的概念。它表面上跟普通函数是没区别的。
普通函数与构造函数的区别

####1.调用方式
一个函数通过`new`操作符调用，这个函数就是构造函数。否则就是普通函数。

```
function fn() {
    console.log(1)
}
fn();
//构造函数调用
function otherfn() {
    console.log(1)
}
new otherfn();
```

####2.返回值(return)
普通函数的返回值默认为`undefined`,构造函数的默认返回值为当前构造函数的实例。

```
function fn() {
}
console.log(fn()); //undefined
//构造函数调用
function otherfn() {
}
console.log(new otherfn());//otherfn {}
```

####3.this指向
`this`是`javascript`最重要也是令初学者最为困惑的“东西”。在这里只是简单说一下构造函数与普通函数作用域中的`this`。下面的笔记会终点研究它。

普通函数中的`this`默认指向的是调用它的对象。如：

```
function fn(){
	console.log(this);
}
fn(this); //Window 
```
为什么上述函数中的`this`指向的是`Window`对象呢？

看下面的例子就比较直观了:

```
function fn(){
	console.log(this);
}
Window.fn(this); //Window 
```

并不是说所有的普通函数内部的this指向都是调用当前函数的对象，可以通过`call apply bind`,改变`this`的指向。

构造函数中的`this` 默认指向的是该构造函数的实例对象。如：

```
function fn(){
	this.name = 'erdong';
	console.log(this); // fn {name: "erdong"}
}
var f = new fn();
console.log(f.name);// erdong
```

#### 修改构造函数中的返回值

上面说过构造函数默认返回的是当前实例，如果修改一个构造函数的返回值呢?

```
function fn(){
	return 1;
}
console.log(new fn()); // fn {}
```
当返回的是一个原始类型的值,不会改变构造函数的默认返回值，还是会返回当前实例。

```
function fn(){
	console.log(this.name);
	return {
		name:'erdong'
	};
}
console.log(new fn()); // {name: "erdong"}
```
当返回的是一个引用类型的值，会改变构造函数的默认返回值。







