package com.concom.soa.infrastructure.persist.app.tbCategory.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.tbCategory.TbCategory;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.tbCategory.TbCategoryDao;

@Repository
public class TbCategoryDaoImpl extends MybatisOperations<String, TbCategory> implements TbCategoryDao {


	@Override
	public List<TbCategory> queryList(Map<String, String> params) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".queryList"), params);
	}

	@Override
	public int add(TbCategory tbCategory) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().insert(getNamespace().concat(".add"), tbCategory);
	}

}
