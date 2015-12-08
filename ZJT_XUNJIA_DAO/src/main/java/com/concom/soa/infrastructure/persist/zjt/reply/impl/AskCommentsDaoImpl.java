package com.concom.soa.infrastructure.persist.zjt.reply.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.reply.AskComments;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.reply.AskCommentsDao;

@Repository
public class AskCommentsDaoImpl extends MybatisOperations<String, AskComments> implements AskCommentsDao {

	
	public void add(AskComments askComments) {
		// TODO Auto-generated method stub
        getSqlSession().insert(getNamespace().concat(".insert"), askComments);
	}

	
	public List<AskComments> queryList(Map<String, String> params) {
		// TODO Auto-generated method stub
		List<AskComments> askComments = getSqlSession().selectList(getNamespace().concat(".queryList"), params);
		for(AskComments aComments:askComments){
			aComments.getFormUserMember();
			aComments.getToUserMember();
			aComments.getFromAppMember();
			aComments.getToAppMember();
			aComments.getFromSsoUser();
			aComments.getToSsoUser();
		}
		return askComments;
	}

	
	public void del(Map<String, String> params) {
		// TODO Auto-generated method stub
		getSqlSession().delete(getNamespace().concat(".del"), params);
	}


	@Override
	public Page<AskComments> queryPageAskComments(Page<AskComments> page) {
		List<AskComments> askComments = getSqlSession().selectList(getNamespace().concat(".queryPage"), page);
		for(AskComments aComments:askComments){
			aComments.getFormUserMember();
			aComments.getToUserMember();
			aComments.getFromAppMember();
			aComments.getToAppMember();
			aComments.getFromSsoUser();
			aComments.getToSsoUser();
		}
		page.setResult(askComments);
		return page;
	}


	@Override
	public int queryCount(Map<String, String> params) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryCount"), params);
	}

}
