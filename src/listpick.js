(function(){
	var Listpick = Widget.extend({
		attrs: {
			element: '.listpick-panel',
			needSuggest: true,
			needElevator: true,
			needScrollTip: true,
			selectors: {
				form: '.input-box form',
				input: '.input-box input',
				cancelSugg: '.input-box button',
				cancelPanel: '.panel-cancel',
				suggestWrap: '.suggest-wrap',
				jumpTarget: 'dt'
			},
			list: [],
			groupList: [],
			itemTemplateFun: function(){},
			suggTemplateFun: function(){}
		},
		setup: function(){
			var cp = this;
			cp.plugins = {};

			var list = this.get('list'),
				groupList = this.get('groupList'),
				listPanel = this.$element,
				needElevator = this.get('needElevator'),
				needScrollTip = this.get('needScrollTip'),
				jumpTarget = this.get('selectors.jumpTarget');

			var panel,
				elevator,
				scrollTip,
				itemScroll,
				targetList;

			cp.itemTemplateFun = this.get('itemTemplateFun');
			cp.suggTemplateFun = this.get('suggTemplateFun');

			var $form = $(this.get('selectors.form'), listPanel),
				$input = $(this.get('selectors.input'), listPanel),
				$cancelSuggBtn = $(this.get('selectors.cancelSugg'), listPanel),
				$cancelPanelBtn = $(this.get('selectors.cancelPanel'), listPanel);

			var initSuggest = function(list){
				var orgValue;
				var suggestWrap = listPanel.find(cp.get('selectors.suggestWrap'))

				var suggest = new Suggest({
					element: $input,
					getData: function(key) {
						var rlist = [];

						if(key){
							$.each(list, function(index, item){
								var index = ','+item.index.toLowerCase()+','+item.name;

								if (index.indexOf(','+key.toLowerCase()) > -1) {
									rlist.push(item);
								};
							});
						}

						this.renderList(rlist);
					},
					renderList: function(data, options) {
						var html = cp.suggTemplateFun({list:data});

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
					e.preventDefault();
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
			var initListItem = function(list){
				var html = cp.itemTemplateFun({list:list});
				$('.item-list', listPanel).html(html);

				itemScroll = new IScroll($('.item-data', listPanel)[0], {
					probeType: 3,
					hScrollbar:false,
					vScrollbar:false,
					bounce:false,
					useTransform:false, //为true时移动端易崩溃
					tap: true
				});
				$('.item-wrap', listPanel).on('tap', '.sugg-item-cont', function(e){
					$input.val(this.innerHTML);
					$form.submit();
				});

				var elevatorActive = false,
					scrollActive = false,
					timer,
					$tip = $('.item-tip', listPanel);

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
						element: $('.item-elevator', listPanel),
						selectors: {
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
						selectors: {
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
					element: listPanel,
					hash: 'listpick'
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
					e.preventDefault();
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
				cp.plugins.suggest = initSuggest(list);
			}
			initListItem(groupList);
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

	this.Listpick = Listpick;

})();