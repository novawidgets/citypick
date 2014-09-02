(function(root, factory) {
if(typeof exports === 'object') {
module.exports = factory();
} else if(typeof define === 'function' && define.amd) {
define(['module/widget/1.0.1/widget','module/iscroll/5.1.1/iscroll','module/handlebars/1.0.0/handlebars','module/Nova.suggest/1.0.2/suggest','module/Nova.elevator/0.1.0/elevator','module/Nova.scrollTips/0.1.0/scrollTips','module/Nova.pagePanel/0.1.0/pagePanel'], factory);
} else {
root['Citypick'] = factory();
}
})(this, function(Widget,IScroll,Handlebars,Suggest,Elevator,ScrollTips,PagePanel) {
Widget = Widget || this.Widget;
IScroll = IScroll || this.IScroll;
Handlebars = Handlebars || this.Handlebars;
Suggest = Suggest || this.Suggest;
Elevator = Elevator || this.Elevator;
ScrollTips = ScrollTips || this.ScrollTips;
PagePanel = PagePanel || this.PagePanel;


	var Citypick = Widget.extend({
		attrs: {
			element: '.city-panel',
			panel: null,
			refresh: function(){}
		},
		setup: function(){
			var cp = this;

			var cityList = this.get('cityList'),
				cityGroupList = this.get('cityGroupList'),
				cityPanel = this.$element;

			var cityPanel,
				panel,
				elevator,
				scrollTip,
				itemScroll,
				targetList,
				sugg;

			var itemTemplate = Handlebars.compile($('.item-template', cityPanel).html());
			var suggTemplate = Handlebars.compile($('.sugg-template', cityPanel).html());

			var $input = $('.input-box input', cityPanel),
				$cancel = $('.input-box button', cityPanel),
				$form = $('.input-box form', cityPanel);

			var initSuggest = function(cityList){
				var orgValue;

				var $input = $('.input-box input', cityPanel),
					$cancel = $('.input-box button', cityPanel);

				var suggest = new Suggest({
					element: $('.input-box input', cityPanel),
					// parentNode: cityPanel.find('.suggest-wrap'),
					getData: function(key) {
						var list = [];

						if(key){
							$.each(cityList, function(index, item){
								var index = ','+item.index.toLowerCase()+','+item.name;

								if (index.indexOf(','+key.toLowerCase()) > -1) {
									list.push(item);
								};
							});
						}

						this.renderList(list);
					},
					renderList: function(data, options) {
						var html = suggTemplate({list:data});

						this.$list.html(html);
						setTimeout(function(){
							suggScroll.refresh();
						},0);
					},
					// template: '<div class="{$classNames.container}"><div class="{$classNames.list}"></div></div>'
					template: cityPanel.find('.suggest-wrap')
				});
				$input.on('focus', function(e){
					orgValue = this.value;
					suggest.$suggest.show();
					$cancel.show();
				});
				$cancel.on('click', function(e){
					suggest.$suggest.hide();
					$input.val(orgValue||'');
					$cancel.hide();
				});

				var suggScroll = new IScroll($('.suggest-wrap', cityPanel)[0], {
					hScrollbar:false,
					vScrollbar:false,
					bounce:false,
					tap: true
				});

				return {
					suggest: suggest,
					suggScroll: suggScroll
				};
			};
			var initCityItem = function(cityList){
				var html = itemTemplate({list:cityList});
				$('.item-list', cityPanel).html(html);

				itemScroll = new IScroll($('.item-data', cityPanel)[0], {
					probeType: 3,
					hScrollbar:false,
					vScrollbar:false,
					bounce:false,
					useTransform:false, //为true时移动端易崩溃
					tap: true
				});
				$('.item-wrap', cityPanel).on('tap', '.sugg-item-cont', function(e){
					$input.val(this.innerHTML);
					$form.submit();
				});

				var elevatorActive = false,
					scrollActive = false,
					timer,
					$tip = $('.item-tip', cityPanel);

				function showTip(){
					clearTimeout(timer);
					$tip.show();
					elevator.$element.addClass('active');
				}
				function hideTip(){
					if (elevatorActive || scrollActive) {
						return;
					}
					timer = setTimeout(function(){
						$tip.hide();
						elevator.$element.removeClass('active');
					}, 200);
				}

				elevator = new Elevator({
					element: $('.item-elevator', cityPanel),
					selecters: {
						target: 'dt'
					},
					targetContainer: itemScroll.wrapper
				});
				elevator.on('jump', function(e, data){
					var elementOffset = IScroll.utils.offset(itemScroll.wrapper).top;
					var p = -targetList.get(data.index).offsetTop;

					itemScroll.scrollTo(0,p);
					itemScroll._execEvent('scroll');

				});
				elevator.$element.on('touchstart', function(e){
					elevatorActive = true;
					showTip();
				}).on('touchend', function(e){
					elevatorActive = false;
					hideTip();
				});

				scrollTip = new ScrollTips({
					element: $tip,
					itemScroll: itemScroll,
					selecters: {
						target: 'dt'
					}
				});
				scrollTip.on('change', function(e, data){
					this.$element.text(targetList.get(data.index).innerHTML)
				}).on('posStart', function(e){
					scrollActive = true;
					showTip();
				}).on('posEnd', function(e){
					scrollActive = false;
					hideTip();
				});
			};
			var initPanel = function(){
				var pagePanel = new PagePanel({
					element: cityPanel
				});
				var inputVal = '';

				panel = {
					show: function(val){
						inputVal = val || '';
						pagePanel.show();
					},
					hide: function(){
						pagePanel.hide();
					}
				};
				pagePanel.after('show', function(e){
					refresh();
					$input.val(inputVal);
				});
				pagePanel.after('hide', function(e){
					$input.val('');
					$cancel.hide();
					itemScroll.scrollTo(0,0);
					itemScroll._execEvent('scroll');
				});

				$('.panel-cancel', cityPanel).on('click', function(e){
					panel.hide();
				});
			};

			initSuggest(cityList);
			initCityItem(cityGroupList);
			initPanel();

			function refresh(){
				setTimeout(function(){
					targetList = $(itemScroll.scroller).find('dt');
					itemScroll.refresh();
					elevator.refresh();
					scrollTip.refresh();
				},0);
			};

			$form.on('submit', function(e){
				e.preventDefault();
				cp.trigger('select', [{
					value: $input.val()
				}]);
				panel.hide();
			});

			/*获取热门城市*/
			$(document).ready(function(){
				var locationIp = '';
				$.ajax({
					url:"http://open.onebox.so.com/api/hotcity",
					dataType:"jsonp",
					data:{"ip":locationIp},
					success:function(data){
						var city = "";
						if(data && data.location){
							city = data.location;
						}
						$('.cp-location', cityPanel).html(city);

						if (data && data.hot) {
							var hot = $.map(data.hot, function(item){
								return {name: item};
							});
							var html = itemTemplate({list:{'热':hot}});
							$('.item-hot', cityPanel).html(html);
						}

						refresh();
					}
				});
			});

			this.set('panel', panel);
			this.set('refresh', refresh);
		},
		show: function(val){
			var panel = this.get('panel');
			panel.show(val);
		},
		hide: function(){
			var panel = this.get('panel');
			panel.hide();
		},
		refresh: function(){
			var refresh = this.get('refresh');
			refresh();
		}
	});

	return Citypick;

});