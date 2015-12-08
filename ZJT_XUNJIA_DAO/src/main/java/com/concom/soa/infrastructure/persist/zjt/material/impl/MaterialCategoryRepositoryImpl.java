package com.concom.soa.infrastructure.persist.zjt.material.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.material.MaterialCategory;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.material.MaterialCategoryRepository;
@Repository
public class MaterialCategoryRepositoryImpl extends MybatisOperations<String, MaterialCategory>
		implements MaterialCategoryRepository {


	@Override
	public List<MaterialCategory> getCategoriesByPid(String pid) {
		return getSqlSession().selectList(getNamespace().concat(".getCategoriesByPid"), pid);
	}

}
