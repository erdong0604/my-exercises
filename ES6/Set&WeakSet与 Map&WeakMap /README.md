

## Set

#### 简介

`Set` 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。

用于创建一个`Set`类型的数据。这个数据类似于数组，但是成员都是唯一的，没有重复的值。


#### 基本使用

```
let set = new Set([1,2,3]); 
console.log(set); // Set(3) {1, 2, 3}
```

`JavaScript`中规定，`Set`必须通过`new`调用。否则将抛出错误。

```
let set = Set([1,2,3]); // TypeError: Constructor Set requires 'new'
```

调用`Set`时，可以传入参数，但是这个参数只能是可迭代的对象，并且会把这个可迭代对象中的相同的值去重。如果不指定此参数，或者其值为`null`，则返回一个空的`Set`数据。

```
let set = new Set(1); // TypeError: number 1 is not iterable 

let set = new Set([1,1,2,2,3,3]);// Set(3) {1, 2, 3}
```
`Set`对象上有`size`属性，返回当前`Set`对象集合中元素的数量。

#### 方法

**add**

完`Set`对象中添加元素。并返回该对象。类似于数组的`push`方法。

```
let set = new Set();
let sym = Symbol('a');
let o = {
    a:1
};
set.add(1);
set.add([1,2,3]);
set.add(false);
set.add(null);
set.add(NaN);
set.add(undefined);
set.add(o);
set.add(sym);
```

`Set`对象中可以添加任意类型的数据。包括基本类型，引用类型，`Symbol`类型，`Set`类型等等。

**has**

返回一个布尔值，表示指定的值是否在`Set`对象中存在。

```
cnosole.log(set.has(o)); // true

set.has([1,2,3]); // false 这里的[1,2,3]与上面的[1,2,3]不是同一个对象

```

**delete**

删除`Set`对象中与指定值相等的元素。也是返回布尔值。但是这个结果跟`has`有关。
如果`Set`对象就有这个元素，则返回`true`。如果没有这个元素，则返回`false`。

```
console.log(set.delete(o));// true
console.log(set.delete(2)); // false
```

**clear**

清空`Set`对象中的所有元素。

```
set.clear();
console.log(set);  // Set(0) {}

```

**entries**

返回一个新的迭代器对象，该对象包含`Set`对象中所有元素的值组成的`[key,value]`类数组。为了使这个方法与`Map`对象保持一致，这里的`key`和`value `相同，也就是`[value,value]`。

```
let set = new Set();
set.add(1);
set.add(false);
set.add([1]);
    
for(let item of set.entries()){
    console.log(item)
}

// [1,1]
// [false,false]
// [[1],[1]]
```

**keys**

返回一个新的迭代器对象，该对象中包含了`Set`对象中所有的元素的值。上面提到过`Set`对象元素的`key`与`value`相同。

```
for(let item of set.keys()){
    console.log(item)
}

// 1
// false
// [1]
```

**values**

与`keys`用法相同，返回结果也是一致。

```
for(let item of set.values()){
    console.log(item)
}

// 1
// false
// [1]
```



#### 遍历

**forEach**

循环`Set`对象，跟数组的`forEach`使用类似。

```
set.forEach((value,key) => {
    console.log(value + ':' + key)
});
// 1-1
// false-false
// [1]-[1]
```

**for...of...**

```
for(let key of set){
    console.log(key)
}
// 1
// false
// [1]
```

#### 使用场景

**数组去重**

```
let arr = [1,2,1,2,3,4,3,4,3];
        
var o1 = {
    a:1
};
var o2 = {
    a:2
}
var o3 = {
    a:3
}
let arr1 = [o1,o2,o1,o2,o3,o3];

let set = new Set(arr);
let set1 = new Set(arr1);

console.log(set);
//Set(4) {1, 2, 3, 4}

console.log(set1);
// Set(3) { 
	{ a:1 },
	{ a:2 },
	{ a:3 }
}

```

由于`Set`对象是个类数组，去重之后我们还需要把`Set`对象转换为数组。使用展开运算符`...`或者`Array.from`方法。

```
console.log([...set]); // [1, 2, 3, 4]

console.log(Array.from(set1)) // [ {a:1},{a:2},{a:3} ]

```

封装数组去重方法:

```

function unique(arr){
    return [...new Set(arr)]
}

let arr = [3, 5, 2, 2, 5, 5];
console.log(unique(arr)); // [3, 5, 2]
```


## WeakSet

#### 简介

`WeakSet`对象跟`Set`对象一样都是用来储存值的。但是`WeakSet`只能储存引用类型的值。


#### 基本使用

```
let arr = [1,2,3];
let set = new WeakSet();
set.add(arr);
console.log(set); // WeakSet {[1,2,3]}

```

只能储存一个引用类型的值。
```
set.add(1);  //TypeError: Invalid value used in weak set
```

储存的引用类型为弱引用。不参与垃圾回收机制计算。

```
let o = {
    a:1
}

let set = new WeakSet();

set.add(o);

o = null; // 即使WeakSet对象集合中还保持着对象o的引用，这里也会触发垃圾回收机制对{a:1}进行回收。

```


#### 方法

下列方法与`Set`对象中使用方法一致。

**add**

往`WeakSet`对象集合中添加值。

**delete**

删除`WeakSet`对象集合中的元素。

**has()**

判断`WeakSet`对象集合中是否存在指定的元素


#### 遍历

由于`WeakSet`储存的都是对象的引用，所以即使它引用一个对象，这个对象仍然会被垃圾回收。因此它不知道这个对象到底还存不存在。所以它是不可遍历的。

#### 使用场景

可以用来储存对象，由于是弱引用，因此不会造成内存泄漏。


```
let set = new WeakSet();
class Foo{
    constructor(){
        set.add(this);
    }
    methods(){
        if(!set.has(this)){
            throw new TypeError('Can only be called on an instance');
        }
        // dosoming
    }
}

```


### Set 与 WeakSet的区别

相同：

1. 都是用来储存值。

区别：

1. `Set`可以储存任意类型的值，而`WeakSet`只能储存引用类型的值。
2. `WeakSet`储存的对象都是弱引用。
3. `Set`可以枚举，`WeakSet`是不可枚举的。
4. `Set`有`size`属性，`WeakSet`没有。


## Map

#### 简介
`Map`对象也是用来储存值，但是它与`Set`的区别是它储存的是键值对。

#### 基本使用

```
let map = new Map();

map.set('a',1);
map.set('b',2);

console.log(map);

{
    0:['a',1],
    1:['b',2],
    size:2
}

```

它的键和值可以是任意类型:

```
let map = new Map();
let str = 'abc';
let o = {
    a:1
}
let sym = Symbol();

map.set(str,'这是一个String类型');
map.set(o,'这个key是Object类型');
map.set(sym,'这个key是Symbol类型')

console.log(map);

```

#### 方法

**set(key,value)**

设置`Map`对象键的值。如果该键存在，则覆盖之前的值，若不存在，则在`Map`对象尾部添加一个键值对。

```
let map = new Map();

map.set('1',2);

map.set('a',{a:1});

console.log(map);
{
    0:[1,2],
    1:['a',{a:1}],
    size:2
}

```

**get(key)**

通过键获取对应的值，如果不存在，则返回`undefined`。

```
let map = new Map();

map.set('a',{a:1});

console.log(map.get('a')); // {a: 1}

console.log(map.get('b')); // undefined

```

**has(key)**

返回一个布尔值，用来检测`Map`对象是否包含指定的键。

``` javascript
let map = new Map();

map.set('a',{a:1});

console.log(map.has('a')); // true
    
console.log(map.has('b')); // false

```

**delete(key)**

移除指定`key`的元素。如果存在，则移除它并返回`true`，如果不存在则返回false。删除后再调用`has`方法，则返回`false`。

```javascript
let map = new Map();

map.set('a',{a:1});

console.log(map.has('a')); // true

console.log(map.delete('a')); // true
    
console.log(map.delete('b')); // false

console.log(map.has('a')); // false
```

**clear()**

移除`Map`对象中的所有键/值对。

```javascript
let map = new Map();

map.set('a',{a:1});
map.set('b',{b:1});
map.clear();
console.log(map);  // {}

```

**entries()、keys()、values()**

`entries()`返回一个迭代器对象，它的每个元素为`[key,value]`组合。

`keys()`返回一个迭代器对象，它的每个元素为`Map`对象中元素的`key`。

`values()`返回一个迭代器对象，它的每个元素为`Map`对象中元素的`value`。


```javascript

let map = new Map();
map.set('a',{a:1}).set('b',{b:1}).set('c',{c:1})
    
for(let key of map.entries()){
    console.log(key)
}
// [a,{a:1}]
// [b,{b:1}]
// [c,{c:1}]


for(let key of map.keys()){
    console.log(key)
}
// a
// b
// c


for(let key of map.values()){
    console.log(key)
}
// {a: 1}
// {b: 1}
// {c: 1}

```

#### 循环

```
let map = new Map();
map.set('a',{a:1}).set('b',{b:1}).set('c',{c:1})
    
map.forEach((value,key) => {
    console.log(value,key);
})
//{a: 1} "a"
//{b: 1} "b"
//{c: 1} "c"
```

#### 使用场景



## WeakMap

#### 简介

`WeakMap`对象和`Map`对象一样，都是储存一对键值对`[key,value]`。

但是`WeakMap`对象不同的是`key`值必须是引用类型。

### Map与WeakMap的区别

相同：

1. 都是储存一对键值对

区别：

1. `Map`对象的键值可以是任意值，而`WeakMap`对象键值只能是引用类型。
2. `Map`对象可以循环，而`WeakMap`不可以。
3. `Map`对象有`size`属性，而`WeakMap`对象没有。
4. `MapMap`对象的`key`是弱引用，而`Map`对象里的`key`不是

