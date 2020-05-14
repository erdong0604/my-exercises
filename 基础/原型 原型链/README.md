
原型和原型链的主要作用：

* 实现属性和方法的公用
* 继承

所以下面的例子全是以构造函数为例。

#### 原型
--
函数是也是对象，是一个属性的集合，所以函数下也有属性，也可以自定义属性。当我们创建一个函数时就默认会有一个`prototype`属性，这个属性是一个对象(属性的集合)。这个东西就是原型---通过调用构造函数而创建的那个对象**实例**的原型对象。`prototype`里也有个属性`constructor`,指向的是函数本身。

##### prototype
--
```
function Person() {
}
Person.prototype.name='erdong';
var p1=new Person();
var p2=new Person();
console.log(p1.name); // erdong
console.log(p2.name); // erdong
```
函数`Person`有个`prototype`属性，给这个属性添加一个`name`的属性。p1 和 p2 为这个函数的实例，当访问 p1.name 和 p2.name 时其值都是 `prototype`下面 name的值。这个`prototype`对象就是 p1 和 p2的实例原型，它下面的所以属性和方法 p1 和 p2 都可以获取并使用。

看一下原型对象与构造函数的关系：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge833riw18j30g90a6wee.jpg)

那么实例是怎样与原型对象做关联的呢？

##### \_\_proto__
--
每个`JavaScript`对象都具有的一个属性 -- `__proto__` 这个属性指向该对象的原型。不过它是一个隐式属性，并不是所有浏览器都支持它，我们可以把它看做一种实例与实例原型之间的联系桥梁。

```
function Person() {
}
var p1 = new Person();

console.log(p1.__proto__==Person.prototype); // true
```
上述`p1.__proto__`与原型对象时相等的，由此可见`p1.__proto__`指向的是原型对象。

<!--![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge840dilgmj30cf0aat8p.jpg)-->

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge84dksmf5j30cm08saa0.jpg)
##### constructor
--
每个函数都有一个`prototype`属性，而`prototype`下都有一个`constructor`属性，它指向`prototype`所在函数。

```
function Person() {
}
console.log(Person.prototype.constructor==Person) // true
```
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge84ln6iywj30g50dbdg4.jpg)

以上就是关于原型几个重要的"属性"已经说完了，下面来讲讲原型连。

##### 实例与原型

`JavaScript`规定，当读取对象的某个属性或方法时，先从自身查找，如果找不到就去其`__proto__`指向的原型对象上去找，如果找不到就去原型对象的原型对象上查找，如果再找不到就去原型对象的原型对象上去找... , 就这样直到找到最上层，至于哪里是最上层，下面会提到。

```
function Person() {
}

var p1 = new Person();

console.log(p1.name);// undefined

p1.show();// Uncaught TypeError: p1.show is not a function
```

上述例子，p1 为构造函数 Person的实例，当访问 p1 的 name 属性和 show 方法时，因为 p1 是刚 new 出来的实例，所以并没有找到。看下面的例子：

```
function Person() {
}

Person.prototype.name='erdong';

Person.prototype.show=function () {
    console.log(this.name);
}

var p1=new Person();

console.log(p1.name);// erdong

p1.show();// erdong

```
当在 `prototype`上添加 name 属性和 show方法后，p1 就可以正确的访问，这就说明 p1 在查找属性(方法)时，在自身没有找到 就会去`__proto__`所指的原型对象上去查找。再来看一个例子：

```
function Person() {
}

Person.prototype.name='erdong';

Person.prototype.show=function () {
    console.log(this.name);
}

var p1=new Person();

p1.name = 'chen'

console.log(p1.name);// chen
```

当我们在 p1(对象) 上添加一个属性 name 这个时候再去访问 p1.name 那么输出的就是 "chen" 而不是 "erdong"。 这就是一个对象查找属性(方法)时的一个规则。



#### 原型的顶层
--

我们在上述例子查找 p1的name 时当查找到 Person.prototype 还未找到时，我们应该还往下查找，下一级是谁呢？ 因为 `Person.prototype`是对象，那么他就有一个`__proto__`属性，指向的是其原型对象--也就是其对应构造函数的 `prototype`。那么`Person.prototype` 是谁呢？是`Object`，因为对象可以通过 `new Object()`创建:

```
var obj = new Object();
// 我们平时都是通过字面量的形式来写：var obj = { }; 其实就相当于 new Object(); 只不过是javascript在内部执行了。
obj.name = 'erdong';
console.log(obj.name); // erdong
```
看图：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge9aody6aej30ki0g6t8x.jpg)

为什么当查找到 Object.prototype 找不到就输出 undefined 了呢？
因为当在 Object.prototype 也找不到 name 属性，就会去 Object.prototype 指向的原型对象上查找，我们在上面提到，对象与其原型对象是通过 `__proto__`做关联的，但是`javascript`中规定，`Object.prototype.__proto__`是不存在的 也就是`null`

```
console.log(Object.prototype.__proto__ === null); // true
```
这一点要牢记。

#### 原型链

原型链也是`JavaScript`中很重要的一个概念，之所以说是一个概念，是因为它是不存在的，不像一个对象的属性，或者是一个对象的方法一样实例存在。
我的理解就是--一个(实例)对象的属性或者方法的查找规则。这个规则可以很简单，也可以很复杂。

我们把上面所有的知识总结一下：
每个函数都有一个原型对象(prototype)，原型对象又包含一个属性(constructor)，指向的是函数本身，函数的实例都有一个隐式原型(\_\_proto__)，指向的是构造函数的原型对象(prototype)。

查找规则：当我们访问实例的一个属性时，先从实例自身查找，如果找不到就去其内部指向的原型对象上去查找，如果再找不到，就去其内部指向的原型对象内部指向的原型对象上去查找，就这样一直找到原型的最顶端。

看图：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge9ft24180j30dg0dowen.jpg)
蓝色的线就表示一条原型链。

#### 改变prototype
--


```
function Person() {
}
Person.prototype={
    name: 'erdong',
    sex: '男',
    doSoming: function() {
        console.log(this.name);
    }
}

var p1=new Person();
p1.doSoming();
console.log(p1.__proto__==Person.prototype); // true
console.log(Person.prototype.constructor==Person);// false
```
上面的例子，将构造函数的`prototype`属性重写了。虽然p1也能找的到name,但是`prototype`下的`constructor`属性不再指向`Person`了。实际上指向了`Object`

```
console.log(Person.prototype.constructor==Object); //true
```
是因为我们重写了`Person`的`prototype`，此时`Person.prototype`只是一个普通的对象。即:

```
Person.prototype.constructor = Person.prototype.__proto__.constructor = Object.prototype.constructor = Object
```
当`constructor`属性很重要时，我们可以这样做：

```
function Person() {
}
Person.prototype={
    constructor: Person,  // 主动加上constructor属性
    name: 'erdong',
    sex: '男',
    doSoming: function() {
        console.log(this.name);
    }
}
console.log(Person.prototype.constructor==Person);// true
```
上述代码实例可以适用于当构造函数拥有很多方法或者属性时的写法。


#### 继承
--

原型链是实现继承的一种方式。这里只是略提一下，下面的文章会详细理解。


当我们不去完全重写函数的`prototype`属性，而是让它等于另一个构造函数的实例时结果会怎样呢？

```
function SuperType() {
}
SuperType.prototype.name = 'erdong';
SuperType.prototype.getName=function() {
    return this.name;
}

function SubType() {
}
SubType.prototype=new SuperType();

var instance=new SubType();

console.log(instance.name); // erdong
console.log(instance.getName()); // erdong

```
上述例子中有两个构造函数`SuperType`和`SubType`，`SuperType`原型上有个name属性和getName 方法。`instance`是另一个构造函数`SubType`的实例，原本`instance`跟`SuperType`是没有关系的。但是现在`instance`可以获取到 name 属性和 getName 方法。原因就是`SubType`重写了`prototype`属性，让它的值等于`SuperType`的实例。所以存在`SuperType.prototype`中的属性和方法，现在也存在与`SubType.prototype`中。

看下面的图：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge9j99c9dtj310f0fhjrl.jpg)

蓝色的线为`SubType.prototype`改变后的原型( \_\_proto__ 和prototype)的指向(也是实例查找属性的路线)，红色为原来的原型( \_\_proto__和prototype)的指向。

JavaScript高级程序设计一书中解释上述的示例为原型链的基本概念--当我们让原型对象等于另一个构造函数的实例，此时的原型对象将包含一个指向另一个原型的指针，相应的，另一个原型中也包含着一个指向另一个构造函数的指针。加入另一个原型又是另一个构造函数的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓**原型链**的基本概念。

#### 关于原型的方法
--

`isPrototypeOf、getPrototypeOf、instanceof、in、hasOwnProperty`

##### isPrototypeOf

用于判断传入的对象内部是否有一个原型对象的指针。

```
function Person(){
}
var p = new Person();
console.log( Person.prototype.isPrototypeOf( p ) );//  true

```
我们上面讲到实例与原型对象是通过`__proto__`做关联的，`__proto__`并不是`Javascript`规范，所以我们现实中不能使用它来判断实例与原型对象的关系，这个时候就用`isPrototypeOf`。

##### getPrototypeOf

`ES6 Object`新增方法，返回的是传入对象的原型。

```
function Person(){
}
var p = new Person();
console.log( Object.getPrototypeOf(p)===Person.prototype );//  true
```
上述代码输出的是 true 证明 `Object.getPrototypeOf(p)` 获取到的就是 p 的原型。

##### instanceof

 判断前者是否是后者的一个实例。
 
 ```
function Person(){
}
var p = new Person();

console.log(p instanceof Person); // true
console.log(p instanceof Object); // true
 ```
 由于 p 既是 `Person`的实例，同时它也是一个对象，所以也是`Object`的实例。
 
 看下面的示例：
 
 ```
console.log(Function instanceof Object); // true
console.log(Object instanceof Function); // true
 ```
`Function`既是`Object`的实例，`Object`又是`Function`的实例。是有点绕了，下面会说明这一情况。
 
##### in

判断前者是否是后者原型链中的一个属性。

```
function Person() {
}

Person.prototype.name='erdong';

var p=new Person();
p.sex='男';

console.log('sex' in p); // true
console.log('name' in p); // true
console.log('address' in p); // false
```

##### hasOwnProperty

检测传入的字符串是否是调用者的自身属性，如果是自身的属性，返回true，如果是原型中的属性或者不存在，返回false。

```
function Person() {
}

Person.prototype.name='erdong';

var p=new Person();
p.sex='男';

console.log(p.hasOwnProperty('name'));// false
console.log(p.hasOwnProperty('sex')); // true
console.log(p.hasOwnProperty('address')); // false
```
与 in 不同的是如果该属性存在于实例上包括原型链上，就返回true，而hasOwnProperty只有是自身的属性，才会返回true。

#### 思考
--
我们(构造)函数也是对象，上面说过对象下面都会有一个`__proto__`属性，那么函数的`__proto__`指向谁呢？

```
console.log(Person.__proto__===Function.prototype); // true 
```
函数都是通过 `new Function()`来创建的，虽然我们平时创建函数并不是通过 new 

下面这个函数：

```
function sum (num1, num2) {
	return num1 + num2;
}
```
其实在`JavaScript`内部应该是这样实现的：

```
var sum = new Function("num1", "num2", "return num1 + num2");
```

所以`Person`对应的构造函数应该是`Function`。

那么新的问题又来了？

`Function`也一个函数，也是一个对象，那么他同样也有`__proto__`属性，也有`prototype`属性，它们分别指向什么呢？


```
console.log(typeof Function); // 'function'

console.log(Function.__proto__ === Function.prototype); // true

```
看到上面是不是会很奇怪？下面解释一下：

`Function`是一个函数，它也是通过`new Function`创建的，所以它是被自身创建的，它的`__proto__`指向的自身的`prototype`--也就是`Function.prototype`。

那么`Function.prototype.__proto__`又指向谁呢？

```
console.log(Function.prototype.__proto__ === Object.prototype)
```
很显然，`Function.prototype.__proto__`是一个对象，所以它指向的是`Object.prototype`。

还有一个问题，`Object`也是一个构造函数，也是一个对象，那么它应该也有`prototype`和`__proto__`属性，我们在上面说到 `Object.prototype. __proto__ `为`null`，那么`Object.__proto__`指向谁呢？

```
console.log(Object.__proto__ === Function.prototype); // true
```

上面`Object.__proto__` 又指向了`Function.prototype`,是因为`Object`是函数，所以它的原型就是`Function.prototype`。

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge9og7uvhzj30j30cjq34.jpg)

最后总结一下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geafmhwzkrj310d0ivdgl.jpg)

看似关系很复杂，其实一条一条捋清楚就有一种恍然大悟的感觉。

