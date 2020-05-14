## call

> call 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数

举个例子：

```
var value=1;
function foo(x,y) {
    console.log(this.value)
}
var obj={
    value: 2
}
foo(); // 1 
foo.call(obj,3,4);  // 2
```

上述例子中，当foo函数单独调用时内部this绑定为全局对象window。当通过call方法调用时this被绑定为call方法中的第一个参数。call方法中的除了第一个参数外的剩余参数为foo函数的实参。

特点：

1. 改变this执行。
2. 执行调用call方法的函数。

## apply

上述例子也可以用apply来改写：

```
var value=1;
function foo(x,y) {
    console.log(this.value)
}
var obj={
    value: 2
}
foo(); // 1 
foo.apply(obj,[3,4]);  // 2
```
apply与call的唯一区别就是：调用apply方法时的参数，实参应该是以数组的形式来书写。

## bind

> bind 方法创建一个新的函数，也可以说是当前调用bind方法的函数的一个引用，这个函数的this被绑定为bind方法的第一个参数，其余参数为这个新函数的实参。

还是以上述代码为例：

```
var value=1;
function foo(x,y) {
    console.log(this.value)
}
var obj={
    value: 2
}
var bar=foo.bind(obj,3,4);
bar(); // 2
```

bind与call，apply的区别就是：bind方法不会立即调用函数，它只是改变了新函数的this绑定。

当我们使用bind方法创建一个新函数，这个新函数再使用call或者apply来更改this绑定时，还是以bing绑定的this为准。

```
var value=1;
function foo(x,y) {
    console.log(this.value)
}
var obj={
    value: 2
}
var o={
    value: 3
}
var bar=foo.bind(obj,3,4);
bar.call(o); // 2
```

## 区别

相同点：

1. 都会更改this的绑定

不同点：

1. call和apply会立即执行函数，bind不会。
2. apply方法的传参格式为数组，call和bind不是。

## call的实现

怎样来实现call呢？先想想call的特点：

第一个参数为要绑定的this，剩余参数为函数的实参。

那我们怎样改更改this的绑定呢？

我们直到当我们以 `对象 . 方法` 调用一个普通函数时，this始终指向当前调用的对象。

```
var value=1;
function foo(x,y) {
    console.log(this.value)
}
var obj={
    value: 2
}
foo.call(obj,3,4);  // 2

// 相当于
obj.foo(3,4);
``` 

思路：

1. 将函数作为要更改this绑定的对象的一个属性。也就是把函数作为call方法中第一个参数中的一个属性。
2. 通过 `对象 . 方法` 执行这个函数。
3. 返回当前函数执行后的结果。
4. 删除该对象上的属性。

call的第一个参数还有几个特点：

1. 当第一个参数(要更改的this绑定的对象)为null或者undefined时，this绑定为window(非严格模式)。如果为严格模式，均为第一个参数的值。
2. 当call方法中第一个参数为除null和undefined外的基本类型(String，Number，Boolean)时，先对该基本类型进行"装箱"操作。

```
/**
 * @description: 实现call方法
 * @param : context this要绑定的值
 * @param : args 除第一个参数外的参数集合
 * @return: 函数返回值
 */
Function.prototype.myCall=function(context,...args) {
    let handler=Symbol();// 生成一个唯一的值，用来作为要绑定对象的属性key，储存当前调用call方法的函数
    if(typeof this!=='function') {
        //调用者不是函数

        throw this+'.myCall is not a function'
    }
    // 如果第一个参数为引用类型或者null
    if(typeof context==='object'||typeof context==='function') {
        // 如果为null 则this为window
        context=context||window;
    } else {
        // 如果为undefined 则this绑定为window
        if(typeof context==='undefined') {
            context=window;
        } else {
            // 基本类型包装  1 => Number{1}
            context=Object(context);
        }
    }

    // this 为当前调用call方法的函数。
    context[handler]=this;
    // 执行这个函数。这时这个函数内部this绑定为cxt，储存函数执行后的返回值。
    let result=context[handler](...args);
    // 删除对象上的函数
    delete context[handler];
    // 返回返回值
    return result;
}
```
上述call的实现只支持大部分场景，比如要绑定的对象为冻结对象，则会抛出错误。

[可以查看中文版的 call ES规范 15.3.4.4](http://yanhaijing.com/es5/#323)
## apply的实现

由于apply跟call的唯一区别只是除了第一个参数外其余参数的传递形式不一样。在实现call的基础上略作修改就可以了。

call参数的特点：

1. 除第一个参数外，其余参数必须为数组的形式。
2. 如果第二个参数存在

 	2.1  如果第二个参数为null或者undefined，则无效。
 	2.2 如果第二个参数类型不是Object，则抛出一个异常。如果不是数组，则无效。
 	
```
/**
 * @description: 实现apply方法
 * @param : context this要绑定的值
 * @param : argsArr 要传递给调用apply方法的函数的实参集合。数组形式。
 * @return: 函数返回值
 */
Function.prototype.myApply=function(context,argsArr) {
    let handler=Symbol();// 生成一个唯一的值，用来作为要绑定对象的属性key，储存当前调用call方法的函数
    if(typeof this!=='function') {
        //调用者不是函数

        throw this+'.myBind is not a function'
    }
    let args=[];
    // 如果传入的参数是不是数组，则无效
    if(typeof argsArr==='object'||typeof context==='function'||typeof argsArr==='undefined') {
        args=Array.isArray(argsArr)? argsArr:[];
    } else {
        // 如果为基本类型，如果是undefined，则无效，其它类型则抛出错误。
        throw 'TypeError: CreateListFromArrayLike called on non-object'
    }
    // 如果第一个参数为引用类型或者null
    if(typeof context==='object') {
        // 如果为null 则this为window
        context=context||window;
    } else {
        // 如果为undefined 则this绑定为window
        if(typeof context==='undefined') {
            context=window;
        } else {
            // 基本类型包装  1 => Number{1}
            context=Object(context);
        }
    }

    // this 为当前调用call方法的函数。
    context[handler]=this;
    // 执行这个函数。这时这个函数内部this绑定为cxt，储存函数执行后的返回值。
    let result=context[handler](...args);
    // 删除对象上的函数
    delete context[handler];
    // 返回返回值
    return result;
}
```


[可以查看中文版的 apply ES规范 15.3.4.3](http://yanhaijing.com/es5/#323)

## bind的实现

bind与call和apply区别还是很大的。
先看一个例子：

```
var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
    console.log(this.name+':'+age+'岁');
}

var bar=foo.bind(obj,'chen');
bar(18); // erdong:18岁


var b=new bar(27); // undefined:27岁
console.log(b.age); // 27
```

综合上述例子，我们总结一下bind方法特点：

1.调用bind方法会创建一个新函数,我们成它为绑定函数(boundF)。

2.当我们直接调用boundF函数时，内部this被绑定为bind方法的第一个参数。

3.当我们把这个boundF函数当做构造函数通过new关键词调用时，函数内部的this绑定为新创建的对象。(相当于bind提供的this值被忽略)。

4.调用bind方法时，除第一个参数外的其余参数，将作为boundF的预置参数，在调用boundF函数时默认填充进boundF函数实参列表中。

<!--bind方法中第一个参数的特点：

1. 当第一个参数(要更改的this绑定的对象)为null或者undefined时，this绑定为window(非严格模式)。
2. 当call方法中第一个参数为除null和undefined外的基本类型(String，Number，Boolean)时，先对该基本类型进行"装箱"操作。-->

我们根据上述的bind方法的特点，一步一步实现bind方法。

```
// 第一步  返回一个函数
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;

    let boundF =  function() {
    }
    return boundF;
}

```
第一步我们实现了myBind方法返回一个函数。没错就是这就是利用了闭包。

```
// 第二步 
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;

    let boundF=function() {
        thisFunc.call(context,...args);
    }
    return boundF;
}
```

第二步：当调用boundF方法时，原函数内部this绑定为bind方法的第一个参数，这里我们利用了call来实现。

```
// 第三步
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    let boundF=function() {
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...args);
    }
    return boundF;
}
```
第三部：先判断boundF是否通过new调用，也就是判断boundF内部的this是否为boundF的一个实例。如果是通过new调用，boundF函数的内部this绑定为当前新创建的对象，因此调用call方法时把当前新创建的对象当做第一个参数传递。


```
// 第四步
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    let boundF=function() {
        let boundFAgrs=arguments;
        let totalAgrs=[...args,...arguments];
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...totalAgrs);
    }
    return boundF;
}
```
第四部：通过闭包的特性我们知道，boundF函数可以访问到外部的args变量，将它与boundF函数中的参数合并。然后当做调用原函数的参数。


到此我们简易版的bind已经显示完毕，下面测试：

```
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    let boundF=function() {
        let boundFAgrs=arguments;
        let totalAgrs=[...args,...arguments];
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...totalAgrs);
    }
    return boundF;
}
var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
    console.log(this.name+':'+age+'岁');
}

var bar=foo.myBind(obj,'chen');
bar(18); // erdong:18岁


var b=new bar(27); // undefined:27岁
console.log(b)
console.log(b.age); // 27

```
我们发现上述代码中调用myBind跟bind方法输出的结果一致。

其实bind方法还有一个特点。

看例子：

```
var obj={
    name: 'erdong'
}
	
function foo(name,age) {
    this.age=age;
}
foo.prototype.say=function() {
    console.log(this.age);
}
var bar=foo.bind(obj,'chen');

var b=new bar(27);
b.say();


```




通过上述例子我们发现，通过new(新函数)创建的对象 b 。它可以获取原函数原型上的方法。因为我们实现的myBind，b是通过新函数创建的，它跟原函数理论上来说并没有什么关系。

再来看：

```

var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
}

var bar=foo.bind(obj,'chen');

var b=new bar(27);

console.log(b instanceof foo); // true
console.log(b instanceof bar); // true
```

它的原型链上出现了foo.prototype和bar.prototype。按照我们的常规理解 b 的原型链为：

```
b.__proto__ => bar.prototype => bar.prototype.__proto__ => Object.prototype

```

但是跟foo.prototype有什么关系呢？

我个人的理解：

foo函数调用bind方法产生的新函数bar，这个函数不是一个真正的函数，mdn解释它为`怪异函数对象`。我们通过`console.log(bar.prototype)`发现
输出的值为undefined。我们暂且把它理解成一个foo函数的一个`简化`版。可以形象的理解成`foo  == bar`。


通过我们上面实现的myBind并不能达到让新对象b跟原函数和新函数的原型都产生关系。

```
var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
}

var bar=foo.myBbind(obj,'chen');

var b=new bar(27);

console.log(b instanceof foo); // fasle
console.log(b instanceof bar); // true

```

这是我们就需要对我们的myBind进行迭代升级：

```
// 迭代一
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;

    let boundF=function() {
        let boundFAgrs=arguments;
        let totalAgrs=[...args,...arguments];
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...totalAgrs);
    }
    // 调用myBind方法的函数的prototype赋值给 boundF 的prototype。
    boundF.prototype=thisFunc.prototype;
    return boundF;
}
```

在我们myBind实现中bar函数其实就是boundF函数，因此把原函数的原型赋值给新函数的原型，这时创建的对象就会跟原函数的原型有关系。


这时b的原型链就会变成：

```
b.__proto__ => bar.prototype => foo.prototype => foo.prototype.__proto__ => Object.prototype
```

这时b的原型链上就会出现 bar.prototype 和 foo.prototype。

```
var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
}

var bar=foo.myBbind(obj,'chen');

var b=new bar(27);

console.log(b instanceof foo); // true
console.log(b instanceof bar); // true

```

我们在实现里把foo的原型直接赋值给bar的原型。由于引用地址相同，所以改变bar原型的时候foo的原型也会改变。

```
var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
}

var bar=foo.myBbind(obj,'chen');
bar.prototype.aaa = 1;
console.log(bar.prototype.aaa); // 1
var b=new bar(27);

console.log(b instanceof foo); // true
console.log(b instanceof bar); // true
```
这样是不合理的，我们继续迭代：

```
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;

    let boundF=function() {
        let boundFAgrs=arguments;
        let totalAgrs=[...args,...arguments];
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...totalAgrs);
    }
    var F=function() {};
    F.prototype=thisFunc.prototype;
    boundF.prototype=new F();
    return boundF;
}

```

这里我们声明了一个函数F，让它的prototype的值为foo的prototype。再让boundF的prototype的值赋值为F的实例。利用原型链继承，来让原函数与新函数的原型之间没有直接关系。 这个时候b的原型链为：

```
b.__proto__ => bar.prototype => new F() => new F().__proto__ => F.prototype => thisFunc.prototype => thisFunc.prototype.__proto__ => Object.prototype
```

综上最终版：

```
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个新函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    // 如果调用bind的变量不是Function类型，抛出异常。
    if(typeof thisFunc!=='function') {
        throw new TypeError('Function.prototype.bind - '+
            'what is trying to be bound is not callable');
    }
    // 定义一个函数boundF
    // 下面的”新函数“ 均为函数调用bind方法之后创建的函数。
    let boundF=function() {
        // 这里的 arguments 为函数经过bind方法调用之后生成的函数再调用时的实参列表
        let boundFAgrs=arguments;
        // 把调用bind方法时除第一个参数外的参数集合与新函数调用时的参数集合合并。当做参数传递给call方法
        let totalAgrs=[...args,...arguments];
        // 判断当前新函数是否是通过new关键词调用
        let isUseNew=this instanceof boundF;
        // 如果是->把call方法第一个参数值为当前的this(这里的this也就是通过new调用新函数生成的新对象)
        // 如果否->把调用bind方法时的传递的第一个参数当做call的第一个参数传递

        thisFunc.call(isUseNew? this:context,...totalAgrs);
    }
    //通过原型链继承的方式让原函数的原型和新函数的原型，都在通过new关键词构造的新对象的原型链上
    // b instanceof 原函数  -> true
    // b instanceof 新函数  -> true
    var F=function() {};
    F.prototype=thisFunc.prototype;
    boundF.prototype=new F();

    return boundF;
}
```
[可以查看中文版的 bind ES规范 15.3.4.5](http://yanhaijing.com/es5/#323)

### 实现软绑定

什么是软绑定？我们知道通过bind可以更改this绑定为bind方法的第一个参数(除了new)。绑定之后就无法改变了。我们称bind绑定this为硬绑定。

```
// bind
var o={
    name: 'erdong'
}
var o1={
    name: "chen"
}
var foo=function() {
    console.log(this);
}
var bar=foo.bind(o);

var obj={
    foo: bar
}
bar(); //  this => o
bar.call(o1); // this => o
obj.foo(); // this => o


```

上述例子中，当foo函数通过bind绑定this为o，再通过call或者对象.方法的形式调用时，this始终被绑定为o。无法被改变。当然这里我们不考虑new(通过new调用的话，this不绑定为o)。那么我们怎样再调用bar函数时，还能动态的修改this的绑定呢？

```
// softBind
var o={
    name: 'erdong'
}
var o1={
    name: "chen"
}
var foo=function() {
    console.log(this);
}
var bar=foo.softBind(o);

var obj={
    foo: bar
}
bar(); //  this => o
bar.call(o1); // this => o1
obj.foo(); // this => obj
```

其实这里的实现softBind的原理跟实现myBind的原理类似。

这里我们在myBind源代码中更改：

```
Function.prototype.softBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    // 如果调用bind的变量不是Function类型，抛出异常。
    if(typeof thisFunc!=='function') {
        throw new TypeError('Function.prototype.bind - '+
            'what is trying to be bound is not callable');
    }
    // 定义一个函数boundF
    // 下面的”新函数“ 均为函数调用bind方法之后创建的函数。
    let boundF=function() {
        // 这里的 arguments 为函数经过bind方法调用之后生成的函数再调用时的实参列表
        let boundFAgrs=arguments;
        // 把调用bind方法时除第一个参数外的参数集合与新函数调用时的参数集合合并。当做参数传递给call方法
        let totalAgrs=[...args,...arguments];
        
        // 如果调用新函数时存在新的this，并且新的this不是全局对象，那么我们认为这里想要更改新函数this的绑定。因此让新函数的内部this绑定为当前新的this。
        
        thisFunc.call(this && this !== window ? this : context,...totalAgrs);
    }
    //通过原型链继承的方式让原函数的原型和新函数的原型，都在通过new关键词构造的新对象的原型链上
    // b instanceof 原函数  -> true
    // b instanceof 新函数  -> true
    var F=function() {};
    F.prototype=thisFunc.prototype;
    boundF.prototype=new F();

    return boundF;
}


```

这时我们用softBind再输出一下上面的例子：

```
var o={
    name: 'erdong'
}
var o1={
    name: "chen"
}
var foo=function() {
    console.log(this);
}
var bar=foo.softBind(o);

var obj={
    foo: bar
}
bar(); //  this => o
bar.call(o1); // this => o1  这里如果上面使用bind  这里的this还是被绑定为o  
bar.call(); // this => o1   这里如果上面使用bind  这里的this还是被绑定为o  

obj.foo(); // this => obj   这里如果上面使用bind  这里的this还是被绑定为o  

```
这时达到了我们期望的输出。

重点就在这一句：

`thisFunc.call(this && this !== window ? this : context,...totalAgrs);`

### 面试题

看下述代码：

```
function func(){
    console.log(this);
}
func.call(func);     //输出func
func.call.call(func); //输出window
```

看到这里我们肯定对 func.call(func); 输出什么很清楚了。

但是 func.call.call(func);  这样有输出什么呢？ 

我们一步一步拆解来看

```
func.call.call(func);

// 此时 func.call 内部的this为 func。
// 这里是在上一步代码的基础上执行的
// 此时func.call的内部this被绑定为func
// 但是此时又执行了func.call();

func.call(); 
// 由于call中没有参数，因此func的内部this被绑定为window

```

如果此时把 `func.call.call(func)`结合我们的源码实现来看，会很容易理解。

