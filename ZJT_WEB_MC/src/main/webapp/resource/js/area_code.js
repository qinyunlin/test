var arrArea = new Array(

		[1, "湖北", "01"],

		[1, "北京市", "02"],

		[1, "湖南", "03"],

		[1, "安徽", "04"],

		[1, "福建", "05"],

		[1, "吉林", "06"],

		[1, "江苏", "07"],

		[1, "江西", "08"],

		[1, "辽宁", "09"],

		[1, "内蒙古", "10"],

		[1, "宁夏", "11"],

		[1, "青海", "12"],

		[1, "山东", "13"],

		[1, "山西", "14"],

		[1, "甘肃", "15"],

		[1, "陕西", "16"],

		[1, "上海市", "17"],

		[1, "四川", "18"],

		[1, "天津", "19"],

		[1, "西藏", "20"],

		[1, "新疆", "21"],

		[1, "云南", "22"],

		[1, "浙江", "23"],

		[1, "重庆市", "24"],

		[1, "广东", "25"],

		[1, "广西", "26"],

		[1, "贵州", "27"],

		[1, "海南", "28"],

		[1, "河北", "29"],

		[1, "河南", "30"],

		[1, "黑龙江", "31"],

		[1, "台湾", "32"], [1, "香港", "33"], [1, "澳门", "34"]);

var city_map = new Map();
var cityname = [];// 名称
var cityval = [];// 城编码
var cityval_2 = [];
function drawSelect() {
	var len = arrArea.length;
	for (var i = 0; i < len; i++) {
		cityname.push(arrArea[i].toString().slice(
				arrArea[i].toString().indexOf(",") + 1,
				arrArea[i].toString().lastIndexOf(",")));
		cityval.push(arrArea[i].toString().slice(arrArea[i].toString()
				.lastIndexOf(",")
				+ 1));
		city_map.put(arrArea[i].toString().slice(arrArea[i].toString()
						.lastIndexOf(",")
						+ 1), arrArea[i].toString().slice(
						arrArea[i].toString().indexOf(",") + 1,
						arrArea[i].toString().lastIndexOf(",")));
		cityval_2.push(arrArea[i].toString().slice(arrArea[i].toString()
				.lastIndexOf(",")
				+ 1));
	}
};
drawSelect();

function getPro() {
	var len = cityval_2.length;
	var temp = "[";
	for (var i = 0; i < len; i++) {
		temp += "['" + cityval_2[i].toString() + "','"
				+ city_map.get(cityval_2[i].toString()) + "'],"
	}
	temp = temp.slice(0, temp.lastIndexOf(","));
	temp += "]";
	return temp;
};

/*
 * 
 * 
 * 
 * size() 获取MAP元素个数 isEmpty() 判断MAP是否为空 clear() 删除MAP所有元素 put(key, value)
 * 向MAP中增加元素（key, value) remove(key) 删除指定KEY的元素，成功返回True，失败返回False get(key)
 * 获取指定KEY的元素值VALUE，失败返回NULL element(index)
 * 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL containsKey(key)
 * 判断MAP中是否含有指定KEY的元素 containsValue(value) 判断MAP中是否含有指定VALUE的元素 values()
 * 获取MAP中所有VALUE的数组（ARRAY） keys() 获取MAP中所有KEY的数组（ARRAY）
 * 
 * 
 * 
 */
function Map() {
	this.elements = new Array();

	// 获取MAP元素个数
	this.size = function() {
		return this.elements.length;
	}

	// 判断MAP是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	}

	// 删除MAP所有元素
	this.clear = function() {
		this.elements = new Array();
	}

	// 向MAP中增加元素（key, value)
	this.put = function(_key, _value) {
		this.elements.push({
					key : _key,
					value : _value
				});
	}

	// 删除指定KEY的元素，成功返回True，失败返回False
	this.remove = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	// 获取指定KEY的元素值VALUE，失败返回NULL
	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	}

	// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	}

	// 判断MAP中是否含有指定KEY的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	// 判断MAP中是否含有指定VALUE的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	// 获取MAP中所有VALUE的数组（ARRAY）
	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	}

	// 获取MAP中所有KEY的数组（ARRAY）
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	}
}