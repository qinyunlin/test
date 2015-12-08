package com.concom.soa.infrastructure.persist.zjt.material;

import java.util.List;

import com.concom.entity.dto.xunjia.material.MaterialCategory;
import com.concom.mybatis.MybatisRepository;

public interface MaterialCategoryRepository extends MybatisRepository<String, MaterialCategory> {

	List<MaterialCategory> getCategoriesByPid(String pid);
}
