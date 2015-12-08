package com.concom.soa.application.zjt.material.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.material.MaterialCategory;
import com.concom.soa.application.zjt.material.MaterialCategoryService;
import com.concom.soa.infrastructure.persist.zjt.material.MaterialCategoryRepository;

@Service
public class MaterialCategoryServiceImpl implements
		MaterialCategoryService {

	@Autowired
	private MaterialCategoryRepository materialCategoryRepository;
	
	@Override
	public List<MaterialCategory> getCategoriesByPid(String pid) {
		return materialCategoryRepository.getCategoriesByPid(pid);
	}

}
