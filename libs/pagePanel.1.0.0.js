/* Version 1.0.0 */

(function(){
	var PagePanel = Widget.extend({
		attrs: {
			siblings: ':not(script):not(style):not([style^="display: none"]):not([style*=" display: none"])',
			hash: 'pagepanel',
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

					setTimeout(function(){
						me.checkHash();
					}, 10);
				});
			} else {

				setTimeout(function(){
					me.checkHash();
				}, 10);
			}
		},
		show: function(){
			var me = this,
				siblings = this.get('siblings'),
				$element = this.$element;

			var hash = this.get('hash');

			me.$siblings = $element.siblings(siblings);
			
			me.winScrollY = window.scrollY;
			clearTimeout(me.pointerEventsTimer);
			me.$siblings && me.$siblings.hide().css('pointer-events', 'none');
			me.$element.show();

			if (location.hash != '#'+hash) {
				location.hash = hash;
			}

		},
		hide: function(){
			var me = this;
			var hash = this.get('hash');

			if(me.$siblings){
				me.$siblings.show();
				me.pointerEventsTimer = setTimeout(function(){
					me.$siblings.css('pointer-events', '');
				},500);
			}

			me.$element.hide();

			if (location.hash == '#'+hash) {
				location.hash = this._hash;
			}

			window.scrollTo(0, me.winScrollY);

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
		_hash: '',
		_winScrollY: 0,
		_pointerEventsTimer: null
	});

	this.PagePanel = PagePanel;
})();