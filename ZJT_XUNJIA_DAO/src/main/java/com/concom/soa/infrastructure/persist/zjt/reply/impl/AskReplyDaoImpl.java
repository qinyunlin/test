package com.concom.soa.infrastructure.persist.zjt.reply.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.reply.AskReplyDao;

/**
 * 
 * 
 *
 */
@Repository
public class AskReplyDaoImpl extends MybatisOperations<String, AskReply> implements AskReplyDao{

	public List<AskReply> queryEveryoneInquiryList(int pageSize) {
		return getSqlSession().selectList(getNamespace().concat(".queryEveryoneInquiryList"), pageSize);
	}

	
	public List<AskReply> getAskReply(Map<String, String> params) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".getAskReply"), params);
	}

	
	public void updateAdkReply(AskReply askReply) {
		// TODO Auto-generated method stub
		getSqlSession().update(getNamespace().concat(".update"), askReply);
	}

	
	public int addAskReply(AskReply askReply) {
		getSqlSession().insert(getNamespace().concat(".insert"), askReply);
		return Integer.parseInt(askReply.getId());
	}

	
	public int queryCount(Map<String, String> params) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryCount"), params);
	}

	
	public Page<AskReply> queryPageApp(Page<AskReply> page) {
		List<AskReply> list= getSqlSession().selectList(getNamespace().concat(".queryPageApp"), page);
		page.setResult(list);
		// TODO Auto-generated method stub
		return page;
	}

	
	public List<AskReply> queryScoreRewardList(int pageSize) {
		return getSqlSession().selectList(getNamespace().concat(".queryScoreRewardList"), pageSize);
	}

	public AskReply getAskReplyByPidAndMemberId(String memberId, String askId) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("memberid", memberId);
		params.put("pid", askId);
		return getSqlSession().selectOne(getNamespace().concat(".askRepliyOfUserReplyByAskId"), params);
	}



	@Override
	public int isReplied(String askId, String memberId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("memberId", memberId);
		params.put("askId", askId);
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".isReplied"), params);
	}


	@Override
	public int queryAskReplyCount(Page<AskReply> page) {
		// TODO Auto-generated method stub
		return  (Integer)getSqlSession().selectOne(getNamespace().concat(".queryAskReplyCount"), page);
	}


	@Override
	public AskReply getIsRecommendReplyLimtOne(String pid) {
		return getSqlSession().selectOne(getNamespace().concat(".getIsRecommendReplyLimtOne"), pid);
	}


	@Override
	public List<AskReply> getExportPiciReplyInfo(String piciId) {
		return getSqlSession().selectList(getNamespace().concat(".getExportPiciReplyInfo"), piciId);
	}


	@Override
	public void rollBackAskReplyData(Map<String, String> parameterMap) {
		getSqlSession().selectList(getNamespace().concat(".proAskReplyRollBack"), parameterMap);
	}
	
	@Override
	public List<AskReply> getExportReplyInfoByIds(List<String> pids){
		return getSqlSession().selectList(getNamespace().concat(".getExportReplyInfoByIds"), pids);
	}


	@Override
	public List<AskReply> getBestReplyByIds(List<String> pids) {
		return getSqlSession().selectList(getNamespace().concat(".getBestReply"), pids);
	}


	@Override
	public Page<AskReply> queryPageForMyReply(Page<AskReply> page) {
		List<AskReply> list= getSqlSession().selectList(getNamespace().concat(".queryPageForMyReply"), page);
		page.setResult(list);
		return page;
	}


	@Override
	public int queryMyReplyCount(Page<AskReply> page) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryMyReplyCount"), page);
	}
	@Override
	public Page<AskReply> queryNewestBestReply(Page<AskReply> page) {
		List<AskReply> list = getSqlSession().selectList(getNamespace().concat(".queryNewestBestReply"), page);
		page.setResult(list);
		return page;
	}
	@Override
	public AskReply findByMatchSecondBackReply(Map<String, String> params){
		return getSqlSession().selectOne(getNamespace().concat(".findByMatchSecondBackReply"), params);
	}
	
	@Override
	public List<AskReply> getReplyLibraryList(Map<String, String> params){
		return getSqlSession().selectList(getNamespace().concat(".getReplyLibraryList"), params);
	}
	
	@Override
	public int getReplyLibraryListCount(Map<String, String> params){
		return  (Integer)getSqlSession().selectOne(getNamespace().concat(".getReplyLibraryListCount"), params);
	}
	
	@Override
	public AskReply getBestReplyById(String pid) {
		return getSqlSession().selectOne(getNamespace().concat(".getBestReplyById"), pid);
	}

	@Override
	public AskReply getNewReplyById(String pid) {
		return getSqlSession().selectOne(getNamespace().concat(".getNewReplyById"), pid);
	}


	@Override
	public List<AskReply> getIsRecommendReplyList(Map<String, String> params) {
		return getSqlSession().selectList(getNamespace().concat(".getIsRecommendReplyList"), params);
	}


	@Override
	public List<AskReply> queryPageReplys(Page<AskReply> page) {
		return getSqlSession().selectList(getNamespace().concat(".queryPageReplys"), page);
	}


	@Override
	public Integer queryReplysCount(Page<AskReply> page) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryReplysCount"), page);
	}
}

