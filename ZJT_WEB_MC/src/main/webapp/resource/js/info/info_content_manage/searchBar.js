	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [new Ext.form.ComboBox({
							store : province_data,
							emptyText : "请选择",
							id : 'area_sel',
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							allowBlank : false,
							value : province_data.getAt(0).data.value
						}), {
					xtype : "label",
					text : "分类："
				}, sortCombo, {
					xtype : "label",
					text : "标题："
				}, {
					xtype : "textfield",
					id : "title",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, {
					xtype : "label",
					text : "Tag标签:"
				}, {
					xtype : "textfield",
					id : "tags",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, '-', {
					text : '查询',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/zoom.png',
					id : "search",
					handler : search
				}, '-', {
					xtype : "label",
					text : "审核状态："
				}, new Ext.form.ComboBox({
							id : 'exStatus',
							name : 'exStatus',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							anchor : '90%',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '已审核'], ['1', '未审核']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '0',
							listeners : {
								select : {
									fn : function() {
										var sortComboText = Ext
												.fly("sortCombo").getValue();
										if (sortComboText == "请选择") {
											Ext.MessageBox.alert("提示",
													"请先选择分类！");
											Ext.fly("exStatus").dom.value = "已审核";
											return;
										}
										if (Ext.fly("exStatus").dom.value == '已审核') {
											// Ext.fly("tbar1").show();
											// hideEl('tbar2');
											hideEl("sh_menuItem");
										} else {
											// hideEl('tbar1');
											// Ext.fly("tbar2").show();
											showEl("sh_menuItem");
										}
										search();
									}
								}
							}
						})]
	});