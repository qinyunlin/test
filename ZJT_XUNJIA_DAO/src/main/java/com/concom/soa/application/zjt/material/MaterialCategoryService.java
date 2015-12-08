package com.concom.soa.application.zjt.material;

import java.util.List;

import com.concom.entity.dto.xunjia.material.MaterialCategory;


public interface MaterialCategoryService {

	/**
	 * 
	 * @param pid
	 * @return
	 */
	List<MaterialCategory> getCategoriesByPid(String pid);
}
