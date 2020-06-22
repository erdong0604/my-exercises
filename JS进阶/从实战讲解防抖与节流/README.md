## 前言

最近看到各种面经，防抖节流好像从来没有缺席过。虽然在项目中也使用过，但我对它俩的一直是


![](https://user-gold-cdn.xitu.io/2020/5/30/17265eb700fb188f?w=200&h=200&f=png&s=31430)


这次一定要把它俩给安排的明明白白的


![](https://user-gold-cdn.xitu.io/2020/5/30/17265eca512f251f?w=500&h=500&f=png&s=106518)


## 防抖(Debounce)

### 概念

字面意思是防止抖动。在程序中就是为了防止在一定时间内重复执行一段代码(函数)。

在函数被触发n秒后再执行，如果在n秒内又有函数执行，则重新计算。

### 🌰

有一个输入框，用户输入用户名，然后向后端请求接口，获取该用户名是否存在。

一般的做法是当输入框失焦时再去请求接口判断。但是这样体验不好，如果是用户输入的内容实时的反馈结果，这样有利于用户体验。

当用户输入内容实时反馈结果代码如下：

``` javascript

// 输入框
<input type="text" id="input"/>
let ipt = document.getElementById('input');

// 用户输入内容实时反馈结果
ipt.addEventListener('input',function(){
    let val = this.value;
    handleSendPhone(val);
});

// 请求接口
function handleSendPhone(val){
    ajaxRequest({
        user:val
    }).then(res => {
        console.log(res)
    })
}



//模拟数据
let items = ['abc','aaa','bbb','ccc','ddd'];
//模拟ajax请求
function ajaxRequest({user}){
    return new Promise((resolved,rejected) => {
        setTimeout(() => {
            let res = items.includes(user)?'正确':'错误';
            resolved(res);
        },500)
    });
}

```

![](https://user-gold-cdn.xitu.io/2020/5/30/17265de331cc63f1?w=718&h=546&f=gif&s=430802)


上述gif图中左侧为用户输入内容，右侧为请求接口。很明显当用户输入内容时就会请求接口这种做法是不妥的，会造成资源上的浪费。

防抖的条件为函数在频繁执行时。刚好对应我们上面的需求：频繁请求接口。

那现在就轮到防抖上场了。

![](https://user-gold-cdn.xitu.io/2020/5/30/17265de331ce0c86?w=255&h=255&f=jpeg&s=5191)

### 实现思路

给定函数执行时间间隔为n，若 n 秒内没有函数再次执行，则执行该函数。若 n 秒内函数再次执行，则重新计算函数被执行的时间。

第一版：

利用setTimeout将传入的函数延迟执行，在延迟执行到达之前，如果函数又被执行，则清除定时器，让setTimeout重新计时。因此函数执行的条件为，在setTimeout计时结束前，传入的函数没有被再次执行，这时传入的函数就会执行。

```javascript
/**
* @fn : 要执行的函数
* @delay : 执行执行函数的时间间隔
*/ 

function debounce(fn,delay){
	let timer; // 定时器
	return function(...args){ // 形成闭包
	    timer&&clearTimeout(timer); // 当函数再次执行时，清除定时器，让定时器重新开始计时
	
	    // 利用定时器，让指定函数延迟执行。
	    timer = setTimeout(function(){
	        // 执行传入的指定函数
	        fn();
	    },delay)
	}
}

```

上述实现防抖函数并未实现传参和this绑定。

第二版：

``` javascript
/**
* @fn : 要执行的函数
* @delay : 执行执行函数的时间间隔
*/ 

function debounce(fn,delay){
    let timer; // 定时器
    return function(...args){ // 形成闭包  外部执行的函数其实是这个return出去的函数。
    
        // args 为函数调用时传的参数。
        
        let context = this; // this 为函数执行时的this绑定。

        timer&&clearTimeout(timer); // 当函数再次执行时，清除定时器，让定时器重新开始计时

        // 利用定时器，让指定函数延迟执行。
        timer = setTimeout(function(){
            // 执行传入的指定函数，利用apply更改this绑定和传参
            fn.apply(context,args);
        },delay)
    }
}
```

### 使用

``` javascript
// 输入框
<input type="text" id="input"/>
let ipt = document.getElementById('input');

let handler = debounce(handleSendPhone,500);
//handler：debounce执行后return的函数。

ipt.addEventListener('input',function(){
    let val = this.value;
    handler(val);
});

// 请求接口
function handleSendPhone(val){
    ajaxRequest({
        user:val
    }).then(res => {
        console.log(res)
    })
}

```

### 对比效果

![](https://user-gold-cdn.xitu.io/2020/5/30/17265de3328a769b?w=662&h=276&f=gif&s=477308)

上述对比中，加入防抖后的代码，在连续的输入内容时，并不会连续执行请求，而是在**上次输入和下次输入间隔一定的时间才会执行**请求。
这样对比就很明显了，在不影响业务需求的情况下，防抖可以避免资源浪费。




### 立即执行版

通过上述防抖后的gif图我们可以看到，当用户连续输入内容时并不会返回结果，而是要满足我们的执行间隔时才会执行。

这样的效果如果有细(刁)心(钻)的产品的话，他应该不希望是这样，他会希望当用户输入时立即请求接口反馈结果，然后再等到输入间隔满足我们的间隔时间时再执行。

思路：

那就需要我们上面的防抖函数在调用时就执行一次。相比较刚才的防抖，立即执行版防抖只是多了一步立即执行。

代码实现：

``` javascript
/**
* @fn : 要执行的函数
* @delay : 执行执行函数的时间间隔
* @immediate : 是否立即执行函数 true 表立即执行，false 表非立即执行
*/        

function debounce(fn,delay,immediate){

    let timer; // 定时器
 
    return function(...args){ // 形成闭包  外部执行的函数其实是这个return出去的函数。
        
        // args 为函数调用时传的参数。
        
        let context = this; // this 为函数执行时的this绑定。

        timer&&clearTimeout(timer); // 当函数再次执行时，清除定时器，让定时器重新开始计时

        // immediate为true 表示第一次触发就执行
        if(immediate){
            // 执行一次之后赋值为false  
            immediate = false;
            fn.apply(context, args)
        }
        // 利用定时器，让指定函数延迟执行。
        timer = setTimeout(function(){
            // immediate 赋值为true  下次输入时 还是会立即执行
            immediate = true;
            // 执行传入的指定函数，利用apply更改传入函数内部的this绑定，传入 args参数
            fn.apply(context,args);
        },delay)
    }
}

```

对比效果：

![](https://user-gold-cdn.xitu.io/2020/5/30/17265de336d3f163?w=662&h=276&f=gif&s=463910)


其实防抖很好理解。比如说当我们乘坐电梯时，当有人进入电梯时，电梯门会开，然后倒计时关上门。当持续不断的人进入电梯时，电梯就不会过指定的时间关上门。而是当有一个人进入时，电梯开始倒计时关门时间，再有一个人进入时，重置倒计时。直到倒计时完没有人进入电梯，则关门。这里就是我们所说的防抖。这里持续不断的人就是频繁触发的函数，这里的关门就是我们最后要执行的函数。倒计时关门时间就是我们要执行函数的间隔。 

## 节流(Throttle)

### 概念

连续触发函数时，在规定单位时间内只会触发一次。


### 🌰

产品经理向你走了过来...... ： 刚才的效果我还不满意，再改改。我：您说改成什么样(心里:*!@#$%^&%*)。产品经理：刚才的效果，如果用户一直连续输入必须要等不输入时才能得到结果。现在改成用户每输入几个字符时就请求一次接口。

上面说了节流就是函数连续触发时，在规定的时间间隔内就会触发一次。当用户连续输入时，每过n秒，请求一次接口。变相的相当于用户每输入几个字符就请求一次接口。


### 实现思路

如果函数持续触发，则让函数延迟执行，如果在延迟执行期间，函数还在触发，则无效。直到函数延迟执行结束，方可进行下一次函数延迟执行。

### 基本版

```javascript

/**
* @fn : 要执行的函数
* @delay : 每次执行函数的时间间隔
*/  
function throttle(fn,delay){
    let timer;    // 定时器

    return function(...args){
        let context = this;
        // 如果timer存在，说明函数还未该执行 也就是距离上次函数执行未间隔指定的时间
        if(timer) return;
        // 如果函数执行之后还有函数还在触发，再延迟执行。
        timer = setTimeout(function(){
            // 当函数执行时，让timer为null。
            timer = null;
            fn.apply(context,args);
        },delay);
    }
}

```

### 使用

``` javascript
<input type="text" id="input"/>

let ipt = document.getElementById('input');

let handler = throttle(handleSendPhone,1000);

ipt.addEventListener('input',function(){
    let val = this.value;
    handler(val);
});

// 请求接口
function handleSendPhone(val){
    ajaxRequest({
        user:val
    }).then(res => {
        console.log(`请求结果为：${res}`)
    })
}
```

### 对比效果：

![](https://user-gold-cdn.xitu.io/2020/5/30/17265de356d34080?w=662&h=276&f=gif&s=405567)

### 基本版问题

上面的基本版节流还是有很大问题的，比如最后一次不会执行，第一次总是输出字符串的第一位。

效果如下：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gg0xoj2tvug30h006m75a.gif)

按照图中所输入的值，我们肯定期望输出的是`aaaa`, `aaaaaa`。

### 升级版

#### 思路

用现在的时间减去上次执行函数时的时间如果大于规定的时间间隔，就可以认为可以执行当前函数。

即：` currTime - prevTime > delay ` 。

``` javascript

/**
* @fn : 要执行的函数
* @delay : 每次执行函数的时间间隔
*/  
function throttle(fn,delay){
    let timer; 
    let prevTime; // 记录上一次执行的时间
    return function(...args){
        let currTime = Date.now(); // 获取当前时间时间戳
        let context = this;
        if(!prevTime) prevTime = currTime; // 第一次执行时prevTime赋值为当前时间
        
        clearTimeout(timer); // 每次都清除定时器，保证定时器只是在最后一次执行
        
        if(currTime - prevTime > delay){ // 如果为true ，则表示两次执行函数的时间间隔为delay.
            prevTime = currTime;
            fn.apply(context,args);
           	clearTimeout(timer); // 清除定时器。用来处理假如函数停止调用时刚好函数也停止执行，不需要获取后续的值。 详见下面定时器的介绍。
            return;
        }
	
	  // 当上面执行currTime - prevTime > delay 为false时，执行定时器。
	  // 用来处理：假如下次函数执行时间未到，函数不继续调用了，会造成最后一次函数执行 到 最后一次函数调用之间的值获取不到。
        timer = setTimeout(function(){
            prevTime = Date.now();
            timer = null;
            fn.apply(context,args);
        },delay);
    }
}

```

### 升级版效果

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gg0y5maak0g30hs074dgu.gif)




## 总结
* 防抖和节流在一定程度上相似，都是为了节省资源。提升用户体验。
* 防抖是在函数触发时延迟指定的时间执行，如在延迟过程中函数又被触发，则重新计算执行时间。
* 节流是在函数连续触发时，在规定的时间内只会执行一次。
* 直白一点就是防抖控制次数，节流控制频率


## 应用

* 防抖

	根据输入框的内容来请求接口，返回结果。如果实时请求接口就会造成资源上的浪费。就需要假设用户输入完成时， 再去请求接口，比如设置时间间隔为1s，当用户在间隔1s后还未输入，则认为他是输入完成，当1s到达之前又输入了字符，则重新间隔1s请求接口。
	
* 节流

	在一个页面中实时计算某个元素到窗口顶部的距离时，需要监听滚动条变化，然后计算元素坐标然后处理一些逻辑。监听滚动条变化时不用实时去计算元素位置，而是利用节流，比如300ms计算一次，这样可以避免频繁执行一些代码。还可以避免使用了`offsetHeight`,引起过多的重绘。


## 最后

如果文中有错误，请务必留言指正，万分感谢。

点个赞哦，让我们共同学习，共同进步。








