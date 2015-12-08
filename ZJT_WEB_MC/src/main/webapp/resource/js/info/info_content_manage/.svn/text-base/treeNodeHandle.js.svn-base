// 当fire checkchange时执行
function fireCheckChange(node) {
/**
	if (node.getUI().isChecked()) {
		checkedChildrenNodes(node);
		checkedParentNodes(node);
	} else {
		// 取得当前节点的所有子节点,包括当前节点
		var allChildrenNodes = getAllChildrenNodes(node);
		// 如果当前节点的所有子节点中,不存在checked=true的节点,那么将当前节点置为checked=false.
		// 如果当前节点有子节点,同时,当前节点checked=false,那么将其所有子节点置为checked=false
		for (var i = 0; i < allChildrenNodes.length; i++) {
			if (allChildrenNodes[i].getUI().isChecked()) {
				if (allChildrenNodes[i].attributes.checked == true) {
					allChildrenNodes[i].getUI().checkbox.checked = false;
					allChildrenNodes[i].attributes.checked = false;
				}
			}
		}
	}
**/
}

// 当点击父节点时 将其所有子节点选中
function checkedChildrenNodes(node) {
	// 取得本节点的所有子节点,子节点中包括其自己
	var allChildrenNodes = getAllChildrenNodes(node);
	if (allChildrenNodes.length > 1) {
		for (var i = 0; i < allChildrenNodes.length; i++) {
			if (!allChildrenNodes[i].getUI().isChecked()) {
				allChildrenNodes[i].getUI().checkbox.checked = true;
				allChildrenNodes[i].attributes.checked = true;
			}
		}
	}
}

// 当当前子节点的父节点的所有子节点中 不存在checked=true的子节点时,父节点不被选中
function unCheckedParentNode(currentChildNode) {
	if (currentChildNode.parentNode) {
		var parentNode = currentChildNode.parentNode;
		// 取得本父节点下所有被选中的子节点
		// 包括本父节点本身
		var allCheckedChildrenNodes = getCheckedNodes(parentNode);
		if (allCheckedChildrenNodes.length === 1) {
			if (parentNode.attributes.checked == true) {
				parentNode.getUI().checkbox.checked = false;
				parentNode.attributes.checked = false;
			}
		}
		if (parentNode.parentNode) {
			unCheckedParentNode(parentNode);
		}
	}
}

// 当点击子节点时 将父节点选中
function checkedParentNodes(node) {
	// 取得本节点的所有父节点,父节点中包括其自己
	var allParentNodes = getAllParentNodes(node);
	if (allParentNodes.length > 1) {
		for (var i = 0; i < allParentNodes.length; i++) {
			if (!allParentNodes[i].getUI().isChecked()) {
				if (allParentNodes[i].getUI().checkbox != null) {
					allParentNodes[i].getUI().checkbox.checked = true;
					allParentNodes[i].attributes.checked = true;
				}
			}
		}
	}
}

// 取得所有子节点中checked 为true的节点ID 包括本节点
function getCheckedNodesId(node) {
	var checked = [];
	if (node.getUI().isChecked() || node.attributes.checked) {
		checked.push(node.id);
		if (!node.isLeaf()) {
			for (var i = 0; i < node.childNodes.length; i++) {
				checked = checked.concat(getCheckedNodesId(node.childNodes[i]));
			}
		}
	}
	return checked;
};

// 取得所有子节点中checked为true的节点(TreeNode) 包括本节点
function getCheckedNodes(node) {
	var checked = [];
	if (node.getUI().isChecked()) {
		checked.push(node);
		if (!node.isLeaf()) {
			for (var i = 0; i < node.childNodes.length; i++) {
				checked = checked.concat(getCheckedNodes(node.childNodes[i]));
			}
		}
	}
	return checked;
};

// 取得一个节点的所有子节点 包括本节点
function getAllChildrenNodes(node) {
	var children = [];
	children.push(node);
	if (!node.isLeaf()) {
		for (var i = 0; i < node.childNodes.length; i++) {
			children = children.concat(getAllChildrenNodes(node.childNodes[i]));
		}
	}
	return children;
};

// 取得一个节点的所有父节点
function getAllParentNodes(node) {
	var parentNodes = [];
	parentNodes.push(node);
	if (node.parentNode) {
		parentNodes = parentNodes.concat(getAllParentNodes(node.parentNode));
	}
	return parentNodes;
};

// 取得所有checked=true的节点ID
function getAllChecked() {
	return getCheckedNodesId(selectRoot);
}

//增加选中参数传递过来的栏目
/**
var sameIdArr;
var sameIndex=0;
var i = 2;
//控制只处理一次选中事件
var tidChooseTask = {
	run : function() {			
		var tid = sameIdArr[sameIndex];
		console.debug(tid+" " + sameIndex+":" + i);
		if(i<=tid.length){
			var chooseNode = selectTree.getNodeById(tid.substring(0,i));
			if(chooseNode==undefined){
				return ;
			}else{
				chooseNode.expand();
				i = i + 2;
			}
		}
		if(selectTree.getNodeById(tid)!=undefined){
			if(selectTree.getNodeById(tid).getUI().checkbox!=undefined){
				selectTree.getNodeById(tid).getUI().checkbox.click();
				//重置2的计算
				i=2;
				if(sameIndex==sameIdArr.length()-1){
					taskRunner.stop(tidChooseTask);
				}else{
					sameIndex ++ ;
				}
			}
		}
	},
	interval:1000
};
var taskRunner = new Ext.util.TaskRunner();
//启动ID选择的定时器
function runTidChooseTask(){
	taskRunner.start(tidChooseTask);
}
**/