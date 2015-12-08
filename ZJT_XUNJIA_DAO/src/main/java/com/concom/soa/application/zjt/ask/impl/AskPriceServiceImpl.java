package com.concom.soa.application.zjt.ask.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.member.Member;
import com.concom.entity.dto.vip.VipEpAccount;
import com.concom.entity.dto.xunjia.ask.AskMonthComplete;
import com.concom.entity.dto.xunjia.ask.AskMonthCompleteEfficiency;
import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.entity.dto.xunjia.ask.AskPriceAppContent;
import com.concom.entity.dto.xunjia.ask.AskPriceHelp;
import com.concom.entity.dto.xunjia.ask.AskPriceToMe;
import com.concom.entity.dto.xunjia.ask.AskUploadFile;
import com.concom.entity.dto.xunjia.ask.AskpriceVipTotal;
import com.concom.entity.dto.xunjia.ask.CidAskCount;
import com.concom.entity.dto.xunjia.ask.TasktodoCount;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.ask.AskPriceService;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceDao;


/**
 * 
 * @author heyang
 *
 */
@Service
public  class AskPriceServiceImpl implements AskPriceService{
	
	@Autowired
	private AskPriceDao askPriceDao;

	public int add(AskPrice askPrice) {
		return askPriceDao.add(askPrice);
	}

	public void lockAskPrice(String memberId, String isLock, String... ids) {
		
	}

	public void update(AskPrice askPrice) {
		askPriceDao.update(askPrice);
	}
	
	public void delete(String... ids){
		for(String id : ids){
			AskPrice askPrice = new AskPrice();
			askPrice.setId(id);
			askPriceDao.delete(askPrice);
		}
	}

	public AskPrice get(String id) {
		return askPriceDao.get(id);
	}
	
	public List<AskPriceToMe> recommendAskPriceList(int pageSize) {
		return askPriceDao.recommendAskPriceList(pageSize);
	}

	public Page<AskPrice> queryPageAskPrice(Page<AskPrice> page) {
		// TODO Auto-generated method stub
		return askPriceDao.queryPageAskPrice(page);
	}

	public void addAskPriceUploadFile(AskUploadFile aFile) {
		// TODO Auto-generated method stub
		askPriceDao.addAskPriceUploadFile(aFile);
	}

	public List<AskUploadFile> askUploadFiles(Map<String, String> params) {
		// TODO Auto-generated method stub
		return askPriceDao.askUploadFiles(params);
	}

	public void delUploadFile(String askId) {
		// TODO Auto-generated method stub
		askPriceDao.delUploadFile(askId);
	}

	public List<CidAskCount> memberCidAskList(Map<String, String> params) {
		// TODO Auto-generated method stub
		return askPriceDao.memberCidAskList(params);
	}

	public List<AskPriceAppContent> getAddAskPriceAppContentList(
			Map<String, String> params) {
		// TODO Auto-generated method stub
		return askPriceDao.getAddAskPriceAppContentList(params);
	}

	public void addAskPriceAppContent(AskPriceAppContent askPriceAppContent) {
		// TODO Auto-generated method stub
		askPriceDao.addAskPriceAppContent(askPriceAppContent);
	}

	public void updateAskPriceHelp(AskPriceHelp askPriceHelp) {
		// TODO Auto-generated method stub
		askPriceDao.updateAskPriceHelp(askPriceHelp);
	}

	public List<String> newAskPriceSubicd() {
		// TODO Auto-generated method stub
		return askPriceDao.newAskPriceSubicd();
	}
	
	public List<AskPrice> getAskPriceByIds(List<String> ids) {
		return askPriceDao.getAskPriceByIds(ids);
	}

	public List<AskPrice> queryList(int pageSize, int pageNo,
			Map<String, String> params) {
		return askPriceDao.queryList(pageSize, pageNo, params);
	}

	public int queryCount(Map<String, String> params) {
		return askPriceDao.queryCount(params);
	}

	@Override
	public Page<Map<String, Object>> queryCommentLibrary(Page<Map<String, Object>> page) {
		return askPriceDao.queryCommentLibrary(page);
	}
	

	@Override
	public List<AskMonthComplete> queryAskMonthCompleteList(Map<String, Object> parans) {
		// TODO Auto-generated method stub
		return askPriceDao.queryAskMonthCompleteList(parans);
	}

	@Override
	public List<AskMonthCompleteEfficiency> queryAskMonthCompleteEfficiencyList(
			Map<String, Object> params) {
		// TODO Auto-generated method stub
		return askPriceDao.queryAskMonthCompleteEfficiencyList(params);
	}
	
	@Override
	public int queryAskPriceCount(Page<AskPrice> page) {
		// TODO Auto-generated method stub
		return askPriceDao.queryAskPriceCount(page);
	}
	@Override
	public int queryAskPriceHelpCount(Map<String, String> params) {
		// TODO Auto-generated method stub
		return askPriceDao.queryAskPriceHelpCount(params);
	}

	@Override
	public List<AskPrice> queryAll() {
		// TODO Auto-generated method stub
		return askPriceDao.queryAll();
	}
	@Override
	public List<String> getAskPriceIds() {
		// TODO Auto-generated method stub
		return askPriceDao.getAskPriceIds();
	}

	@Override
	public void updateProNameByPiciId(AskPrice askPrice) {
		// TODO Auto-generated method stub
		askPriceDao.updateProNameByPiciId(askPrice);
	}

	@Override
	public List<TasktodoCount> queryTasktodoCount() {
		// TODO Auto-generated method stub
		return askPriceDao.queryTasktodoCount();
	}

	@Override
	public List<AskPrice> getExportPiciAskInfo(String piciId) {
		// TODO Auto-generated method stub
		return askPriceDao.getExportPiciAskInfo(piciId);
	}
	
	@Override
	public List<AskPrice> findList(Map<String, String> params) {
		return askPriceDao.findList(params);
	}

	@Override
	public Page<AskPrice> queryPageAskPriceSso(Page<AskPrice> page) {
		return askPriceDao.queryPageAskPriceSso(page);
	}

	@Override
	public int queryAskPriceSsoCount(Page<AskPrice> page) {
		return askPriceDao.queryAskPriceSsoCount(page);
	}

	@Override
	public List<AskPrice> getExportPiciGobackAskInfo(String piciId) {
		return askPriceDao.getExportPiciGobackAskInfo(piciId);
	}

	@Override
	public List<AskPrice> queryAskPriceByPiciId(String piciId) {
		return askPriceDao.queryAskPriceByPiciId(piciId);
	}

	@Override
	public Page<AskPrice> queryPageAskPriceTask(Page<AskPrice> page) {
		return askPriceDao.queryPageAskPriceTask(page);
	}

	@Override
	public int queryAskPriceTaskCount(Page<AskPrice> page) {
		return askPriceDao.queryAskPriceTaskCount(page);
	}

	@Override
	public int getUseScoreByEid(String eid) {
		return askPriceDao.getUseScoreByEid(eid);
	}

	@Override
	public List<Map<String, Object>> downloadAskPrice(Map<String, String> params) {
		return askPriceDao.downloadAskPrice(params);
	}

	@Override
	public List<Map<String, Object>> downloadAskPriceOfGoback(
			Map<String, String> params) {
		return askPriceDao.downloadAskPriceOfGoback(params);
	}

	public void initAskPriceInfo(Map<String, String> parameterMap) {
		askPriceDao.initAskPriceInfo(parameterMap);
	}

	@Override
	public int getTotalEarnScore() {
		return askPriceDao.getTotalEarnScore();
	}

	@Override
	public int getAskUploadFileCount(String askId) {
		return askPriceDao.getAskUploadFileCount(askId);
	}
	
	@Override
	public List<AskPrice> getHotAskPrice(Map<String, String> params) {
		return askPriceDao.getHotAskPrice(params);
	}
	public List<AskpriceVipTotal> queryCompanyAskPriceStatis(Map<String, Object> params){
		return askPriceDao.queryCompanyAskPriceStatis(params);
	}
	public List<AskpriceVipTotal> queryCompanyAskPriceStatisTotal(Page<VipEpAccount> page){
		return askPriceDao.queryCompanyAskPriceStatisTotal(page);
	}
	public List<AskpriceVipTotal> queryPersonAskPriceStatis(Map<String, Object> params){
		return askPriceDao.queryPersonAskPriceStatis(params);
	}
	public List<AskpriceVipTotal> queryPersonAskPriceStatisTotal(Page<Member> page){
		return askPriceDao.queryPersonAskPriceStatisTotal(page);
	}
	public List<AskpriceVipTotal> queryAskPriceDynamicYear(Map<String, Object> params){
		return askPriceDao.queryAskPriceDynamicYear(params);
	}
	public Page<AskpriceVipTotal> queryPageCompanyAskPriceStatis(Page<AskpriceVipTotal> page){
		return askPriceDao.queryPageCompanyAskPriceStatis(page);
	}

	@Override
	public List<String> getAskPriceIdsAll(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return askPriceDao.getAskPriceIdsAll(map);
	}

	@Override
	public int batchInsert(List<AskPrice> askPrices) {
		// TODO Auto-generated method stub
		return askPriceDao.batchInsert(askPrices);
	}
}
