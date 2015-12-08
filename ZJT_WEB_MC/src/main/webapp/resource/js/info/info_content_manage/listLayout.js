	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
				store : infoStore,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '标题',
							sortable : true,
							dataIndex : 'title',
							width : 420
						}, {
							header : 'Tag标签',
							sortable : true,
							dataIndex : 'tags'
						}, {
							header : '信息类型',
							sortable : true,
							dataIndex : 'typename'
						}, {
							header : '关联企业ID',
							sortable : true,
							dataIndex : 'eid'
						}, {
							header : '关联企业名称',
							sortable : true,
							dataIndex : 'ename'
						}, {
							header : '排序',
							sortable : true,
							dataIndex : 'sort',
							editor : {
								xtype : 'numberfield',
								allowDecimals : false,
								allowBlank : false
							}
						}, {
							header : '发表人',
							sortable : true,
							dataIndex : 'createBy'
						}, {
							header : '发表时间',
							sortable : true,
							width : 135,
							dataIndex : 'addTime'
						}, {
							header : '热点',
							sortable : true,
							dataIndex : 'isHot',
							width : 40,
							renderer : rederHT
						}, {
							header : '置顶',
							sortable : true,
							dataIndex : 'isTop',
							width : 40,
							renderer : rederHT
						}, {
							header : '显示站点',
							width : 40,
							dataIndex : 'webSite',
							renderer : function(v, column, data) {
								tempwebSite=[];
								for (site in newsSite_name) {
									if (data.data[site] != "0")
										tempwebSite.push(changeNewSite(site,
												data.data[site]));
								}
								return tempwebSite.toString();
							}
						}],
				bbar : new Ext.ux.PagingToolbar({
							store : infoStore,
							displayInfo : true
						}),
				viewConfig : {
					forceFit : true
				},
				tbar : [],
				renderTo : 'grid'
			});

	grid.addListener('rowcontextmenu', rightClickFn);
	grid.on('beforeedit', function(e) {
				if (!compareAuth("INFO_CONTENT_SORT"))
					return true;
				else
					return false;
			});
	grid.on("afteredit", function(e) {
		var data = {};
		data["content"] = e.field + "~" + e.record.data[e.field];
		data["id"] = e.record.get("id");
		Ext.Ajax.request({
			method : 'post',
			url : "/InfoContent.do?type=3",
			params : data,
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改排序成功！");
					infoStore.reload();
				} else {
					Info_Tip("修改排序成功！");
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	});
	function rederHT(value) {
		var html;
		if (value == 1) {
			html = "是";
		} else if (value = 0) {
			html = "";
		} else {
			html = "否";
		}
		return html;
	};