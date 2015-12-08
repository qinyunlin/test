
/* 设置关联企业 */
var setLinkEmp = function() {
	var row = emp_grid.getSelectionModel().getSelected();
	if (isEmpty(row)) {
		Ext.Msg.alert("提示", "请选择企业");
		return;
	}
	Ext.fly("eid").dom.value = row.get("eid");
	Ext.fly("ename").dom.value = row.get("name");
	empWin.close();
};
/* 搜索企业 */
var searchEmpList = function() {
	var query = Ext.getCmp("emp_query_key").getValue() + "~"
			+ Ext.fly("searchKey").getValue() + ";islock~0";
	if (parseInt(Ext.getCmp("emp_type").getValue()) != 0)
		query += ";type~" + Ext.getCmp("emp_type").getValue();
	emp_ds.baseParams["content"] = query;
	emp_ds.load();
};


var init = function() {
	Ext.QuickTips.init(true);
	buildFormPanel();
	/**
	var addNote = getCurArgs("addNote");
	if (addNote) {
		var tpath = getCurArgs("tpath");
		var typename = decodeURI(getCurArgs("typename"));
		var tid = getCurArgs("tid");
		var sortCbValue = " ├ " + typename;
		for (var i = 0; i < tpath.split("/").length - 3; i++) {
			sortCbValue = " │ " + sortCbValue;
		}
		Ext.get("sortCombo").dom.value = sortCbValue;
		Ext.get("tid").dom.value = tid;
		sortCombo.setDisabled(true);
		Ext.fly("picPath").dom.src = "";

	}
	**/
	addFckEditor();
};

function addFckEditor() {
	$.fck.config = {
		path : '/resource/plugins/FCKeditor/',
		height : 500,
		width : 750,
		toolbar : 'MCZJTCN'
	};
	$('#acontent').fck();
}
