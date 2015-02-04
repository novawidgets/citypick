#Listpick

用于移动端的一个全屏选择的控件

## 使用方法

该组件是多个组件功能的组合。具体功能需参考相关的组件。

### Javascript
需先引入依赖的文件：Zepto基础库、iscroll、handlebars、nova框架、suggest、elevator、scrollTips、pagePanel

```markup
<script type="text/javascript" src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script type="text/javascript" src="http://s8.qhimg.com/static/d4aff7543340dbc3/iscroll-probe.js"></script>
<script type="text/javascript" src="http://s4.qhimg.com/static/207b47645b84a5cd/handlebars-v1.3.0.js"></script>
<!-- combo (suggest_1.0.2,pagePanel_1.0.0,elevator_1.0.0,scrollTips_1.0.0,citypick_1.0.0) -->
<script type="text/javascript" src="http://s2.qhimg.com/static/3912f0d9f4504523/listpick.js"></script>
<script type="text/javascript">
    var cityPanel = $('.listpick-panel');
    var citypick = new Listpick({
        list: cityList,
        groupList: list,
        element: cityPanel,
        needSuggest: true,
        itemTemplateFun: Handlebars.compile($('.item-template', cityPanel).html()),
        suggTemplateFun: Handlebars.compile($('.sugg-template', cityPanel).html())
    });
</script>
```
### CSS
```markup
引入通用样式，再加一些自定义样式。例：
<link rel="stylesheet" type="text/css" href="http://s0.qhimg.com/static/65ecd5c25c42f710/listpick.css">
<style type="text/css">
    .listpick-panel .city-curr,
    .listpick-panel .list-wrap .item-hot dt {
        display: -webkit-box;
        -webkit-box-align: center;
        display: flex;
        align-items: center;
    }
    .listpick-panel .city-curr {
        line-height: 28px;
    }
    .listpick-panel .city-curr::before{
        content: "";
        display: block;
        width: 15px;
        height: 20px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAoCAYAAADpE0oSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1QTk4QThCNTAyNzJFMzExOUU0QkJBQjhBNUU1NEVCNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGRjU4OTY1ODgzMzExMUUzQjRFN0RGQzdFQUE5MTQ5RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGRjU4OTY1NzgzMzExMUUzQjRFN0RGQzdFQUE5MTQ5RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpkOGZmYWY0Zi05NGI2LTQ0NTItYjNjOS00MzQ1ODlkMmZiNDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUE5OEE4QjUwMjcyRTMxMTlFNEJCQUI4QTVFNTRFQjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5W7GSlAAACmElEQVR42rSXPWhUQRSF3+ZnEcQkhSZ9/MFCRQMW2idBgxZGURAsBBcSRW39i2AUCxuNZFUCdkFQBBFTiCBaqoVILFYI2gREs2BMobiuxnPkPNDl7dyZl30HPljevXPPG97OzJ1coVCIPNQK+kEv2Aq6QYdi8+A9eAWegMfgp1WwxYiz+EkwDFbVyekS28BxUAbj4KpeKlFNDtMDoATOO0yTtFJjSqrhbdwMiuCOZpJWXapRVE2nMRPugqGocRpSzWaXMb/LnqjxYs1r9Yz3g2NRdjoqj/+M+e8di7LXWLwMY2MumU6PgVwqp8EmsExsBiOKWeqU11/jvNappftgDbgMpsEP8QaMgtXKsUSvPI37PNYpC+4DXx05C8qxzOnVFxu7NAcOg0WP2Swq97OR10/jHiPpumbjqwUtS5d6aLzOSHqY4t/7yIivpXG7kVRKYfzOiLc3ZbRe80Y8R+MvRtL6FMbdRnyexjNG0u4UxgNGfIbGL4wk7t9tAaZt8e7k0EsaT3lsc7f5XTxMc8q1tt8pGj9Tz+TSoM7UFY4cxu4p16UP4CmNf4MrHrPZqxc8BTaoAVwOtoCzig161LkEfuXUZbLpe62CWYp7wkZQjddxFRwClQxNY49qbQfCGZ/L0PiCeu/EnovfejID0wfgoqvZ47F2xGNth4i1DtYeq0l79XddV6YbYMoau8A335sEO42dYHYJprOqMRd6heHAHfUGejSFzhe3jsW36qNClllFm43zU/mcx891C/TVCY2JlmpM3dI+bIk5N30KhnQgw0bTXvbsz4ONy9rgXZt/OQvjSHfdTwnP+exGSKFQY/5jJxKeT+g6k5lxPOtKzcsUQ4ukMf5Yc5BM6lmQWqJ0OgO2//M7WH8EGAD/oIZimAzpXwAAAABJRU5ErkJggg==) no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
        margin-left:-20px;
        margin-right: 5px;
    }
    .listpick-panel .list-wrap .item-hot dt::before{
        display: block;
    }
    .listpick-panel .list-wrap .item-hot dt::after{
        content: "门城市";
    }
</style>
```

### html
```markup
<div class="listpick-panel page-panel" style="display: none;">
    <div class="input-wrap">
        <div class="input-box">
            <form class="input-form">
                <input type="text" placeholer="请输入城市名称"/>
            </form>
            <button type="button" style="display: none;">X</button>
        </div>
    </div>
    <div class="list-wrap">
        <div class="item-wrap">
            <div class="item-location list-item">
                <div class="city-curr">当前城市：<span class="cp-location sugg-item-cont"></span></div>
                <button type="button" class="panel-cancel">取消</button>
            </div>
            <div class="item-data">
                <div class="item-scroller">
                    <div class="item-hot"></div>
                    <div class="item-list"></div>
                </div>
                <ul class="item-elevator"></ul>
                <div class="item-tip"></div>
            </div>
        </div>
        <div class="suggest-wrap">
            <div class="sugg-list"></div>
        </div>
    </div>
    <script type="text/x-handlebars-template" class="item-template">
        {{#each list}}
            <dl>
                <dt class="list-item" data-key="{{@key}}">{{@key}}</dt>
                {{#each this}}
                    <dd class="list-item sugg-item sugg-item-cont">{{this.name}}</dd>
                {{/each}}
            </dl>
        {{/each}}
    </script>
    <script type="text/x-handlebars-template" class="sugg-template">
        <ul>
            {{#each list}}
                <li class="list-item sugg-item">
                    <div class="sugg-item-cont">{{this.name}}</div>
                    <div class="sugg-item-copy"></div>
                </li>
            {{/each}}
        </ul>
    </script>
</div>
```

## 配置

```javascript
var config = {
    needSuggest: true, // 是否开启suggest功能
    needElevator: true, // 是否开启导航条
    needScrollTip: true, // 是否开启当前定位提示框
    selectors: {
        form: '.input-box form',
        input: '.input-box input',
        cancelSugg: '.input-box button',
        cancelPanel: '.panel-cancel',
        suggestWrap: '.suggest-wrap',
        jumpTarget: 'dt'
    },
    list: [], // 供选择的数据列表
    groupList: [], // 分组后供选择的数据列表
    itemTemplateFun: function(){}, // 模板构建函数
    suggTemplateFun: function(){} // 模板构建函数
};
```

##属性

```javascript
各子组件的实例集合
plugins = {
    pagePanel: pagePanel,
    suggest: {
        suggest: suggest,
        suggScroll: suggScroll
    },
    elevator: elevator,
    scrollTip: scrollTip,
    itemScroll: itemScroll
}
```

##方法

```javascript

/*
 * 显示选择浮层
 */
function show(val) { //... }

/*
 * 隐藏选择浮层
 */
function hide() { //... }

/*
 * 浮层滚动部分内容变化时调用
 */
function refresh() { //... }

```

## 日志

### 1.0.0 
首次发布