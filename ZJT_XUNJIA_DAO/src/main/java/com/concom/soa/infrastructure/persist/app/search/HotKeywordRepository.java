package com.concom.soa.infrastructure.persist.app.search;

import java.util.List;

import com.concom.entity.dto.xunjia.app.search.HotKeyword;
import com.concom.mybatis.MybatisRepository;

public interface HotKeywordRepository extends MybatisRepository<String, HotKeyword>{

	List<HotKeyword> fetchTopN(int n);

}
