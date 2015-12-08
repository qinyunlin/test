package com.concom.soa.infrastructure.persist.zjt.reply.impl;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.reply.UsefulForbidLog;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.reply.UsefulForbidLogDao;

@Repository
public class UsefulForbidLogDaoImpl extends MybatisOperations<String, UsefulForbidLog> implements UsefulForbidLogDao {

	
	public void add(UsefulForbidLog forbidLog) {
		// TODO Auto-generated method stub
        getSqlSession().insert(getNamespace().concat(".insert"), forbidLog);
	}

	public int queryCount(Map<String, String> params) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryCount"), params);
	}

}
