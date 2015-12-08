package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

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
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceDao;

/**
 * 
 * @author shuye
 *
 */
@Repository
public class AskPriceDaoImpl extends MybatisOperations<String, AskPrice> implements AskPriceDao{

	
	
	public int add(AskPrice askPrice) {
		getSqlSession().insert(getNamespace().concat(".insert"), askPrice);
		return Integer.parseInt(askPrice.getId());
	}

	public List<AskPriceToMe> recommendAskPriceList(int pageSize) {
		return getSqlSession().selectList(getNamespace().concat(".getRecommendAskPrice"),pageSize);
	}

	public void addAskPriceUploadFile(AskUploadFile aFile) {
		// TODO Auto-generated method stub
		getSqlSession().insert(getNamespace().concat(".addUploadFile"), aFile);
		
	}

	public List<AskUploadFile> askUploadFiles(Map<String, String> params) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".askUploadFiles"),params);
	}

	public void delUploadFile(String askId) {
		// TODO Auto-generated method stub
		getSqlSession().delete(getNamespace().concat(".delUploadFile"),askId);
	}

	public List<CidAskCount> memberCidAskList(Map<String, String> params) {
		return getSqlSession().selectList(getNamespace().concat(".memberCidAskList"),params);
	}

	public List<AskPriceAppContent> getAddAskPriceAppContentList(
			Map<String, String> params) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".getAddAskPriceAppContentList"),params);
	}

	public void addAskPriceAppContent(AskPriceAppContent askPriceAppContent) {
		// TODO Auto-generated method stub
		getSqlSession().insert(getNamespace().concat(".addAskPriceAppContent"), askPriceAppContent);
	}

	public void updateAskPriceHelp(AskPriceHelp askPriceHelp) {
		// TODO Auto-generated method stub
		getSqlSession().update(getNamespace().concat(".updateAskPriceHelp"), askPriceHelp);
	}

	public List<AskPrice> getAskPriceByIds(List<String> ids) {
		Map<String, List<String>> maps=new HashMap<String, List<String>>();
		maps.put("ids", ids);
		return getSqlSession().selectList(getNamespace().concat(".getAskPriceByIds"), maps);
	}	
	
	public List<String> newAskPriceSubicd() {
		return getSqlSession().selectList(getNamespace().concat(".newAskPriceSubicd"));
	}
	
	public List<AskPrice> queryList(int pageSize, int pageNo, Map<String, String> params) {
		params.put("pageNo", Integer.toString(pageNo));
		params.put("pageSize", Integer.toString(pageSize));
		return getSqlSession().selectList(getNamespace().concat(".queryForPage"), params);
	}

	public int queryCount(Map<String, String> params) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryCount"), params);
	}

	@Override
	public Page<Map<String, Object>> queryCommentLibrary(
			Page<Map<String, Object>> page) {
		List<Map<String, Object>> results = getSqlSession().selectList(getNamespace().concat(".queryPageCommentLibrary"), page);
		page.setResult(results);
		return page;
	}
	
	@Override
	public List<AskMonthComplete> queryAskMonthCompleteList(
			Map<String, Object> parans) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".queryAskMonthCompleteList"), parans);
	}

	@Override
	public List<AskMonthCompleteEfficiency> queryAskMonthCompleteEfficiencyList(
			Map<String, Object> params) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".queryAskMonthCompleteEfficiencyList"), params);
	}
	@Override
	public Page<AskPrice> queryPageAskPrice(Page<AskPrice> page){
		List<AskPrice> askPrices = getSqlSession().selectList(getNamespace().concat(".queryPageAskPrice"), page);
		page.setResult(askPrices);
		return page;
	}

	@Override
	public int queryAskPriceCount(Page<AskPrice> page) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryAskPriceCount"), page);
	}

	@Override
	public List<AskPrice> queryAll() {
		// TODO Auto-generated method stub
		return  getSqlSession().selectList(getNamespace().concat(".queryAll"));
	}

	@Override
	public List<String> getAskPriceIds() {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".getAskPriceIds"));
	}

	@Override
	public void updateProNameByPiciId(AskPrice askPrice) {
		getSqlSession().update(getNamespace().concat(".updateProNameByPiciId"), askPrice);
	}

	@Override
	public List<TasktodoCount> queryTasktodoCount() {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".queryTasktodo"));
	}

	@Override
	public List<AskPrice> getExportPiciAskInfo(String piciId) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".getExportPiciAskInfo"), piciId);
	}
	
	@Override
	public List<AskPrice> findList(Map<String, String> params) {
		return getSqlSession().selectList(getNamespace().concat(".findList"), params);
	}

	@Override
	public Page<AskPrice> queryPageAskPriceSso(Page<AskPrice> page) {
		List<AskPrice> askPrices = getSqlSession().selectList(getNamespace().concat(".queryPageAskPriceSso"), page);
		page.setResult(askPrices);
		return page;
	}

	@Override
	public int queryAskPriceSsoCount(Page<AskPrice> page) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryAskPriceSsoCount"), page);
	}
	
	@Override
	public List<AskPrice> getExportPiciGobackAskInfo(String piciId){
		return getSqlSession().selectList(getNamespace().concat(".getExportPiciGobackAskInfo"), piciId);
	}

	@Override
	public List<AskPrice> queryAskPriceByPiciId(String piciId) {
		return getSqlSession().selectList(getNamespace().concat(".queryAskPriceByPiciId"),piciId);
	}

	@Override
	public Page<AskPrice> queryPageAskPriceTask(Page<AskPrice> page) {
		List<AskPrice> askPrices = getSqlSession().selectList(getNamespace().concat(".queryPageAskPriceTask"), page);
		page.setResult(askPrices);
		return page;
	}

	@Override
	public int queryAskPriceTaskCount(Page<AskPrice> page) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryAskPriceTaskCount"), page);
	}

	@Override
	public int getUseScoreByEid(String eid) {
		Object object = getSqlSession().selectOne(getNamespace().concat(".getUseScoreByEid"), eid);
		return object == null ? 0 : (Integer)object;
	}

	@Override
	public List<Map<String, Object>> downloadAskPrice(Map<String, String> params) {
		return getSqlSession().selectList(getNamespace().concat(".downloadAskPrice"), params);
	}

	@Override
	public List<Map<String, Object>> downloadAskPriceOfGoback(
			Map<String, String> params) {
		return getSqlSession().selectList(getNamespace().concat(".downloadAskPriceOfGoback"), params);
	}

	@Override
	public int queryAskPriceHelpCount(Map<String, String> params) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryAskPriceHelpCount"), params);
	}

	@Override
	public void initAskPriceInfo(Map<String, String> parameterMap) {
		getSqlSession().update(getNamespace().concat(".proAskPriceInfo"), parameterMap);
	}

	@Override
	public int getTotalEarnScore() {
		Object object = getSqlSession().selectOne(getNamespace().concat(".getTotalEarnScore"));
		return object == null ? 0 : (Integer)object;
	}

	@Override
	public int getAskUploadFileCount(String askId) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".getAskUploadFileCount"), askId);
	}
	
	@Override
	public List<AskPrice> getHotAskPrice(Map<String, String> params){
		return getSqlSession().selectList(getNamespace().concat(".getHotAskPrice"), params);
	}
	public List<AskpriceVipTotal> queryCompanyAskPriceStatis(Map<String, Object> params){
		return getSqlSession().selectList(getNamespace().concat(".queryCompanyAskPriceStatis"), params);
	}
	public List<AskpriceVipTotal> queryCompanyAskPriceStatisTotal(Page<VipEpAccount> page){
		return getSqlSession().selectList(getNamespace().concat(".queryCompanyAskPriceStatisTotal"), page);
	}
	public List<AskpriceVipTotal> queryPersonAskPriceStatis(Map<String, Object> params){
		return getSqlSession().selectList(getNamespace().concat(".queryPersonAskPriceStatis"), params);
	}
	public List<AskpriceVipTotal> queryPersonAskPriceStatisTotal(Page<Member> page){
		return getSqlSession().selectList(getNamespace().concat(".queryPersonAskPriceStatisTotal"), page);
	}
	public List<AskpriceVipTotal> queryAskPriceDynamicYear(Map<String, Object> params){
		return getSqlSession().selectList(getNamespace().concat(".queryAskPriceDynamicYear"), params);
	}
	public Page<AskpriceVipTotal> queryPageCompanyAskPriceStatis(Page<AskpriceVipTotal> page){
		List<AskpriceVipTotal> results = getSqlSession().selectList(getNamespace().concat(".queryPageCompanyAskPriceStatis"), page);
		return page.setResult(results);
	}

	@Override
	public List<String> getAskPriceIdsAll(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return getSqlSession().selectList(getNamespace().concat(".getAskPriceIdsAll"),map);
	}

	@Override
	public int batchInsert(List<AskPrice> askPrices) {
		// TODO Auto-generated method stub
		return getSqlSession().insert(getNamespace().concat(".batchInsert"),askPrices);
	}
}
