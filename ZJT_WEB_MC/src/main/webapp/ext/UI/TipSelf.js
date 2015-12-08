Ext.BLANK_IMAGE_URL = '/ext/resource/images/default/s.gif';

Ext.TipSelf = function() {
	var msgCt;
	function createBox(t, s) {
		return [
				'<div class="msg">',
				'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
				'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>',
				t,
				'</h3>',
				s,
				'</div></div></div>',
				'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
				'</div>'].join('');
	}
	return {
		bol : true,// 个人设置是否显示
		time:3,//设置的自定义显示时间
		msg : function(title, format, hbol) {
			if (hbol != undefined)
				this.bol = true;
			else {
				this.bol = ((parent.base_config["isTip"] == "1"||parent.base_config["isTip"]==undefined) ? true : false);
			}
			if (this.bol) {
				if (!msgCt) {
					msgCt = Ext.DomHelper.insertFirst(document.body, {
								id : 'msg-div'
							}, true);
				}
				msgCt.alignTo(document, 't-t');
				var s = String.format.apply(String, Array.prototype.slice.call(
								arguments, 1));
				var m = Ext.DomHelper.append(msgCt, {
							html : createBox(title, s)
						}, true);
				m.slideIn('t').pause(this.time).ghost("t", {
							remove : true
						});
				m.on('click', function() {
							m.remove();
						})
			}
		},

		init : function() {
			var lb = Ext.get('lib-bar');
			if (lb) {
				lb.show();
			}
		}
	};
}();

Ext.TipSelf.shortBogusMarkup = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales non, iaculis ac, lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet tincidunt quam turpis vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla vel, urna.';
Ext.TipSelf.bogusMarkup = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales non, iaculis ac, lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet tincidunt quam turpis vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla vel, urna.<br/><br/>Aliquam commodo ullamcorper erat. Nullam vel justo in neque porttitor laoreet. Aenean lacus dui, consequat eu, adipiscing eget, nonummy non, nisi. Morbi nunc est, dignissim non, ornare sed, luctus eu, massa. Vivamus eget quam. Vivamus tincidunt diam nec urna. Curabitur velit.</p>';

Ext.onReady(Ext.TipSelf.init, Ext.TipSelf);
