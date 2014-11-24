(function(root, factory) {
if(typeof exports === 'object') {
module.exports = factory();
} else if(typeof define === 'function' && define.amd) {
define(['module/widget/1.0.2/widget','module/iscroll/5.1.1/iscroll','module/handlebars/1.0.0/handlebars','module/Nova.suggest/1.0.2/suggest','module/Nova.elevator/0.3.0/elevator','module/Nova.scrollTips/0.3.0/scrollTips','module/Nova.pagePanel/0.3.0/pagePanel'], factory);
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
			needSuggest: true,
			needElevator: true,
			needScrollTip: true,
			selecters: {
				form: '.input-box form',
				input: '.input-box input',
				cancelSugg: '.input-box button',
				cancelPanel: '.panel-cancel',
				suggestWrap: '.suggest-wrap',
				jumpTarget: 'dt',
				itemTemplate: '.item-template',
				suggTemplate: '.sugg-template'
			}
		},
		plugins: {},
		setup: function(){
			var cp = this;

			var cityList = this.get('cityList'),
				cityGroupList = this.get('cityGroupList'),
				cityPanel = this.$element,
				needElevator = this.get('needElevator'),
				needScrollTip = this.get('needScrollTip'),
				jumpTarget = this.get('selecters.jumpTarget');

			var panel,
				elevator,
				scrollTip,
				itemScroll,
				targetList;

			var itemTemplate = cp.itemTemplate = Handlebars.compile($(this.get('selecters.itemTemplate'), cityPanel).html());
			var suggTemplate = cp.suggTemplate = Handlebars.compile($(this.get('selecters.suggTemplate'), cityPanel).html());

			var $form = $(this.get('selecters.form'), cityPanel),
				$input = $(this.get('selecters.input'), cityPanel),
				$cancelSuggBtn = $(this.get('selecters.cancelSugg'), cityPanel),
				$cancelPanelBtn = $(this.get('selecters.cancelPanel'), cityPanel);

			var initSuggest = function(cityList){
				var orgValue;
				var suggestWrap = cityPanel.find(cp.get('selecters.suggestWrap'))

				var suggest = new Suggest({
					element: $input,
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
					template: suggestWrap
				});
				$input.on('focus', function(e){
					orgValue = this.value;
					suggest.$suggest.show();
					$cancelSuggBtn.show();
				});
				$cancelSuggBtn.on('click', function(e){
					suggest.$suggest.hide();
					$input.val(orgValue||'');
					$cancelSuggBtn.hide();
				});

				var suggScroll = new IScroll(suggestWrap[0], {
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
					scrollTip && $tip.show();
					elevator && elevator.$element.addClass('active');
				}
				function hideTip(){
					if (elevatorActive || scrollActive) {
						return;
					}
					timer = setTimeout(function(){
						scrollTip && $tip.hide();
						elevator && elevator.$element.removeClass('active');
					}, 200);
				}

				if (needElevator) {
					elevator = new Elevator({
						element: $('.item-elevator', cityPanel),
						selecters: {
							target: jumpTarget
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
				}

				if (needScrollTip) {
					scrollTip = new ScrollTips({
						element: $tip,
						itemScroll: itemScroll,
						selecters: {
							target: jumpTarget
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
				}
			};
			var initPanel = function(){
				var pagePanel = new PagePanel({
					element: cityPanel,
					hash: 'citypick'
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
					$cancelSuggBtn.hide();
					itemScroll.scrollTo(0,0);
					itemScroll._execEvent('scroll');
				});

				$cancelPanelBtn.on('click', function(e){
					panel.hide();
				});

				return pagePanel;
			};

			function refresh(){
				setTimeout(function(){
					targetList = $(itemScroll.scroller).find(jumpTarget);
					itemScroll.refresh();
					elevator && elevator.refresh();
					scrollTip && scrollTip.refresh();
				},0);
			};
			cp.refresh = refresh;

			if (this.get('needSuggest')) {
				cp.plugins.suggest = initSuggest(cityList);
			}
			initCityItem(cityGroupList);
			cp.plugins.pagePanel = initPanel();

			$.extend(cp.plugins, {
				panel: panel,
				elevator: elevator,
				scrollTip: scrollTip,
				itemScroll: itemScroll
			});

			$form.on('submit', function(e){
				e.preventDefault();
				cp.trigger('select', [{
					value: $input.val()
				}]);
				panel.hide();
			});

		},
		show: function(val){
			this.plugins.panel.show(val);
		},
		hide: function(){
			this.plugins.panel.hide();
		},
		refresh: function(){}
	});

	return Citypick;

});