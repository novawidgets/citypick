(function(){
	var winScrollY,
		pointerEventsTimer;

	var PagePanel = Widget.extend({
		attrs: {
			siblings: ':not(script):not(style)',
			hash: 'pagepanel',
			template: '<div class="page-panel"></div>'
		},
		setup: function(){
			var me = this,
				siblings = this.get('siblings'),
				$element = this.$element;
			this._bindEvent();
			
			var body = $element.prop('ownerDocument').body;
			if (body != $element.parent()[0]) {
				$(document).ready(function(){
					$(body).append($element);
					me.$siblings = $element.siblings(siblings);

					setTimeout(function(){
						me.checkHash();
					}, 10);
				});
			} else {
				me.$siblings = $element.siblings(siblings);

				setTimeout(function(){
					me.checkHash();
				}, 10);
			}
		},
		show: function(){
			var me = this;
			var hash = this.get('hash');
			
			winScrollY = window.scrollY;
			clearTimeout(pointerEventsTimer);
			me.$siblings.hide().css('pointer-events', 'none');
			me.$element.show();

			if (location.hash != '#'+hash) {
				location.hash = hash;
			}

		},
		hide: function(){
			var me = this;
			var hash = this.get('hash');

			me.$siblings.show();
			me.$element.hide();

			pointerEventsTimer = setTimeout(function(){
				me.$siblings.css('pointer-events', '');
			},500);

			if (location.hash == '#'+hash) {
				location.hash = this._hash;
			}

			window.scrollTo(0,winScrollY);

		},
		isShow: function(){
			return this.$element.css('display') != 'none';
		},
		checkHash: function(){
			var hash = location.hash;

			if (hash == '#'+this.get('hash')) {
				!this.isShow() && this.show();
			} else {
				this.isShow() && this.hide();
			}
		},
		_bindEvent: function(){
			var me = this;

			$(window).on('hashchange', function(e){
				var oldURL = e.oldURL;
				var hash = oldURL.lastIndexOf('#') > -1 ? oldURL.slice(oldURL.lastIndexOf('#')+1) : '';
				me._hash = hash;
				me.checkHash();
			});
		},
		_hash: ''
	});

	this.PagePanel = PagePanel;
})();