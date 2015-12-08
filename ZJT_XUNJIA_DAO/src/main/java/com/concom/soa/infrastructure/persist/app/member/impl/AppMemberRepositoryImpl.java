package com.concom.soa.infrastructure.persist.app.member.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.member.AppMember;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.member.AppMemberRepository;

@Repository
public class AppMemberRepositoryImpl extends MybatisOperations<String, AppMember> implements
		AppMemberRepository{


	public AppMember getMemberInfoById(String memberId) {
		
		return getSqlSession().selectOne(getNamespace().concat(".getById"), memberId);
	}


	@Override
	public int registerUser(Map<String, Object> params) {
		return getSqlSession().insert(getNamespace().concat(".registerUser"), params);
	}


	@Override
	public Page<Map<String, Object>> queryPageMap(Page<Map<String, Object>> page) {
		// TODO Auto-generated method stub
		List<Map<String, Object>> maps=getSqlSession().selectList(getNamespace().concat(".queryPageMap"), page);
		page.setResult(maps);
		return page;
	}
	@Override
	public Page<Map<String, Object>> queryPageMapForBillboard(Page<Map<String, Object>> page) {
		// TODO Auto-generated method stub
		List<Map<String, Object>> maps=getSqlSession().selectList(getNamespace().concat(".queryPageMapForRankList"), page);
		page.setResult(maps);
		return page;
	}


	@Override
	public boolean isExist(Map<String,Object> params) {
		// TODO Auto-generated method stub
		int num=(Integer)getSqlSession().selectOne(getNamespace().concat(".isExist"), params);
		if(num>0){
			return true;
		}
		return  false; 
	}


	@Override
	public AppMember getByMobile(String mobile) {
		// TODO Auto-generated method stub
		return getSqlSession().selectOne(getNamespace().concat(".getByMobile"), mobile);
	}


	@Override
	public Map<String, Object> rankingWithMe(Map<String, Object> param) {
		// TODO Auto-generated method stub
		return  getSqlSession().selectOne(getNamespace().concat(".rankingWithMe"),param);
	}


}
