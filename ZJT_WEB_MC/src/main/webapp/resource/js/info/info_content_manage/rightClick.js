	// 右键菜单
	var rightClick1 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : edit
						}, {
							text : '锁定',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, {
							text : '复制/移动',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : showCopyCutWin
						}, {
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}]
			});
	var rightClick2 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_MOD"),
							handler : edit
						}, {
							text : '锁定',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, {
							text : '复制/移动',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : showCopyCutWin
						}, {
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}, {
							id : 'sh_item',
							text : '审核',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							handler : function() {
								examine();
							}
						}]
			});
	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
		if (Ext.fly("exStatus").dom.value == "已审核")
			rightClick1.showAt(e.getXY());
		else
			rightClick2.showAt(e.getXY());
	}