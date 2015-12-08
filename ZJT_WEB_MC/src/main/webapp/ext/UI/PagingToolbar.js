(function() {

	var T = Ext.Toolbar;
	Ext.ux.PagingToolbar = Ext.extend(Ext.Toolbar, {

				beforePageText : "第",

				afterPageText : "页共 {0} 页",

				firstText : "第一页",

				prevText : "前一页",

				nextText : "下一页",

				lastText : "最后页",

				refreshText : "刷新",

				displayMsg : "显示 {0} - {1}，共 {2} 条",

				emptyMsg : '没有数据需要显示',

				pageSize : 20,

				initComponent : function() {
					var pagingItems = [this.first = new T.Button({
										tooltip : this.firstText,
										overflowText : this.firstText,
										iconCls : 'x-tbar-page-first',
										disabled : true,
										handler : this.moveFirst,
										scope : this
									}), this.prev = new T.Button({
										tooltip : this.prevText,
										overflowText : this.prevText,
										iconCls : 'x-tbar-page-prev',
										disabled : true,
										handler : this.movePrevious,
										scope : this
									}), '-', this.beforePageText,
							this.inputItem = new Ext.form.NumberField({
										cls : 'x-tbar-page-number',
										allowDecimals : false,
										allowNegative : false,
										enableKeyEvents : true,
										selectOnFocus : true,
										listeners : {
											scope : this,
											keydown : this.onPagingKeyDown,
											blur : this.onPagingBlur
										}
									}), this.afterTextItem = new T.TextItem({
										text : String.format(
												this.afterPageText, 1)
									}), '-', this.next = new T.Button({
										tooltip : this.nextText,
										overflowText : this.nextText,
										iconCls : 'x-tbar-page-next',
										disabled : true,
										handler : this.moveNext,
										scope : this
									}), this.last = new T.Button({
										tooltip : this.lastText,
										overflowText : this.lastText,
										iconCls : 'x-tbar-page-last',
										disabled : true,
										handler : this.moveLast,
										scope : this
									}), '-', this.refresh = new T.Button({
										tooltip : this.refreshText,
										overflowText : this.refreshText,
										iconCls : 'x-tbar-loading',
										handler : this.refresh,
										scope : this
									})];

					var userItems = this.items || this.buttons || [];
					if (this.prependButtons) {
						this.items = userItems.concat(pagingItems);
					} else {
						this.items = pagingItems.concat(userItems);
					}
					delete this.buttons;
					if (this.displayInfo) {
						this.items.push('->');
						this.items.push(this.displayItem = new T.TextItem({}));
					}
					Ext.ux.PagingToolbar.superclass.initComponent.call(this);
					this.addEvents(

							'change',

							'beforechange');
					this.on('afterlayout', this.onFirstLayout, this, {
								single : true
							});
					this.cursor = 0;
					this.bindStore(this.store);
					this.pageSize = this.store.baseParams["pageSize"] != null
							? this.store.baseParams["pageSize"]
							: this.pageSize;
				},

				// private
				onFirstLayout : function() {
					if (this.dsLoaded) {
						this.onLoad.apply(this, this.dsLoaded);
					}
				},

				// private
				updateInfo : function() {
					if (this.displayItem) {
						var count = this.store.getCount();
						var msg = count == 0 ? this.emptyMsg : String.format(
								this.displayMsg, this.cursor + 1, this.cursor
										+ count, this.store.getTotalCount());
						this.displayItem.setText(msg);
					}
				},

				// private
				onLoad : function(store, r, o) {
					if (!this.rendered) {
						this.dsLoaded = [store, r, o];
						return;
					}
					var p = this.getParams();
					// this.cursor = (o.params && o.params[p.page]) ?
					// o.params[p.page] : 0;
					this.cursor = (o.params && o.params[p.page])
							? ((o.params[p.page] - 1) * o.params[p.pageSize])
							: 0;

					var d = this.getPageData(), ap = d.activePage, ps = d.pages;

					this.afterTextItem.setText(String.format(
							this.afterPageText, d.pages));
					this.inputItem.setValue(ap);
					this.first.setDisabled(ap == 1);
					this.prev.setDisabled(ap == 1);
					this.next.setDisabled(ap == ps);
					this.last.setDisabled(ap == ps);
					this.refresh.enable();
					this.updateInfo();
					this.fireEvent('change', this, d);
				},

				// private
				getPageData : function() {
					var total = this.store.getTotalCount();
					return {
						total : total,
						activePage : Math.ceil((this.cursor + this.pageSize)
								/ this.pageSize),
						pages : total < this.pageSize ? 1 : Math.ceil(total
								/ this.pageSize)
					};
				},

				changePage : function(page) {
					this.doLoad(((page - 1) * this.pageSize).constrain(0,
							this.store.getTotalCount()));
				},

				onLoadError : function() {
					if (!this.rendered) {
						return;
					}
					this.refresh.enable();
				},

				readPage : function(d) {
					var v = this.inputItem.getValue(), pageNum;
					if (!v || isNaN(pageNum = parseInt(v, 10))) {
						this.inputItem.setValue(d.activePage);
						return false;
					}
					return pageNum;
				},

				onPagingFocus : function() {
					this.inputItem.select();
				},

				onPagingBlur : function(e) {
					this.inputItem.setValue(this.getPageData().activePage);
				},

				onPagingKeyDown : function(field, e) {
					var k = e.getKey(), d = this.getPageData(), pageNum;
					if (k == e.RETURN) {
						e.stopEvent();
						pageNum = this.readPage(d);
						if (pageNum !== false) {
							pageNum = Math.min(Math.max(1, pageNum), d.pages)
									- 1;
							this.doLoad(pageNum * this.pageSize);
						}
					} else if (k == e.HOME || k == e.END) {
						e.stopEvent();
						pageNum = k == e.HOME ? 1 : d.pages;
						field.setValue(pageNum);
					} else if (k == e.UP || k == e.PAGEUP || k == e.DOWN
							|| k == e.PAGEDOWN) {
						e.stopEvent();
						if ((pageNum = this.readPage(d))) {
							var increment = e.shiftKey ? 10 : 1;
							if (k == e.DOWN || k == e.PAGEDOWN) {
								increment *= -1;
							}
							pageNum += increment;
							if (pageNum >= 1 & pageNum <= d.pages) {
								field.setValue(pageNum);
							}
						}
					}
				},

				getParams : function() {

					return this.paramNames || this.store.paramNames;
				},

				beforeLoad : function() {
					if (this.rendered && this.refresh) {
						this.refresh.disable();
					}
				},

				doLoad : function(cur) {
					var o = {}, pn = this.getParams();
					o[pn.pageNo] = o[pn.page] = (cur / this.pageSize) + 1;
					o[pn.pageSize] = this.pageSize;
					if (this.fireEvent('beforechange', this, o) !== false) {
						this.store.load({
									params : o
								});
					}
				},

				moveFirst : function() {
					this.doLoad(0);
				},

				movePrevious : function() {
					this.doLoad(Math.max(0, this.cursor - this.pageSize));
				},

				moveNext : function() {
					this.doLoad(this.cursor + this.pageSize);
				},

				moveLast : function() {
					var total = this.store.getTotalCount(), extra = total
							% this.pageSize;

					this
							.doLoad(extra ? (total - extra) : total
									- this.pageSize);
				},

				refresh : function() {
					this.doLoad(this.cursor);
				},

				bindStore : function(store, initial) {
					var doLoad;
					if (!initial && this.store) {
						this.store.un('beforeload', this.beforeLoad, this);
						this.store.un('load', this.onLoad, this);
						this.store.un('exception', this.onLoadError, this);
						if (store !== this.store && this.store.autoDestroy) {
							this.store.destroy();
						}
					}
					if (store) {
						store = Ext.StoreMgr.lookup(store);
						store.on({
									scope : this,
									beforeload : this.beforeLoad,
									load : this.onLoad,
									exception : this.onLoadError
								});
						doLoad = store.getCount() > 0;
					}
					this.store = store;
					if (doLoad) {
						this.onLoad(store, null, {});
					}
				},

				unbind : function(store) {
					this.bindStore(null);
				},

				bind : function(store) {
					this.bindStore(store);
				},

				onDestroy : function() {
					this.bindStore(null);
					Ext.ux.PagingToolbar.superclass.onDestroy.call(this);
				}
			});

})();
Ext.reg('paging_self', Ext.ux.PagingToolbar);