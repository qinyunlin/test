package com.concom.soa.infrastructure.persist.app.member.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.commission.Commission;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.member.CommissionRepository;

@Repository
public class CommissionRepositoryImpl extends MybatisOperations<String, Commission> implements CommissionRepository {

	@Override
	public int add(Commission commission) {
		// TODO Auto-generated method stub
		return getSqlSession().insert(getNamespace().concat(".insert"), commission);
	}

	@Override
	public List<Commission> queryList(Map<String, String> params) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".queryList"), params);
	}

}
