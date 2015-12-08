package com.concom.soa.infrastructure.persist.zjt.ask;

import java.util.List;

import com.concom.entity.dto.xunjia.ask.AskPricePici;
import com.concom.entity.dto.xunjia.ask.DateValue;
import com.concom.entity.dto.xunjia.ask.PiCiServiceLog;
import com.concom.lang.Page;

public interface AskPricePiciDao {
	/**
	 * 添加询价批准
	 * @param askPricePici
	 */
	public void add(AskPricePici askPricePici);
	
	/**
	 * 查询询价批准列表
	 * @param page
	 * @return
	 */
	public Page<AskPricePici> queryPage(Page<AskPricePici> page);
	
	/**
	 * 查询询价批准总数
	 * @param page
	 * @return
	 */
	public int queryCount(Page<AskPricePici> page);
	
	/**
	 * 更新批次信息
	 * @param askPricePici
	 * @return
	 */
	public int update(AskPricePici askPricePici);
	
	/**
	 * 获取批次详情信息
	 * @param askPricePici
	 * @return
	 */
	public AskPricePici get(String piciId);
	
	/**
	 * 添加批次日志
	 * @param piCiServiceLog
	 * @return
	 */
	public int addPiciLog(PiCiServiceLog piCiServiceLog);
	
	/**
	 * 通过eid获取批次的日期树
	 * @param eid
	 * @return
	 */
	public List<DateValue> getDateTreeOfPici(String eid);
	
	/**
	 * 查看询价服务记录
	 * @param piciId
	 * @return
	 */
	public List<PiCiServiceLog> getPiciServiceLog(String piciId);
	
	/**
	 * 删除询价批次
	 * @param askPrice
	 */
	public void delete(String piciId);
	
	/**
	 * 删除询价批次
	 * @param askPrice
	 */	public void deleteByPiciId(String piciId);
	 
	/**
	 * 询价明细统计
	 * @param page
	 * @return
	 */
	public Page<AskPricePici> queryXunjiaInfoStatistic(Page<AskPricePici> page);
	/**
	 * 询价明细统计总数
	 * @param page
	 * @return
	 */
	public int queryXunjiaInfoStatisticCount(Page<AskPricePici> page);
}
