
## 懒加载定义

图片懒加载其实就是延迟加载。也就是不用一次性加载所有的图片，等到用户需要某张图片的时候再加载，这样可以避免在同一时间请求大量的数据。也就是当图片滚动到可视区域的时候再去加载图片。

## 指令

`Vue`中除了平时常用的`v-show，v-bind`等指令外，还可以自定义指令。由于自定义指令过于简单，这里只是大致说一下用得到的钩子函数的作用。

* `bind`：只调用一次，指令绑定到元素时调用，可以用来初始化。
* `inserted`：被绑定的元素插入到父节点时调用。

## 实现

在`component`文件夹中新建`LazyLoad`文件夹，在文件夹里新建`index.js`。

代码如下：

``` javascript
const LazyLoad = {
    // install方法
    install(Vue,options){
    	  // 代替图片的loading图
        let defaultSrc = options.default;
        Vue.directive('lazy',{
            bind(el,binding){
                LazyLoad.init(el,binding.value,defaultSrc);
            },
            inserted(el){
                // 兼容处理
                if(IntersectionObserver){
                    LazyLoad.observe(el);
                }else{
                    LazyLoad.listenerScroll(el);
                }
                
            },
        })
    },
    // 初始化
    init(el,val,def){
        // data-src 储存真实src
        el.setAttribute('data-src',val);
        // 设置src为loading图
        el.setAttribute('src',def);
    },
    // 利用IntersectionObserver监听el
    observe(el){
        let io = new IntersectionObserver(entries => {
            let realSrc = el.dataset.src;
            if(entries[0].isIntersecting){
                if(realSrc){
                    el.src = realSrc;
                    el.removeAttribute('data-src');
                }
            }
        });
        io.observe(el);
    },
    // 监听scroll事件
    listenerScroll(el){
        let handler = LazyLoad.throttle(LazyLoad.load,300);
        LazyLoad.load(el);
        window.addEventListener('scroll',() => {
            handler(el);
        });
    },
    // 加载真实图片
    load(el){
        let windowHeight = document.documentElement.clientHeight
        let elTop = el.getBoundingClientRect().top;
        let elBtm = el.getBoundingClientRect().bottom;
        let realSrc = el.dataset.src;
        if(elTop - windowHeight<0&&elBtm > 0){
            if(realSrc){
                el.src = realSrc;
                el.removeAttribute('data-src');
            }
        }
    },
    // 节流
    throttle(fn,delay){
        let timer; 
        let prevTime;
        return function(...args){
            let currTime = Date.now();
            let context = this;
            if(!prevTime) prevTime = currTime;
            clearTimeout(timer);
            
            if(currTime - prevTime > delay){
                prevTime = currTime;
                fn.apply(context,args);
                clearTimeout(timer);
                return;
            }

            timer = setTimeout(function(){
                prevTime = Date.now();
                timer = null;
                fn.apply(context,args);
            },delay);
        }
    }

}

export default LazyLoad;

```

## 使用

在`main.js`里添加



``` javascript

import LazyLoad from './components/LazyLoad';

Vue.use(LazyLoad,{
    default:'https://tva1.sinaimg.cn/large/007S8ZIlgy1gfyof9vr4mj3044032dfl.jpg'
});

```
在组件中使用

```
<img v-lazy="https://tva1.sinaimg.cn/large/007S8ZIlgy1gfynwi1sejj30ij0nrdx0.jpg" />
```

## 最终效果

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gg17a1wzq5g30820e2u0z.gif)

## 代码地址

[https://github.com/erdong0604/demo/tree/master/vue-demo/v-lazy](https://github.com/erdong0604/demo/tree/master/vue-demo/v-lazy)


## 最后

如果文中有错误，请务必留言指正，万分感谢。

点个赞哦，让我们共同学习，共同进步。