### 前言

继承是面向对象的重要的特性之一。`JavaScript`不是面向对象语言，也不存在类(class)，虽然在`ES6`中引入了新的class语法，但是它跟面向对象中的类，并不同。在`JavaScript`中的基于面向对象编程的全部是基于原型链的。

原型链是`JavaScript`中重要的概念之一。如果对原型链不了解或是一知半解，在`JavaScript`中实现继承时会困难重重。

再强调一遍，在`JavaScript`中并不存在类，所谓的`ES6`中的class也只是表面上模拟了类的模样和类的操作。因为`JavaScript`并不是面向对象语言，因此它并不需要真正的类。但是类的优点是所有不是面向对象语言所`羡慕`的。因此`JavaScript`会基于现有的语法来模拟类。

好像什么都离不开原型链emmmmm。在复习一下吧。

每个函数下面默认会有一个prototype属性，这个prototype属性下默认会有一个constructor属性，指向当前的函数。当这个(构造)函数通过new关键词调用，会创建一个新对象。这个新对象默认会有一个隐式原型`__proto__`属性，指向构造它的构造函数的prototype属性。当新对象访问一个属性时：首先从自身上去寻找，如果找不到，就通过`__proto__`向构造函数的prototype属性上去查找，如果找不到，就通过构造函数的prototype的`__proto__`属性向上查找，直到查找到Object.prototype上。若还未找到返回undefined。

介绍完原型链那么下面开始实现继承：


### 一) 原型链继承

```

// 父类
function Person(){
    this.weight = "75kg";
    this.height = "180cm"
}

// getPersonInfo是在父类prototype中的一个方法/属性
Person.prototype.getPersonInfo = function(){
    console.log(`体重:${this.weight}; 身高：${this.height}`)
}

// 子类
function Men(){
    this.sex = '男人';
}

// 将Person的实例赋值给Men.prototype
Men.prototype = new Person();
    
Men.prototype.getSex = function(){
    console.log(this.sex);
}

// 通过new Men创建一个子类的实例
var men1 = new Men();
men1.getSex(); // 男人
men1.getPersonInfo();// 体重:75kg; 身高：180cm
```

上述代码中我们创建一个Person构造函数，我们称它为父类。在父类中有属性`weight、height`和一个方法`getPersonInfo`。又创建一个子类Men，想要子类Men也拥有父类Person的属性和方法。我们就需要子类去继承父类。

原型链继承实际上是修改了子类Men的原型。将Men的原型指向了父类的实例。这时原本存在于Person实例中的(能访问到的)属性和方法也都存在于Men.prototype中了。因此Men的实例men1，通过原型链也能获取到存在于Men.prototype中的属性和方法了。

如果不修改Men的原型。Men的实例men1的原型链是这样的：

```
men1 --> men1.__proto__ --> Men.prototype --> Men.prototype.__proto__ --> Object.prototype 
```
修改后：

```
men1 --> men1.__proto__ --> Men.prototype --> new Person() --> (new Person()).__proto__ --> Person.prototype  --> Person.prototype.__proto__ -->  Object.prototype 
```


**当需要覆盖父类中的方法时，必须要放到替换原型之后，并且不能重写子类的原型**

```
function Person(){
    this.weight = "75kg";
    this.height = "180cm"
}

Person.prototype.getPersonInfo = function(){
    console.log(`体重:${this.weight}; 身高：${this.height}`)
}
function Men(){
    this.sex = '男人';
}

// 这样是错误的
Men.prototype.getPersonInfo = function(){
    console.log('我是一个男人');
}

Men.prototype = new Person();

// !!! 当需要覆盖父类中的getPersonInfo方法时 必须放到Men.prototype = new Person()的后面

// 这样是正确的
Men.prototype.getPersonInfo = function(){
    console.log('我是一个男人');
}

//这样是错误的
Men.prototype = {
	getPersonInfo:function(){
		console.log('我是一个男人');
	}
}

```

#### 原型继承的缺点
- 父类中引用类型的属性会被子类的所有实例共享，通过某个实例修改引用类型的数据时会影响其他实例。

```
function Person(){
    this.hobbies = ['money','sleep'];
}

function Men(){
}

Men.prototype = new Person();

var men1 = new Men();
men1.hobbies.push('eat');
console.log(men1.hobbies); // ["money", "sleep", "eat"]

var men2 = new Men();
men2.hobbies.push('play');
console.log(men2.hobbies); // ["money", "sleep", "eat", "play"]
```

由于hobbies是一个引用类型的属性，当men1和men2访问hobbies属性时，其实访问的是同一个Person实例上的属性。因此当修改一个子类实例中的hobbies属性时，会影响所有的实例。

- 无法向父类中传参

```
function Person(hobbies){
    this.hobbies = hobbies;
}

function Men(){
}

Men.prototype = new Person(['money','sleep']);

var men1 = new Men();
men1.hobbies.push('eat'); // ["money", "sleep", "eat"]
console.log(men1.hobbies);

var men2 = new Men();
men2.hobbies.push('play');
console.log(men2.hobbies); // ["money", "sleep", "eat", "play"]
```

像上述代码所示，想要给父类传参，必须要在调用父类构造函数时，也就是替换子类prototype时。

### 二) 借用构造函数继承/经典继承

```
function Person(){
    this.hobbies = ['money','sleep'];
}

function Men(){
	Person.call(this);
}

Men.prototype = new Person();


```

上述代码就是借用构造函数继承(也叫经典继承)，只是在子类的构造函数中调用父类的构造函数。最后的结果是父类的构造函数中的this为子类的实例。

借用构造函数继承解决了原型链继承的两个问题：

- 引用类型的属性被所有实例共享。更改时会影响其它实例。

```
function Person(){
    this.hobbies = ['money','sleep'];
}

function Men(){
    Person.call(this);
}

var men1 = new Men();
men1.hobbies.push('eat'); // ["money", "sleep", "eat"]
console.log(men1.hobbies);

var men2 = new Men();
men2.hobbies.push('play');
console.log(men2.hobbies); // ["money", "sleep", "eat"]

console.log(men1.hasOwnProperty('hobbies')); // true
console.log(men2.hasOwnProperty('hobbies')); // true
```

当父类在子类中调用后，相当于每次在实例上新增一个属性，每个实例的hobbies属性都是独立的。不会存在引用类型属性共享的问题。

- 不能像父类中传参

```
function Person(hobbies){
    this.hobbies = hobbies;
}

function Men(hobbies){
    Person.call(this,hobbies);
}

var men1 = new Men(["money", "sleep"]);
men1.hobbies.push('eat'); // ["money", "sleep", "eat"]
console.log(men1.hobbies);

var men2 = new Men(["money", "sleep"]);
men2.hobbies.push('play');
console.log(men2.hobbies); // ["money", "sleep", "eat"]

```

由于每次通过new Men创建实例时都会调用父类的构造函数。因此可以通过调用父类构造函数时向父类构造函数中传参。

#### 借用构造函数的缺点

- 父类原型中的属性和方法，在子类型是无法继承的。

```
function Person(){
    this.hobbies = ['money','sleep'];
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(){
    Person.call(this);
}

var men1 = new Men();
men1.getHobbies(); // Uncaught TypeError: men1.getHobbies is not a function

```


### 三) 组合继承

上面介绍了原型链继承和构造函数继承，各有优缺点。但是我们想象一下能不能把这两个继承相结合。刚好构造函数继承解决了原型链继承的痛点，原型链继承又解决了构造数继承的痛点。因此就有了组合继承(原型链+构造函数)。取二者之长。

思路就是通过原型链让子类继承父类原型上的属性和方法，通过构造函数实现对实例属性和方法的继承。


```
function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    // 通过这一步 继承父类的实例属性
    Person.call(this,hobbies);
}
    
//通过这一步 继承父类原型上的方法
Men.prototype = new Person();

var men1 = new Men(['money','sleep']);
men1.getHobbies(); // ['money','sleep']
```

似乎这种继承刚好满足了我们的要求。

* 可以向父类传参
* 父类实例属性为引用类型时也不会共享
* 可以继承父类的实例属性
* 可以继承父类原型上的属性

但是组合继承也是有问题的：

#### 组合继承的缺点
- 无论什么情况下都会最少调用两次父类构造函数

```

function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    // !!! 这里是第二次调用
    Person.call(this,hobbies);
}
    
 // !!! 这里是第一次调用
Men.prototype = new Person();

var men1 = new Men(['money','sleep']);
men1.getHobbies(); // ['money','sleep']

```

### 四) 组合继承优化1

既然组合继承的缺点就是父类构造函数会调用多次。那么我们不让它调用这么多次不就好了

我们看一下组合继承的代码

```

function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    // !!! 这里是第二次调用
    Person.call(this,hobbies);
}
    
 // !!! 这里是第一次调用
Men.prototype = new Person();

var men1 = new Men(['money','sleep']);
men1.getHobbies(); // ['money','sleep']

```

看一下上面的第一次调用的目的，显然是让父类的实例赋值给子类的原型。目的就是通过子类的原型然后再通过父类的实例(因为实例赋值给子类原型了)找到父类原型上的方法，因为父类的实例是可以访问父类原型上的方法的。那么我们把父类的实例这一层省略调，直接通过子类的原型指向父类的原型，那么子类的原型自然就能获取到父类原型上的方法。

```
function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    // 通过这一步 继承父类的实例属性
    Person.call(this,hobbies);
}
    
//通过这一步将父类的原型直接赋值给子类的原型，减少了父类的调用次数
Men.prototype = Person.prototype;

var men1 = new Men(['money','sleep']);
men1.getHobbies(); // ['money','sleep']

```

这种方式似乎是很美好的。笑嘻嘻😁😁😁😁😁

#### 缺点

- 当修改子类的原型时，同样会修改父类的原型。

比如给子类原型上添加一个方法，同样父类原型上也会添加。因为父类原型直接赋值给了子类的原型，由于引用地址相同，因此更改子类原型时父类原型也会改变。但是我们的期望肯定是只给子类的原型上添加方法。这种继承方式肯定是不合理的。也违反了面向对象的开闭原则(对扩展开放,对修改关闭) 。

示例：

```
function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    // 通过这一步 继承父类的实例属性
    Person.call(this,hobbies);
}
    
//通过这一步将父类的原型直接赋值给子类的原型，减少了父类的调用次数
Men.prototype = Person.prototype;

// 当给子类的原型添加一个新方法，目的是让子类的实例都可以调用这个方法。
//但是会影响到父类的原型，导致以后每个继承父类的子类的原型上都会有这个方法
Men.prototype.menHobbies = function(){
    console.log(this.hobbies);
}

var p1 = new Person(['money']);
p1.menHobbies(); // ['money']   menHobbies这个方法显然是我们只想让Men的实例可以获取的，但是父类的实例也可以获取的到

    
var men1 = new Men(['money','sleep']);
men1.menHobbies(); // ['money','sleep']
```

### 五) 组合继承优化2

组合继承优化1中索然解决了组合继承的一些痛点，但是本身还有有问题的。那么们把组合继承优化1中的痛点解决掉不就好了吗。

思路：组合继承优化1中的缺点是修改子类的原型会同样修改父类的原型。既然我们希望的是子类的原型可以获取到父类原型中的方法。那么我们是不是可以让父类的原型存在于子类原型的原型链上呢。(根据原型链的规则，当父类原型存在于子类原型的原型链中，当子类原型访问一个属性时自然会找到父类的原型上)。

```
Men.__proto__ = Person.prototype
```

但是`__proto__`是不建议我们访问的。但是有一个方法可以设置一个对象的不建议访问的`__proto__`的值[`Object.setPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)。

`Object.setPrototypeOf(obj, prototype)`方法接收两个参数，两个类型理论上来说都应该是Object。把前者的`__proto__`指向为后者。其实也就相当于说让后者存在于前者的原型链上。

```
function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    // 通过这一步 继承父类的实例属性
    Person.call(this,hobbies);
}
    
// //通过这一步将父类的原型直接赋值给子类的原型，减少了父类的调用次数
// Men.prototype = Person.prototype;

// 通过 setPrototypeOf设置Men.prototype的__proto__为Person.prototype
Object.setPrototypeOf(Men.prototype , Person.prototype)

Men.prototype.menHobbies = function(){
    console.log(this.hobbies);
}

var p1 = new Person(['money']);
p1.menHobbies(); // Uncaught TypeError: p1.menHobbies is not a function


var men1 = new Men(['money','sleep']);
men1.menHobbies(); // ['money','sleep']


```

这样做就可以保证子类的原型跟父类的原型不是直接关系，而是通过子类的`__proto__`做的关联，因为`__proto__`是不建议访问的，所以子类就无法修改父类的原型。

#### 缺点
- 缺点应该就是`Object.setPrototypeOf`是`ES6`的方法。兼容性不好。而且MDN说它会引起性能问题。建议我们使用`Object.create()`。


### 六) 组合继承优化3

那我们就是用`Object.create()`来改写上述的优化。

> 创建一个新对象，使用现有对象来提供将新对象的`__proto__`。其实也就是将现有对象赋值给新对象的`__proto__`。


```
function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    // 通过这一步 继承父类的实例属性
    Person.call(this,hobbies);
}
    

// 通过 Object.create设置Men.prototype的__proto__为Person.prototype
Men.prototype = Object.create(Person.prototype);

Men.prototype.menHobbies = function(){
    console.log(this.hobbies);
}

var p1 = new Person(['money']);
p1.menHobbies(); // Uncaught TypeError: p1.menHobbies is not a function


var men1 = new Men(['money','sleep']);
men1.menHobbies(); // ['money','sleep']

```

由于`Object.create`也有兼容性问题(但是比Object.setPrototypeOf兼容好)，如果我们对`Object.create`进行polyfill。

```
// Object.create() polyfill

function createProto(obj){
    // 由于Object.create就是将当前传入的对象赋值给新对象的__proto__ 
    // 创建一个构造函数F。默认的F的实例的__proto__指向F.prototype
    // F.prototype赋值为传入的对象
    // 此时F的实例的__proto__指向为传入的对象

    // 因此里完成了Object.create的功能
    //1.创建一个新对象
    //2.将新对象的__proto__赋值为当前传入的对象

    function F(){};
    F.prototype = obj;
    return new F;
}

```

### 七) 组合继承优化4

```
function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    Person.call(this,hobbies);
}
    
// 这里通过实现Object.create() 来使Men.prototype的__proto__的值为Person.prototype
Men.prototype = createProto(Person.prototype);

Men.prototype.menHobbies = function(){
    console.log(this.hobbies);
}

var p1 = new Person(['money']);
p1.menHobbies(); // Uncaught TypeError: p1.menHobbies is not a function


var men1 = new Men(['money','sleep']);
men1.menHobbies(); // ['money','sleep']
```

### 八)寄生组合式继承

其实寄生组合继承就是在组合继承的基础上，不必为了指定子类型的原型而调用父类的的构造函数。而是使用一个中间值`__proto__`来指向父类的原型。

其实也就是组合继承优化4：

```
function Person(hobbies){
    this.hobbies = hobbies;
}
Person.prototype.getHobbies = function(){
    console.log(this.hobbies);
}

function Men(hobbies){
    Person.call(this,hobbies);
}
// !!!重点
inheritPrototype(Men,Person);

Men.prototype.menHobbies = function(){
    console.log(this.hobbies);
}

var p1 = new Person(['money']);
p1.menHobbies(); // Uncaught TypeError: p1.menHobbies is not a function


var men1 = new Men(['money','sleep']);
men1.menHobbies(); // ['money','sleep']


/**
*@desc 设置子类原型的__proto__为父类的原型
*@child  子类
*@parent 父类
**/
function inheritPrototype(child,parent){
    function F(){};
    F.prototype = parent.prototype;
    child.prototype = new F;
    child.prototype.constructor = child;
}

```

### ES6中的class继承
