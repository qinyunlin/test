package com.concom.soa.application.zjt.reply.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.elasticsearch.common.collect.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.reply.AskReplyService;
import com.concom.soa.infrastructure.persist.zjt.reply.AskReplyDao;

@Service
public class AskReplyServiceImpl implements AskReplyService {
	@Autowired
	private AskReplyDao askReplyDao;

	public List<AskReply> queryEveryoneInquiryList(int pageSize) {
		return askReplyDao.queryEveryoneInquiryList(pageSize);
	}

	public List<AskReply> getAskReply(Map<String, String> params) {
		// TODO Auto-generated method stub
		return askReplyDao.getAskReply(params);
	}

	public void updateAdkReply(AskReply askReply) {
		// TODO Auto-generated method stub
		askReplyDao.updateAdkReply(askReply);
	}

	public int addAskReply(AskReply askReply) {
		// TODO Auto-generated method stub
		return askReplyDao.addAskReply(askReply);
	}

	public int queryCount(Map<String, String> params) {
		// TODO Auto-generated method stub
		return askReplyDao.queryCount(params);
	}

	public Page<AskReply> queryPageApp(Page<AskReply> page) {
		// TODO Auto-generated method stub
		return askReplyDao.queryPageApp(page);
	}
	
	public List<AskReply> queryScoreRewardList(int pageSize) {
		return askReplyDao.queryScoreRewardList(pageSize);
	}

	public AskReply getAskReplyByPidAndMemberId(String memberId, String askId) {
		return askReplyDao.getAskReplyByPidAndMemberId(memberId, askId);
	}
	


	public int delete(AskReply askReply) {
		return askReplyDao.delete(askReply);
	}
	
	public AskReply get(String id) {
		return askReplyDao.get(id);
	}

	@Override
	public boolean isReplied(String askId, String memberId) {
		int count = askReplyDao.isReplied(askId,memberId);
		return count>0?true:false;
	}

	@Override
	public Page<AskReply> queryPage(Page<AskReply> page) {
		// TODO Auto-generated method stub
		return askReplyDao.queryPage(page);
	}

	@Override
	public int queryAskReplyCount(Page<AskReply> page) {
		// TODO Auto-generated method stub
		return askReplyDao.queryAskReplyCount(page);
	}

	@Override
	public AskReply getIsRecommendReplyLimtOne(String pid) {
		// TODO Auto-generated method stub
		return askReplyDao.getIsRecommendReplyLimtOne(pid);
	}
	
	@Override
	public List<AskReply> getExportPiciReplyInfo(String piciId){
		return askReplyDao.getExportPiciReplyInfo(piciId);
	}

	@Override
	public void rollBackAskReplyData(Map<String, String> parameterMap) {
		askReplyDao.rollBackAskReplyData(parameterMap);
	}

	@Override
	public List<AskReply> getExportReplyInfoByIds(List<String> pids) {
		return askReplyDao.getExportReplyInfoByIds(pids);
	}

	@Override
	public Page<AskPrice> getBestReplyByIds(Page<AskPrice> askPrices) {
		List<String> idList = getIdList(askPrices.getResult());
		if(idList.size() == 0)
			return askPrices;
		List<AskReply> askReplyList = askReplyDao.getBestReplyByIds(idList);
		Map<String,AskReply> askReplyMap = transToReplyMap(askReplyList);
		List<AskPrice> askPriceList = askPrices.getResult();
		for(AskPrice askPrice : askPriceList)
		{
			List<AskReply> replyList = Lists.newArrayList();
			replyList.add(askReplyMap.get(askPrice.getId()));
			askPrice.setAskReplys(replyList);
		}
		return askPrices;
	}
	
	/**
	 * 最佳回复只有一条，多余的不处理
	 * @param askReplyList
	 * @return
	 */
	private Map<String,AskReply> transToReplyMap(List<AskReply> askReplyList)
	{
		Map<String,AskReply> askReplyMap = new HashMap<String,AskReply>();
		if(askReplyList.isEmpty())
			return askReplyMap;
		for(AskReply askReply : askReplyList)
		{
			askReplyMap.put(askReply.getPid(), askReply);
		}
		return askReplyMap;
	}
	
	private List<String> getIdList(List<AskPrice> askPriceList)
	{
		List<String> idList = com.google.common.collect.Lists.newArrayList();
		if(askPriceList.isEmpty())
			return idList;
		for(AskPrice askPrice : askPriceList)
		{
			idList.add(askPrice.getId());
		}
		return idList;
	}

	@Override
	public Page<AskReply> queryPageForMyReply(Page<AskReply> page) {
		return askReplyDao.queryPageForMyReply(page);
	}

	@Override
	public int queryMyReplyCount(Page<AskReply> page) {
		
		return askReplyDao.queryMyReplyCount(page);
	}

	@Override
	public Page<AskReply> queryNewestBestReply(Page<AskReply> page) {
		// TODO Auto-generated method stub
		return askReplyDao.queryNewestBestReply(page);
	}
	@Override
	public AskReply findByMatchSecondBackReply(Map<String, String> params){
		return askReplyDao.findByMatchSecondBackReply(params);
	}
	
	/**
	 * 询价材价库列表
	 * @param parameterMap
	 * @return
	 */
	@Override
	public List<AskReply> getReplyLibraryList(Map<String, String> params){
		return askReplyDao.getReplyLibraryList(params);
	}
	@Override
	public int getReplyLibraryListCount(Map<String, String> params){
		return askReplyDao.getReplyLibraryListCount(params);
	}
	@Override
	public AskReply getBestReplyById(String pid) {
		return askReplyDao.getBestReplyById(pid);
	}

	@Override
	public AskReply getNewReplyById(String pid) {
		return askReplyDao.getNewReplyById(pid);
	}

	@Override
	public List<AskReply> getIsRecommendReplyList(Map<String, String> params) {
		return askReplyDao.getIsRecommendReplyList(params);
	}

	@Override
	public List<AskReply> queryPageReplys(Page<AskReply> page) {
		return askReplyDao.queryPageReplys(page);
	}

	@Override
	public Integer queryReplysCount(Page<AskReply> page) {
		return askReplyDao.queryReplysCount(page);
	}
	
}
