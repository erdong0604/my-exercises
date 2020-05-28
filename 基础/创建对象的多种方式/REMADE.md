## 对象定义

>在`JavaScript`中，对象就是一系列属性的集合，一个属性包含一个名和一个值。这个值可以是`JavaScript`数据类型中的任何一种。

## 面向对象
面向对象其实是一种编程思想，是我们基于面向对象的特征(封装，继承，对多态)来进行编程的思想。
在一些面向对象的语言中，我们用类(class)的概念去描述一个对象，类并不完全是一个对象，它更像是一个定义对象特质的模板。我们可以基于这个类来创建出一些对象，这些对象可以拥有类中的属性及方法。

`JavaScript`是支持面向对象的。但是在`ES6`之前，是没有类(class)概念的，但是`JavaScript`通过一些特殊的函数来模拟类。这种方式是基于原型链来实现面向对象的特征。


## 创建对象

#### 常见的创建对象的方式

**1.字面量**

```
var person={
    name: 'erdong',
    age: "27"
}
```
**2.new Object**

```
var person=new Object({
    name: 'erdong',
    age: "27"
})
```

上面这两种方式没什么好说的，也是我们最常见的创建对象的方式。

那么我们怎样基于面向对象的思想创建对象呢？也就是上面所说的模拟面向对象语言中的类。

#### 基于面向对象创建对象的方式

什么是基于面向对象创建对象呢？上面说过我们可以基于类来创建出一些对象，这些对象可以拥有类中的属性及方法。

下面我们就来模拟面向对象中的类来创建对象：

**1.工厂模式**

```
function createPerson(name,age) {
    var o=new Object();
    o.name=name;
    o.age=age;
    o.getName=function() {
        console.log(this.name);
    }
    return o;
}

// 创建方式
var person1=createPerson('erdong',27);
var person2=createPerson('chen',18);
console.log(person1); // {name: "erdong", age: 27}
console.log(person2) // {name: "chen", age: 18}
person1.getName(); // erdong
person2.getName(); // chen

```

缺点：工厂模式虽然解决了创建对个对象，并且这些对象拥有相同名称的属性和方法，但是没有解决对象识别的问题，也就是说我们不知道这些对象是由谁来创建的(不知道这些对象是谁的实例)。

表面上来看上述代码中的对象person1和person2是由createPerson函数创建的，事实上不是：

```
console.log(person1 instanceof createPerson); // false
console.log(person2 instanceof createPerson); // false
```

**2.构造函数模式**

```
function CreatePerson(name,age) {
    this.name=name;
    this.age=age;
    this.getName=function() {
        console.log(this.name);
    }
}

// 创建方式
var person1=new CreatePerson('erdong',27);
var person2=new CreatePerson('chen',18);
console.log(person1); // {name: "erdong", age: 27}
console.log(person2) // {name: "chen", age: 18}
person1.getName(); // erdong
person2.getName(); // chen
console.log(person1 instanceof CreatePerson); // true
console.log(person2 instanceof CreatePerson); // true
```

缺点：构造函数模式虽然优化了工厂模式创建的对象无法识别的问题，但是上述代码中，我们通过new操作符调用CreatePerson构造函数时，代码内的`this.getName`每次都会实例化一次。我们的思想肯定是想让`this.getName`引用同一个函数，这样每次创建一个`Function`实例有点不太合适。

**2.1构造函数优化**

```
function CreatePerson(name,age) {
    this.name=name;
    this.age=age;
    this.getName= getName;
}

function getName(){
	console.log(this.name);
}

// 创建方式
var person1=new CreatePerson('erdong',27);
var person2=new CreatePerson('chen',18);
console.log(person1); // {name: "erdong", age: 27}
console.log(person2) // {name: "chen", age: 18}
person1.getName(); // erdong
person2.getName(); // chen
console.log(person1 instanceof CreatePerson); // true
console.log(person2 instanceof CreatePerson); // true
```

优缺点：虽然这里解决了上面没创建一个对象都会创建一个`Function`的问题，但是需要创建一个全局的函数，如果函数过多的话，还会污染全局变量。


**3.原型模式**

想要搞懂原型模式，首先你要对原型了如指掌。
在这里我们简单的介绍一下原型和原型链：

原型：*当我们创建一个函数时，函数下会有一个`prototype`属性，它指向一个对象，`prototype`下也会有一个属性`constructor`，它指向的是`prototype`所在的函数，当我们通过new关键词调用这个函数，会创建一个新对象(函数的实例)，这个新对象下会有一个隐式原型(这里我们称它为__proto__)，它指向该构造函数的`prototype`对象*

原型链：*原型链其实是当我们访问一个对象的属性或者方法时的查找规则，当我们访问一个对象的属性时，首先在对象自身上去查找，如果找不到就通过`__proto__`找到构造这个对象的函数的`prototype`属性上，如果还未查到，就通过`prototype`的`__proto__`找到构造`prototype`的构造函数上，直到找到`Object. prototype`上，若还未找到则返回`undefined`。*

```
function CreatePerson() { };
CreatePerson.prototype.name='erdong';
CreatePerson.prototype.age=27;
CreatePerson.prototype.getName=function() {
    console.log(this.name);
}

// 创建方式
var person1=new CreatePerson('erdong',27);
var person2=new CreatePerson('chen',18);
console.log(person1); // {name: "erdong", age: 27}
console.log(person2) // {name: "chen", age: 18}
person1.getName(); // erdong
person2.getName(); // chen
console.log(person1 instanceof CreatePerson); // true
console.log(person2 instanceof CreatePerson); // true

```

优缺点：不会每次创建`Function`实例。但是不能函数传参，导致每个实例拥有相同的属性和值。属性和方法过多时显得代码很臃肿。


**3.1原型模式优化**

```
function CreatePerson() {};
CreatePerson.prototype={
    constructor: CreatePerson,
    name: 'erdong',
    age: 27,
    getName: function() {
        console.log(this.name)
    }
}
// 创建方式
var person1=new CreatePerson('erdong',27);
var person2=new CreatePerson('chen',18);
console.log(person1); // {name: "erdong", age: 27}
console.log(person2) // {name: "chen", age: 18}
person1.getName(); // erdong
person2.getName(); // chen
console.log(person1 instanceof CreatePerson); // true
console.log(person2 instanceof CreatePerson); // true
```

优点：优化了上述原型模式下属性和方法过多时代码臃肿。

**4.组合使用构造函数模式和原型模式**

```
function CreatePerson(name,age) {
    this.name=name;
    this.age=age;
}
CreatePerson.prototype={
    constructor: CreatePerson,
    getName: function() {
        console.log(this.name);
    }
}

// 创建方式
var person1=new CreatePerson('erdong',27);
var person2=new CreatePerson('chen',18);
console.log(person1); // {name: "erdong", age: 27}
console.log(person2) // {name: "chen", age: 18}
person1.getName(); // erdong
person2.getName(); // chen
console.log(person1 instanceof CreatePerson); // true
console.log(person2 instanceof CreatePerson); // true
```
组合模式创建对象是我们常用的基于面向对象创建对象的模式，上面所说的几种模式其实就是为了引出现在的组合模式。

#### 先修改原型和后修改原型的区别

例子：

```
function CreatePerson() {
}

CreatePerson.prototype={
    name: 'erdong',
    age: 27,
    getName: function() {
        console.log(this.name);
    }
}

var person1=new CreatePerson();
person1.getName(); // erdong

```

当我们先修改原型(其实应该称为重写)，再实例化一个对象时，输出结果达到我们的预期。

但是当我们先实例化一个对象，再重写构造函数的原型时又会是怎样呢？

```
function CreatePerson() {
}

var person1=new CreatePerson();
person1.getName(); // Uncaught TypeError: person1.getName is not a function

CreatePerson.prototype={
    name: 'erdong',
    age: 27,
    getName: function() {
        console.log(this.name);
    }
}

```

emmm，报错了。。。。

这是为什么呢？

当我们实例化一个对象时，首先要做的就是原型之间的链接，然后再执行构造函数中的代码。这里我们首先实例了person1对象，这时person1已经与CreatePerson.prototype做了链接，也就是`person1.__proto__ = CreatePerson.prototype` ，这时我们突然把 CreatePerson.prototype 的值给重写了，但是`person1.__proto__`指向的还是原先CreatePerson.prototype所指向的对象，根据原型链的查找规则，当我们访问person1.getName()时，首先去person1对象下去查找方法，找不到的话，就往最开始CreatePerson.prototype所指向的对象中去查找，而不是去CreatePerson.prototype重写之后所指向的对象中去查找。

举个例子：

```
var a = {
	value:1
}
var b = a;

a = {
	value:2
}

console.log(b.value); // 1

```

上述代码中输出1，而不是2。


