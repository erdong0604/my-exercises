/*
 * @Description: 数组常用方法
 * @Author: chenM
 * @Date: 2020-04-08 11:58:22
 */



/*
 * @description: Array.of(ele,ele1,...)
 * @param : 任意个参数
 * @return: []
 */

/*
// 如果原生不支持的话，在其他代码之前执行以下代码会创建 Array.of() 。
if (!Array.of) {
  Array.of = function() {
    return Array.prototype.slice.call(arguments);
  };
}
console.log(Array.of(111))
let a = Array(111);
console.log(a); // [empty × 111]
console.log(a[0]); // undefined
*/


/*
 * @description: Array.from(arrayLike,mapFn,thisArg) 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
 * @param : arrayLike 想要转换成数组的伪数组对象或可迭代对象。
 * @param : mapFn 如果指定了该参数，新数组中的每个元素会执行该回调函数。
 * @param : thisArg 可选参数执行会掉函数mapFn时的this对象。
 * @return: 数组
 */
/*
 * 类数组：拥有一个length属性和若干索引的属性的任意对象
 * 可迭代对象：可以获取对象中的元素,如 Map和 Set 等
 */ 

/*
console.log(Array.from('foo')); // ["f", "o", "o"]

//Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。
const set = new Set(['foo', 'bar', 'baz', 'foo']); //去重
console.log(Array.from(set)); // ["foo", "bar", "baz"] 

//Map 对象保存键值对，能记住键值对原始插入位置，任何值都可以作为一个键或者一个值 map.set(1,1) Map(1) {1 => 1}
const map = new Map([[1,1],[2,2],[3,3],[4,4]]);
console.log(Array.from(map)); //[[1,1],[2,2],[3,3],[4,4]]

function fn(a) {
    console.log(Array.from(arguments)); //[1]
}
fn(1);
*/

/*
 * @description: arr.pop()方法从数组中删除最后一个元素，返回删除的元素，改变原数组
 * @param : 
 * @return: 删除的元素
 */

/*
var arr = [1,2,3,4,5,6,7,8,9,10];
console.log(arr.pop()); // 10
console.log(arr); // [1,2,3,4,5,6,7,8,9]
*/

/*
 * @description: push()方法往数组后追加一个或多个元素，返回当前数组长度，改变原数组
 * @param : 
 * @return: length
 */

/*
var arr = [1];
console.log(arr.push(1,2,3,4,5)); // 6
console.log(arr); //[1,1,2,3,4,5]
*/

/*
 * @description: reverse()方法会使数组中的元素颠倒，返回当前数组，改变原数组
 * @param : 
 * @return: 改变后数组
 */

/*
var arr = [1,2,3,null,undefined];
console.log(arr.reverse()); // [undefined, null, 3, 2, 1]
console.log(arr); // [undefined, null, 3, 2, 1]
*/

/*
 * @description: shift() 从数组中删除第一个元素，返回删除的元素，改变原数组
 * @param : 
 * @return: 删除的元素
 */

/*
 var arr = ['a',2,3,4];
 console.log(arr.shift()); // a
 console.log(arr); // [2,3,4];
 */

/*
 * @description: unshift()往数组前面插入一个或多个元素，返回当前数组的长度，改变原数组
 * @param : 
 * @return: 当前数组的长度
 */

/*
 var arr = [1];
 console.log(arr.unshift(1,2,3)); //4
 console.log(arr); // [1,2,3,1]
 */

/*
 * @description: sort([comparefn])方法用原地算法对数组的元素进行排序，并返回数组，改变原数组，默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的
 * @param: comparefn 用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的Unicode位点进行排序。
 * @return:当前数组
 */ 
/*
 var arr = ['red','blue','yellow','black'];
 console.log(arr.sort()); //["black", "blue", "red", "yellow"]
 console.log(arr); //["black", "blue", "red", "yellow"]

 var arr1 = [11,23,3,43,666];
 console.log(arr1.sort()); //[11, 23, 3, 43, 666]
 console.log(arr1); //[11, 23, 3, 43, 666]

//从小到大排序
arr1.sort((a,b) => {
    return a-b;  // 大于0 b放在a的前面  小于0 a放在b的前面
});
 console.log(arr1); // [3, 11, 23, 43, 666]

//从大到小排序
arr1.sort((a,b) => {
    return b-a; // 大于0 b放在a的前面  小于0 a放在b的前面
});
console.log(arr1); // [666, 43, 23, 11, 3]
*/

/*
 * @description: copyWithin(target[, start[, end]])方法浅复制数组的一部分到当前数组的另一个位置，返回当前数组，改变原数组，不会改变数组的长度
 * @param : target 复制到的位置 如果为负数 从末尾开始
 * @param : start 被复制的开始位置 如果为负数 从末尾开始 如果被忽略默认为0
 * @param : end  被复制的结束位置 如果为负数 从末尾开始 如果被忽略默认为 arr.length
 * @return: 改变后的当前数组
 */

 /*
 var arr = [1,2,3,4,5];

//  console.log(arr.copyWithin(-1)); // 相当于 arr.copyWithin(-1,0,5) -1表示最后一位 -2表示倒数第二位

 console.log(arr.copyWithin(0,2,4)); // [3, 4, 3, 4, 5] 把3，4复制到0的位置 为了保持数组长度不变 所1的位置也被替换

 var arr1 = [{a:1},{b:2},{c:3},{d:4}];
 console.log(arr1.copyWithin(0,1,2));
 arr1[1].b=222;
 console.log(arr1); //[{b:222},{b:222},{c:3},{d:4}]
 */

 /*
  * @description: fill(value[, start[, end]])方法会用一个value填充到数组start位置到end位置 不包括end位置 不会改变数组的长度
  * @param : value 用来填充数组的值  默认undefined
  * @param : start 起始索引 默认为0
  * @param : end 结束索引 默认为arr.length
  * @return: 改变后的数组
  */
/*
  var arr = [1,2,3,4,5];
//   console.log(arr.fill('a')); // ['a','a','a','a','a'] 相当于 arr.fill('a',0,6)
//   console.log(arr) // ['a','a','a','a','a'];

// console.log(arr.fill('a',1,3)); // [1, "a", "a", 4, 5]  把数组第1位和第2位填充为a 不包括第3位
// console.log(arr) // [1, "a", "a", 4, 5]

console.log(arr.fill('a',0,6)); // [1, "a", "a", 4, 5]  把数组第1位和第2位填充为a 不包括第3位
console.log(arr) // [1, "a", "a", 4, 5]
*/


/*
 * @description: concat(value1[, value2[, ...[, valueN]]]) 把两个或多个数组合并成一个数组，不会改变现有数组，返回一个新的数组
 * @param : valueN 将要合并的数组 浅拷贝合并
 * @return: 合并后的新数组
 */
/*
var arr = [1,2,3,4];
var arr1 = ['a','b','c'];
var arr2 = [{a:1},{b:2}];

var arr3 = arr.concat(arr1);
console.log(arr3); // [1, 2, 3, 4, "a", "b", "c"]
var arr4 = arr.concat(arr1,arr2);
console.log(arr4) // [1, 2, 3, 4, "a", "b", "c",{a:1},{b:2}]
*/

/*
 * @description: join(separator)方法将一个数组或者类数组对象通过一个特定的字符串连接成一个字符串，并返回当前字符串，不会改变当前数组
 * @param : separator 特定字符串 默认为','
 * @return: 拼接后的字符串
 */
/*
 var arr = ['red','blue','yellow','black'];
 console.log(arr.join('&')); // red&blue&yellow&black
 */

/*
 * @description: slice([begin[, end]])返回一个由当前数组的begin位置到end位置元素浅复制组成的数组 不包括end位置的元素，不改变当前数组
 * @param : begin 开始索引 如果省略默认为0  如果为负数则倒着数
 * @param : end 结束索引 如果省略默认数组的末尾  如果大于数组的length 也是末尾
 * @return: 新数组
 */

 /*
 var arr = [1,2,3,4,5];

 console.log(arr.slice(2,5)); // [3, 4, 5]

//浅复制 是指当对象的被复制时，只是复制了对象的引用，指向的依然是同一个对象
var arr1 = [{a:1},{b:2},{c:3},{d:4}];
var arr2 = arr1.slice(0,1); // [{a:1}]
arr2[0].a = 111;
console.log(arr1) // [{a:111},{b:2},{c:3},{d:4}];
*/

/*
 * @description: toString()返回一个字符串，表示指定的数组及其元素。
 * @param : 
 * @return: 字符串
 */
/*
var arr = [1,2,3,4];
console.log(arr.toString()); // '1,2,3,4'

var arr1 = [{a:1},{b:2}];
console.log(arr1.toString()); '[object Object],[object Object]'
*/

/*
 * @description: indexOf(searchElement,fromIndex)方法返回一个指定元素在当前数组中第一次出现的位置 
 * @param : searchElement 要查找的元素
 * @param : fromIndex 要查找的位置 如果为负数则倒着数 如果省略则默认整个数组
 * @return: 被查找元素的位置索引  查不到为-1
 */

/*
var arr = [1,2,3,4,5];
console.log(arr.indexOf(2)); // 1
console.log(arr.indexOf(2,-2)); // -1 这表示从第3位开始查找 
console.log(arr.indexOf(2,-8)); // 1 因为8大于当前数组的长度 所以还是查找整个数组
*/

/*
 * @description: lastIndexOf(searchElement,fromIndex)方法返回一个指定元素在当前数组中第最后一次出现的位置 
 * @param : 
 * @return: 
 */

//使用方式同上


/*
 * @description: includes(valueToFind,fromIndex)方法用来判断一个数组中是否包含一个指定的值，如果有则返回true，否则返回false
 * @param : valueToFind 要查找的值
 * @param : fromIndex 从fromIndex索引位置开始查找，如果fromIndex大于或等于数组的长度则会返回false切该数组不会被搜索，如果为负数则fromIndex = arr.length+fromIndex; 如果计算后fromIndex还是负数则查找整个数组
 * @return: boolean
 */

/*
var arr = [1,2,3,4,5];
console.log(arr.includes(1)); // true fromIndex省略默认为0 则也就是查找整个数组
console.log(arr.includes(1,1)); // false 从第一位向后查找
console.log(arr.includes(1,-3)); // false fromIndex=5+(-3)=2 则从第二位开始查找 
console.log(arr.includes(3,-3)); // true fromIndex=5+(-3)=2 则从第二位开始查找 
console.log(arr.includes(1,-100)); // true fromIndex=5+(-100)=-95 则查找整个数组
*/

/*
 * @description: forEach(callback(currentValue,index,array),thisArg)方法对数组的每个元素执行一次给定的函数。
 * @param : callback数组中每个元素执行的函数，该函数接收三个参数 currentValue:当前元素，index：当前元素的索引，array：正在操作的数组
 * @param : thisArg 执行callback时的this指向
 * @return: undefined
 */
/*
var arr = [1,2,3,4];
arr.forEach(function (item,index,array){
    console.log(item,index,array,this);
})

arr.forEach(function (item,index,array){
    console.log(item,index,array,this);
},{a:1})
*/

/*
 * @description: every(callback,thisArg)方法测试一个数组中所有元素能否通过某个指定函数的测试  
 * @param : callback 执行的函数
 * @return: boolean
 */

/*
var arr = [1,2,3,4,5];

let isBelow = arr.every((item,index) => item < 5); //判断数组中的每一项都小于5 因为最后一个=5 所以是false
console.log(isBelow)
let isBelow1 = arr.every((item,index) => item < 6); //判断数组中的每一项都小于6 因为都小于6 所以为true
console.log(isBelow1)
*/

/*
 * @description: some(callback,thisArg)方法测试一个数组中至少有一个元素通过某个指定函数的测试 与every相反
 * @param : callback 执行的函数
 * @return: boolean
 */

/*
var arr = [{a:1},{a:2},{a:10},{a:20}];

var isBelow = arr.some((item,index) => item.a > 10); // 判断数组中每一项的a属性是否至少有一个大于10   所有返回true
console.log(isBelow)
*/
/*
 * @description: filter(callback,thisArg)方法返回一个新数组 ，其值包括通过指定函数测试的值
 * @param : 
 * @return: 新数组
 */

/*
 var arr = [1,2,3,4,5,6,7,10];

var arr1 = arr.filter((item,index) => item > 2);
console.log(arr1); // [3, 4, 5, 6, 7, 10]

var arr1 = arr.filter((item,index) => item > 20);
console.log(arr1); // []  查不到则为返回空数组
*/

/*
 * @description: map(callback,thisArg)方法返回一个新数组，其值是该数组中每个元素执行一个特定函数返回后的值
 * @param : 
 * @return: 一个新数组
 */
/*
 var arr = [1,2,3,4,5,6];

 var arr1 = arr.map((item,index) => item*item);
 console.log(arr1) //  [1, 4, 9, 16, 25, 36]
 */

/*
 * @description: reduce(callback(accumulator,currentValue,index,array),initialValue)数组中每一项通过执行指定的函数，返回累计处理的结果
 * @param : callback 执行的函数 accumulator 每次累计的值默认为数组的第一项  如果initialValue有值则为initialValue  currentValue当前计算的值 index当前值得索引 
 * @param : initialValue 初始化累计的值
 * @return: 函数累计处理的结果
 */ 

/*
var arr = [1,2,3,4,5];

var sum = arr.reduce((sum,item) => {
    return sum + item;
});
console.log(sum); // 1+2+3+4+5 = 15;

var sum = arr.reduce((sum,item) => {
    
    return sum - item;
});
console.log(sum);  // 1-2-3-4-5 = -13;

var sum = arr.reduce((sum,item) => {
    return sum - item;
},10);
console.log(sum);  // 10-1-2-3-4-5 = -5;
*/

/*
 * @description: entries()方法返回一个新的Array Iterator对象，该对象包含数组中每个索引的键/值对
 * @param : 
 * @return: 
 */

/*
 * @description: find(callback,thisArg)方法返回数组中第一个通过指定函数测试的元素
 * @param : 
 * @return: 当前元素
 */
/*
var arr = [1,2,3,4,5];

var result = arr.find((item,value) => item > 3);
console.log(result); // 寻找当前数组的中大于3的第一项
*/

/*
 * @description: flat(depth)方法会按照一个指定的深度递归遍历数组，并将元素和遍历到的子数组中的元素合并成一个数组，返回新数组
 * @param : depth 指定要提取嵌套数组的结构深度，默认值为 1。 Infinity，可展开任意深度的嵌套数组
 * @return: 展开后的新数组
 */

/*
 var arr = [1,2,3,[3,2,1],[4,5,6,[4,5,6]]]
console.log(arr.flat(1));  // [1, 2, 3, 3, 2, 1, 4, 5, 6,[4,5,6]]
*/

/*
 * @description: flatMap()方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 map 连着深度值为1的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些
 * @param : 
 * @return: 
 */
var arr = [1,2,3,4,5]

var arr1 = arr.flatMap((item,index) => [item*2]); //  [2, 4, 6, 8, 10]
var arr2 = arr.map((item,index) => [item*2]); //  [[2], [4], [6], [8], [10]]
console.log(arr1)
console.log(arr2)
