## new

>`new` 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

emmmm 看不懂？

> `new` 创建一个对象。

这次懂了吧~~~

**进入正题**

我们已经说了关于`new`操作符的定义，想要去实现一个new。那么我们首先要清除new操作符具体做了什么。它可不仅仅是创建一个对象那么简单。

```
function Person() {
    this.name='erdong';
    this.age='27';
}
Person.prototype.sayHello=function() {
    console.log('hellow');
}
var person = new Person();
console.log(p.name); // erdong
p.sayHello(); // hello

```

看上述例子：

通过new操作符后面跟构造函数，可以执行该构造函数并且创建一个对象 p。我们称这个 p 为 Person 的一个实例。这时Person内部的 this 绑定为当前的实例 p 。这时我们再去看上面关于 new 操作符的定义，就看得懂了。

总结一下实例p的特点：

1. 实例p为构造函数Person内部this要绑定的对象。
2. 实例p可以访问构造函数Person.prototype上的属性。

总结一下 new 操作符到底做了什么：

1. 创建一个空的简单的对象(即 { })
2. 将该对象的`__proto__`指向构造函数的prototype对象
3. 将构造函数上下文中的this绑定为当前创建的对象(实例)
4. 函数默认返回this(也就是当前实例)，如果有显示返回：如果显示返回一个对象(除null外)，函数则返回这个对象。否则返回默认值(实例)。

我们声明一个函数myNew来代替原生的new。使用方法如下：

```
function myNew() {
    // ......
}
var m=myNew(F,a,b,c);

// F 为构造函数 m 为通过 myNew 创建的实例。a,b,c为要传给构造函数的参数。
```
根据上面的步骤，我们一步一步实现new。

```
// 第一步
function myNew(func,...args) {
    var obj=new Object();
    return obj;
}

// 第二步

function myNew(func,...args) {
    var obj=new Object();
    obj.__proto__=func.prototype;
    return obj;
}

//第三步

function myNew(func,...args) {
    var obj=new Object();
    var res=func.apply(obj,args);
    obj.__proto__=func.prototype;
    return obj;
}

// 第四步

function myNew(func,...args) {
    var obj=new Object();
    obj.__proto__=func.prototype;
    var res=func.apply(obj,args);

    if(res&&(typeof res==='object'||typeof res==='function')) {
        return res;
    }

    return obj;
}
```

最终版：

```
/**
 * @description: 实现new操作符
 * @param : func 构造函数
 * @param : args 要传给构造函数参数集合(数组)
 * @return: 对象(实例)
 */
function myNew(func,...args) {
    if(typeof func!=='function') {
        // 调用myNew方法的不是一个函数
        // 抛出异常 func 不是一个构造器
        throw 'TypeError: '+func+' is not a constructor'
    }

    // 根据第一步 创建一个空对象。
    var obj=new Object();
    // 根据第二步 将对象的__proto__指向构造函数的prototype
    obj.__proto__=func.prototype;
    //根据第三步 将构造函数上下文中的this绑定为当前创建的对象(利用apply实现)
    var res=func.apply(obj,args);
    // 根据第四步 如果构造函数中显示返回一个对象(除null外)，则通过调用myNew返回该对象
    if(res&&(typeof res==='object'||typeof res==='function')) {
        return res;
    }
    // 如果构造函数中未显示返回值，或者返回的值不是一个对象，则返回默认值(也就是创建的新对象)
    return obj;
}
```
测试：

```
function Person(name,age) {
    this.name=name;
    this.age=age;
}
Person.prototype.sayHello=function() {
    console.log('hellow');
}
var p=myNew(Person,'erdong','27');
console.log(p.name); // erdong
p.sayHello();  // hellow
```

到此 new 的实现已经完成。

思路：

当你要实现某个功能时，首先要分析这个功能需要做什么或者是做了什么，拆分成尽可能小的步骤，一步一步去实现它。