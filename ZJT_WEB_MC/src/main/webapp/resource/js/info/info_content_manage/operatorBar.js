	var tbar = new Ext.Toolbar({
				id : 'tbar1',
				renderTo : grid.tbar,
				items : [{
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								edit();
							}
						}, {
							id : 'del',
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, '-', {
							id : 'copycut',
							text : '复制/移动',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/copy.png',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : function() {
								showCopyCutWin();
							}
						}, '-', {
							text : '添加信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : function() {
								add();
							}
						}, '-', {
							id : 'bj_menuItem',
							text : '标签相关项目',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							style : 'display: none',
							handler : linkProject
						}, {
							id : 'sh_menuItem',
							text : '审核',
							cls : 'x-btn-text-icon',
							style : 'display: none',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							icon : '/resource/images/add.gif',
							handler : examine
						}]
			});