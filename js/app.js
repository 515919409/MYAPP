//初始化

(function () {
    //阻止默认行为
    var app = document.querySelector('#app');
    app.addEventListener('touchstart', function (e) {
        e.preventDefault();
    });

    //恢复 a 链接可点功能
    var links = document.querySelectorAll('a');

    //forEach 是一个方法 用来遍历数组
    // link 为当前正在遍历的元素
    links.forEach(function (link) {
        link.addEventListener('touchstart', function () {
            //使用 JS 来进行页面跳转
            location.href = this.href;
        });
    });

    //设置 html font-size 的值
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 16 + 'px';
    window.addEventListener('resize', function () {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 16 + 'px';
    });
}());

//顶部代码交互
(function () {
    //h获取菜单元素
    var menu = document.querySelector('.pindao');
    var menuList = document.querySelector('.menus');
    var app = document.querySelector('#app');
    //绑定 touchstart 事件
    menu.addEventListener('touchstart', function (e) {
        //显示菜单
        // menuList.style.display = 'block';
        menuList.classList.toggle('open');
        //调整按钮的背景
        menu.classList.toggle('close')
    });

    //input元素触摸获得焦点
    var input = document.querySelector('.search input');

    input.addEventListener('touchstart', function (e) {
        //获得焦点
        e.stopPropagation();
        // this.style.background = 'white';
        // this.focus();
    });

    app.addEventListener('touchstart', function () {
        //input丧失焦点
        input.blur();
    });

}());

//导航条
/**
 1. 可拖拽
 2. 惯性移动
 通过滑动速度  ->  滑动惯性位移  -> 在原来的基础上加上该位移
 3. 回弹
 贝塞尔曲线  transition
 4. 橡皮筋
 边界外的情况下, 包裹元素的移动位移为手指滑动位移的 1 / 2
 5. 可点击
 touchend
 */
(function () {
    //获取元素
    var nav = document.querySelector('#nav');
    var navList = document.querySelector('#nav .nav-list');
    var lis = navList.querySelectorAll('li');
    var isMoving = false;

    //绑定事件
    nav.addEventListener('touchstart', function (e) {
        //获取触点的起始位置
        this.x = e.targetTouches[0].clientX;
        this.left = transformCSS(navList, 'translateX');
        //移除过渡
        navList.style.transition = 'none';
        //获取触摸的时间
        this.startTime = Date.now();
    });

    //触摸移动
    nav.addEventListener('touchmove', function (e) {
        this._x = e.targetTouches[0].clientX;
        //计算新的left的值
        var translateX = this._x - this.x + this.left;
        //手指划过的距离
        var disX = this._x - this.x;
        //判断是否越界
        var maxTranslateX = 0;
        var minTranslateX = -(navList.offsetWidth - nav.offsetWidth);
        //检测是否越界了
        // 100   0.9   90
        // 150   0.8   120
        // 200   0.7  140
        // 250   0.6  150
        // 300   0.5  150
        // 350   0.4  140
        // 400   0.3  120
        if (translateX >= maxTranslateX) {
            // translateX = disX / 3;
            var scale = 1 - translateX / (nav.offsetWidth * 2);
            translateX *= scale;

        }
        if (translateX <= minTranslateX) {
            var size2 = disX / 3;
            // var size3 = navList.offsetWidth;
            // var size4 = nav.offsetWidth;
            translateX = minTranslateX + size2;
            console.log(translateX);
        }
        //设置 translateX 位移
        transformCSS(navList, 'translateX', translateX);
        //修改状态变量
        isMoving = true;
        e.stopPropagation();
    });

    //触摸结束
    nav.addEventListener('touchend', function (e) {
        //获取当前的navList 的 translateX
        var translateX = transformCSS(navList, 'translateX');
        //判断是否越界
        var maxTranslateX = 0;
        var minTranslateX = -(navList.offsetWidth - nav.offsetWidth);

        //计算速度
        //计算位移
        this._x = e.changedTouches[0].clientX;
        var disX = this._x - this.x;
        //获取时间
        this.endTime = Date.now();
        var disTime = this.endTime - this.startTime;
        var speed = disX / disTime;// speed    ===>     s
        //计算惯性移动的位移
        var distance = speed * 100;
        translateX += distance;
        //声明变量
        var transition = 'transform .4s';
        //越界检测
        if (translateX >= maxTranslateX) {
            translateX = maxTranslateX;
            transition = 'transform .4s cubic-bezier(.06,.77,.07,1.59)';
        }
        if (translateX <= minTranslateX) {
            translateX = minTranslateX;
            transition = 'transform .4s cubic-bezier(.06,.77,.07,1.59)';
        }
        navList.style.transition = transition;
        transformCSS(navList, 'translateX', translateX);
        //修改状态变量的值
        isMoving = false;
    });

    //遍历绑定事件
    lis.forEach(function (li) {
        li.addEventListener('touchend', function () {
            //判断状态变量
            if (isMoving) return;

            //所有 li移除 active 类
            lis.forEach(function (item) {
                item.classList.remove('active');
            });

            //当前的 li 设置 active
            this.classList.add('active');
        });
    });
}());

//轮播图
(function () {
    var swiper = new Swiper('#swiper');
}());

//内容区
(function () {
    //内容导航区
    // 1.元素获取
    //获取所有的 floor
    var floors = document.querySelectorAll('.floor');
    floors.forEach(function(floor){
        var nav = floor.querySelector('nav');
        var navItems = nav.querySelectorAll('.nav-item');
        var movedBorder = nav.querySelector('.moved-border');
        var swiperSlides = floor.querySelectorAll('.swiper-slide');
        var mvs = floor.querySelector('.mvs');
        //2.绑定事件 导航点击切换
        navItems.forEach(function (item, key) {
            //为元素设置索引
            item.index = key;
            item.addEventListener('touchstart', function () {
                /**
                 * inde   0    1    2   3      index
                 * left   0    100  200 300     navItem.offsetWidth*index
                 */
                    //如何获取当前点击元素在同辈元素中的索引
                    // var index = this.index;
                    //计算边框的left 的值 // 3. 计算当前 移动边框的具体位置
                var left = navItems[0].offsetWidth * this.index;
                //设置
                movedBorder.style.left = left + 'px';
                //切换幻灯片
                swiper.swiperContainer.switchSlide(this.index);
            });
        });
        //MV内容轮播
        var swiper = new Swiper(mvs, {
            loop: false,
            auto: false,
            pagination: false,
            callback: {
                start: function () {
                    // console.log('start');
                },
                move: function(){

                },
                end: function () {
                    //幻灯片切换完成之后  设置边框的位置
                    var index = swiper.getIndex();
                    var left = navItems[0].offsetWidth * index;
                    //设置
                    movedBorder.style.left = left + 'px';

                    //检测当前的显示的幻灯片是否已经加载
                    //获取当前标签的 isloaded 属性
                    var isloaded = parseInt(swiperSlides[index].dataset.isloaded);
                    //如果没有加载数据  则填充数据  向服务器发送 ajax 请求, 获取数据 填充
                    if (!isloaded) {
                        //模拟延时  .......
                        setTimeout(function () {
                            var html = swiperSlides[0].innerHTML;
                            swiperSlides[index].innerHTML = html;
                            swiperSlides[index].dataset.isloaded = 1;
                        }, 2000)
                    }
                }
            }
        });
    });
}());

//内容区滚动效果
(function () {
    var touchscroll = new Touchscroll('#app', '#main');
    // var header = document.querySelector('#header');
    // console.log(header);
    // header.addEventListener('touchstart', function(e){
    //     e.stopPropagation();
    // });
}());