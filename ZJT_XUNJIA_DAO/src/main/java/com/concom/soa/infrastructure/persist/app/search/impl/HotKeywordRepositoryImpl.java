package com.concom.soa.infrastructure.persist.app.search.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.search.HotKeyword;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.search.HotKeywordRepository;

@Repository
public class HotKeywordRepositoryImpl extends MybatisOperations<String, HotKeyword>
		implements HotKeywordRepository {

	@Override
	public List<HotKeyword> fetchTopN(int n) {
		
		return getSqlSession().selectList(getNamespace().concat(".fetchTopN"), n);
	}

}
