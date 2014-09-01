(function(){
	var winScrollY,
		pointerEventsTimer;

	var PagePanel = Widget.extend({
		attrs: {
			siblings: undefined,
			selecters: {
				close: '.close'
			},
			template: '<div class="page-panel"></div>'
		},
		setup: function(){
			var me = this,
				$element = this.$element;
			this._bindEvent();
			
			var body = $element.prop('ownerDocument').body;
			if (body != $element.parent()[0]) {
				$(document).ready(function(){
					$(body).append($element);
					if (me.$siblings === undefined) {
						me.$siblings = $element.siblings('div');
					}

					setTimeout(function(){
						checkHash(me);
					}, 10);
				});
			} else {
				if (me.$siblings === undefined) {
					me.$siblings = $element.siblings('div');
				}

				setTimeout(function(){
					checkHash(me);
				}, 10);
			}
		},
		show: function(){
			var me = this;
			
			winScrollY = window.scrollY;
			clearTimeout(pointerEventsTimer);
			me.$siblings.hide().css('pointer-events', 'none');
			me.$element.show();

			if (location.hash != '#pagepanel') {
				location.hash = 'pagepanel';
			}

		},
		hide: function(){
			var me = this;

			me.$element.hide();
			me.$siblings.show();
			pointerEventsTimer = setTimeout(function(){
				me.$siblings.css('pointer-events', '');
			},500);

			if (location.hash == '#pagepanel') {
				location.hash = this._hash;
			}

			window.scrollTo(0,winScrollY);

		},
		isShow: function(){
			return this.$element.css('display') != 'none';
		},
		_bindEvent: function(){
			var me = this;

			$(window).on('hashchange', function(e){
				var oldURL = e.oldURL;
				var hash = oldURL.lastIndexOf('#') > -1 ? oldURL.slice(oldURL.lastIndexOf('#')+1) : '';
				me._hash = hash;
				checkHash(me);
			});
		},
		_hash: ''
	});

	function checkHash(panel){
		var hash = location.hash;

		if (hash == '#pagepanel') {
			!panel.isShow() && panel.show();
		} else {
			panel.isShow() && panel.hide();
		}
	};

	this.PagePanel = PagePanel;
})();