/*
 * ! Ext JS Library 3.0.0 Copyright(c) 2006-2009 Ext JS, LLC licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.ux.TabCloseMenu
 * @extends Object Plugin (ptype = 'tabclosemenu') for adding a close context
 *          menu to tabs.
 * 
 * @ptype tabclosemenu
 */
Ext.ux.TabCloseMenu = function() {
	var tabs, menu, ctxItem;
	this.init = function(tp) {
		tabs = tp;
		tabs.on('contextmenu', onContextMenu);
	};
	function onContextMenu(ts, item, e) {
		if (!menu) { // create context menu on first right click
			menu = new Ext.menu.Menu({
				items : [{
					text : '刷新此标签页',
					handler : function() {
						var temp = "tab_" + ctxItem.id + "_iframe";
						var temp_src = ctxItem.html.toString().split(" ");
						var src;
						for (var i = 0; i < temp_src.length; i++) {
							if ((temp_src[i].toString().indexOf("src") != -1)
									|| (temp_src[i].toString().indexOf("SRC") != -1)) {
								src = temp_src[i].toString().slice(temp_src[i]
										.toString().indexOf("src"))
										|| temp_src[i].toString()
												.slice(temp_src[i].toString()
														.indexOf("SRC"));
								src = src.split("'") || src.split('"');
								break;
							}

						}
						Ext.fly(temp).dom.src = src[1].toString();
					}
				}, {
					id : tabs.id + '-close',
					text : '关闭此标签页',
					handler : function() {
						tabs.remove(ctxItem);
					}
				}, {
					id : tabs.id + '-close-others',
					text : '关闭其他标签页',
					handler : function() {
						tabs.items.each(function(item) {
									if (item.closable && item != ctxItem) {
										tabs.remove(item);
									}
								});
					}
				}, {
					id : tabs.id + '-close-all',
					text : '关闭所有标签页',
					handler : function() {
						tabs.items.each(function(item) {

									tabs.remove(item);

								});
					}
				}]
			});
		}
		ctxItem = item;
		var items = menu.items;
		items.get(tabs.id + '-close').setDisabled(!item.closable);
		var disableOthers = true;
		tabs.items.each(function() {
					if (this != item && this.closable) {
						disableOthers = false;
						return false;
					}
				});
		items.get(tabs.id + '-close-others').setDisabled(disableOthers);
		e.stopEvent();
		menu.showAt(e.getPoint());
	}
};

Ext.preg('tabclosemenu', Ext.ux.TabCloseMenu);
