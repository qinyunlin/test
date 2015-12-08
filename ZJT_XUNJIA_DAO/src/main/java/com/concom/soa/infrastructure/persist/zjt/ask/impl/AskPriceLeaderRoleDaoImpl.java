package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.AskPriceLeaderRole;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceLeaderRoleDao;

@Repository
public class AskPriceLeaderRoleDaoImpl extends MybatisOperations<String, AskPriceLeaderRole> implements AskPriceLeaderRoleDao{

	public List<AskPriceLeaderRole> queryList() {
		return getSqlSession().selectList(getNamespace().concat(".queryList"));
	}

	@Override
	public int add(AskPriceLeaderRole askPriceLeaderRole) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().insert(getNamespace().concat(".insert"), askPriceLeaderRole);
	}
	
	/**
	 *  获取所有角色
	 * @return
	 */
	public List<String> get(){
		return getSqlSession().selectList(getNamespace().concat(".get"));
	}
	
	public void del(){
		getSqlSession().delete(getNamespace().concat(".del"));
	}

}
