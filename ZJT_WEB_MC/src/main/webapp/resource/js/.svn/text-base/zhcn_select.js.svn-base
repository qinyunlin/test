/**
 * 获取省,市,区 需与ConCom.js,zhcn_db.js,jquery共同使用
 * 
 * @author Kaven
 */
var Zhcn_Select = function() {
};
Zhcn_Select.prototype = {
	// 默认省
	conf_province : '',
	// 默认市
	conf_city : '',
	// 默认区
	conf_area : '',
	/**
	 * 获取省份
	 */
	getProvince : function(bol) {
		if ((bol || "") == "")
			return zhcn_pro_db.toString();
		else {
			if (bol){
				return zhcn_pro_db;
				}
			else
				return zhcn_pro_db.toString();
		}
	},
	/**
	 * 获取市
	 */
	getCity : function(province) {
		if (province == null || province == undefined || province == "") {
			alert("未设置省");
			return;
		}
		return zhcn_city_db[province]
	},
	/**
	 * 获取区
	 */
	getArea : function(city) {
		if (city == null || city == undefined || city == "") {
			alert("未设置市");
			return;
		}
		return zhcn_area_db[city];
	},
	/**
	 * 绑定省
	 * 
	 * @param el
	 *            元素id
	 */
	bindProvince : function(el) {
		if ((el || "") == "") {
			alert("未设置绑定省份的元素");
			return;
		}
		var len = zhcn_pro_db.length;
		for (var i = 0; i < len; i++) {
			$("#" + el).append("<option value='" + zhcn_pro_db[i].toString()
					+ "' >" + zhcn_pro_db[i].toString() + "</option>");
		}
		// $("#" + el).val(Zhcn_Select.prototype.conf_province);
	},
	/**
	 * 绑定市
	 * 
	 * @param province
	 *            省份
	 * @param el
	 *            元素id
	 */
	bindCity : function(province, el) {
		var citys = null;
		if ((el || "") == "") {
			alert("未设置绑定市的元素");
			return;
		}
		if ((province || "") == "") {
			citys = zhcn_city_db[Zhcn_Select.prototype.conf_province];
		} else {
			citys = zhcn_city_db[province];
		}
		if (citys == undefined) {
			citys = ["全部"];
		}
		var len = citys.length;
		for (var i = 0; i < len; i++) {
			$("#" + el).append("<option value='" + citys[i].toString() + "' >"
					+ citys[i].toString() + "</option>");
		}
		// if ((province || "") == "")
		// $("#" + el).val(Zhcn_Select.prototype.conf_city);

	},
	/**
	 * 绑定区
	 * 
	 * @param city
	 *            城市
	 * @param el
	 *            元素id
	 */
	bindArea : function(city, el) {
		var areas = null;
		if ((el || "") == "") {
			alert("未设置绑定区的元素");
			return;
		}
		if ((city || "") == "") {
			areas = zhcn_area_db[Zhcn_Select.prototype.conf_city];
		} else {
			areas = zhcn_area_db[city];
		}
		var len;
		if (areas == undefined)
			areas = ["全部"]
		len = areas.length;
		for (var i = 0; i < len; i++) {
			$("#" + el).append("<option value='" + areas[i].toString() + "' >"
					+ areas[i].toString() + "</option>");
		}
		// if ((city || "") == "")
		// $("#" + el).val(Zhcn_Select.prototype.conf_area);

	},
	/**
	 * 切换事件
	 * 
	 * @param el1
	 *            触发事件的元素id
	 * @param el2
	 *            内容变化的元素id
	 * @param type
	 *            内容类型
	 */
	changeList : function(el1, el2, el3) {
		$("#" + el1).change(function() {
					$("#" + el2).empty();
					$("#" + el3).empty();
					$("#" + el2).show();
					$("#" + el3).show();
					Zhcn_Select.prototype.bindCity($("#" + el1).val().trim(),
							el2);
					if ($("#" + el2).val() != null) {
						Zhcn_Select.prototype.bindArea($("#" + el2).val()
										.trim(), el3);

					} else {
						$("#" + el2).hide();
						$("#" + el3).hide();
					}
				});
		$("#" + el2).change(function() {
					$("#" + el3).empty();
					Zhcn_Select.prototype.bindArea($("#" + el2).val().trim(),
							el3);
				});
	},
	/**
	 * 地区切换(市,区)
	 */
	changeList : function(el1, el2) {
		$("#" + el1).change(function() {
					$("#" + el2).empty();
					$("#" + el2).show();
					Zhcn_Select.prototype.bindArea($("#" + el1).val().trim(),
							el2);
				});
	}
};
