package com.concom.soa.application.app.tbCategory;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.app.tbCategory.TbCategory;


public interface TbCategoryService {
	
	/**
	 * 根据条件查询通币明细类别列表
	 * @param params
	 * @return
	 */
	public List<TbCategory> queryList(Map<String, String> params);
	
	
	/**
	 * 保存通币明细类别
	 * @param tbCategory
	 * @return
	 */
	public int add(TbCategory tbCategory);

}
