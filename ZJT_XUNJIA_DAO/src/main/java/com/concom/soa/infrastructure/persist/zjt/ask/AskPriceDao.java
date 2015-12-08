package com.concom.soa.infrastructure.persist.zjt.ask;

import java.util.List;
import java.util.Map;

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


/**
 * 
 * @author heyang
 *
 */
public interface AskPriceDao {
	/**
	 * 发布询价
	 * @param askPrice
	 */
	public int add(AskPrice askPrice);
	
	/**
	 * 修改询价
	 * @param askPrice
	 */
	public int update(AskPrice askPrice);
	
	/**
	 * 删除询价
	 * @param askPrice
	 */
	public int delete(AskPrice askPrice);
	
	/**
	 * 单条询价详情
	 * @param id
	 * @return
	 */
	public AskPrice get(String id);
	
	/**
	 * 获取今日推荐询价
	 * @param contents
	 * @param orderBy
	 * @return
	 */
	public List<AskPriceToMe> recommendAskPriceList(int pageSize);
	
	/**
	 * 查询询价列表
	 * @param page
	 * addby qinyunlin 2014-02-14
	 * @return
	 */
	public Page<AskPrice> queryPageAskPrice(Page<AskPrice> page);
	
	/**
	 * 添加询价附件
	 * @param aFile
	 */
	public void addAskPriceUploadFile(AskUploadFile aFile);
	
	
	/**
	 * 根据条件查询询价附件
	 * @param params
	 * @return
	 */
	public List<AskUploadFile> askUploadFiles(Map<String, String> params);
	
	/**
	 * 根据询价id删除询价附件
	 * @param askId
	 */
	public void delUploadFile(String askId);
	

	/**
	 * 查询会员分类回复询价统计表，得到会员不同分类下面的回复总数
	 * @param contents 查询的条件集合
	 * @return
	 */
	public List<CidAskCount> memberCidAskList(Map<String, String> params);
	
	/**
	 * 根据询价id查询询价是否存在补充说明
	 * @param askId
	 * @return
	 */
	public List<AskPriceAppContent> getAddAskPriceAppContentList(Map<String, String> params);
	
	
	/**
	 * 根据条件添加补充说明
	 * @param askId
	 * @return
	 */
	public void addAskPriceAppContent(AskPriceAppContent askPriceAppContent);
	
	/**
	 * 更新帮助回复询价信息
	 * @param askPriceHelp
	 */
	public void updateAskPriceHelp(AskPriceHelp askPriceHelp);

	/**
	 * 询价任务和询价分配列表总数
	 * @param page
	 * @return
	 */
	public int queryAskPriceCount(Page<AskPrice> page);
	
	
	/**
	 * 根据id串查询询价列表
	 * @param ids
	 * @return
	 */
	public List<AskPrice> getAskPriceByIds(List<String> ids);
	

	/**
	 * 根据条件查询热门询价
	 * @return
	 */
	public List<String> newAskPriceSubicd();
	
	/**
	 * 询价列表
	 * @param pageSize
	 * @param pageNo
	 * @param params
	 * @return
	 */
	public List<AskPrice> queryList(int pageSize, int pageNo, Map<String, String> params);
	
	/**
	 * 询价数量
	 * @param params
	 * @return
	 */
	public int queryCount(Map<String, String> params);
	
	/**
	 * 根据条件查询询价月完成量统计列表
	 * @param parans
	 * @return
	 */
	public List<AskMonthComplete> queryAskMonthCompleteList(Map<String, Object> parans);

	/**
	 * 评价库查询
	 * @param page
	 * @return
	 */
	public Page<Map<String, Object>> queryCommentLibrary(
			Page<Map<String, Object>> page);

	/**
	 * 根据条件查询询价月完成效率统计列表
	 * @param parans
	 * @return
	 */
	public List<AskMonthCompleteEfficiency> queryAskMonthCompleteEfficiencyList(Map<String, Object> params);
	
	/**
	 * 查询所有询价
	 * @return
	 */
	public List<AskPrice> queryAll();
	
	
	/**
	 * 查询所有询价id
	 * @return
	 */
	public List<String> getAskPriceIds();
	
	/**
	 * 修改询价工程名称
	 * @param askPrice
	 */
	public void updateProNameByPiciId(AskPrice askPrice);
	
	/**
	 * sso监控台：待完成任务总计
	 * @return
	 */
	public List<TasktodoCount> queryTasktodoCount();
	
	/**
	 * 根据批次id导出已经推荐询价列表
	 * @param piciId
	 * @return
	 */
	public List<AskPrice> getExportPiciAskInfo(String piciId);
	
	/**
	 * 根据批次id导出退回询价列表
	 * @param piciId
	 * @return
	 */
	public List<AskPrice> getExportPiciGobackAskInfo(String piciId);
	
	/**
	 * 获取列表
	 * @param params
	 * @return
	 */
	public List<AskPrice> findList(Map<String, String> params);
	
	/**
	 * 询价分配列表
	 * @param page
	 * @return
	 */
	public Page<AskPrice> queryPageAskPriceSso(Page<AskPrice> page);
	
	/**
	 * 询价分配列表总数
	 * @param page
	 * @return
	 */
	public int queryAskPriceSsoCount(Page<AskPrice> page);
	
	/**
	 * 询价任务列表
	 * @param page
	 * @return
	 */
	public Page<AskPrice> queryPageAskPriceTask(Page<AskPrice> page);
	
	/**
	 * 询价任务列表总数
	 * @param page
	 * @return
	 */
	public int queryAskPriceTaskCount(Page<AskPrice> page);
	
	/**
	 * 查找某批次下的询价列表
	 * @param piciId
	 * @return
	 */
	public List<AskPrice> queryAskPriceByPiciId(String piciId);
	
	/**
	 * 询价累积消耗积分
	 * @param eid
	 * @return
	 */
	public int getUseScoreByEid(String eid);
	
	/**
	 * 按批次导出询价
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> downloadAskPrice(Map<String, String> params);
	
	/**
	 * 按批次导出退回的询价
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> downloadAskPriceOfGoback(Map<String, String> params);

	/**
	 * 询价帮助总数
	 * @param params
	 * @return
	 */
	public int queryAskPriceHelpCount(Map<String, String> params);
	
	/**
	 * 存储过程初始化询价表，批次表的信息
	 * @param parameterMap
	 */
	public void initAskPriceInfo(Map<String, String> parameterMap);
	
	/**
	 * 询价累积消耗积分
	 * @param eid
	 * @return
	 */
	public int getTotalEarnScore();
	
	/**
	 * 根据询价ID获取询价附件总数
	 * @param askId
	 * @return
	 */
	public int getAskUploadFileCount(String askId);
	
	/**
	 * 查询最热询价
	 * @param params
	 * @return
	 */
	public List<AskPrice> getHotAskPrice(Map<String, String> params);
	/**
	 * 企业询价统计
	 * @param params
	 * @return
	 */
	public List<AskpriceVipTotal> queryCompanyAskPriceStatis(Map<String, Object> params);
	/**
	 * 企业询价统计合计
	 * @param parans
	 * @return
	 */
	public List<AskpriceVipTotal> queryCompanyAskPriceStatisTotal(Page<VipEpAccount> page);
	/**
	 * 个人询价统计
	 * @param parans
	 * @return
	 */
	public List<AskpriceVipTotal> queryPersonAskPriceStatis(Map<String, Object> params);
	/**
	 * 个人询价统计合计
	 * @param parans
	 * @return
	 */
	public List<AskpriceVipTotal> queryPersonAskPriceStatisTotal(Page<Member> page);
	/**
	  * 方法描述：根据询价统计年份
	  * @author: F.Bin
	  * @time: 2015-4-7 上午11:53:25
	 */
	public List<AskpriceVipTotal> queryAskPriceDynamicYear(Map<String, Object> params);
	
	public Page<AskpriceVipTotal> queryPageCompanyAskPriceStatis(Page<AskpriceVipTotal> page);
	
	public List<String> getAskPriceIdsAll(Map<String, Object> map);

	/**批量提交询价
	 * @param askPrices
	 * @return
	 */
	public int batchInsert(List<AskPrice> askPrices);
}
