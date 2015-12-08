package com.concom.soa.infrastructure.persist.zjt.reply;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.lang.Page;


/**
 * 
 * @author heyang
 *
 */
public interface AskReplyDao {
	
	/**
	 * 大家都在询价
	 * @param pageSize
	 * @return
	 */
	public List<AskReply> queryEveryoneInquiryList(int pageSize);
	
	/**
	 * 根据条件查询回复信息
	 * @param params
	 * @return
	 */
	public List<AskReply> getAskReply(Map<String, String> params);
	
	/**
	 * 修改询价信息
	 * @param askReply
	 */
	public void updateAdkReply(AskReply askReply);
	
	/**
	 * 保存询价回复
	 * @param askReply
	 */
	public int addAskReply(AskReply askReply);
	
	/**
	 * 根据条件查询总数
	 * @param params
	 * @return
	 */
	public int queryCount(Map<String, String> params);
	
	
	/**
	 * app端分页查询回复列表
	 * @param page
	 * @return
	 */
    public Page<AskReply> queryPageApp(Page<AskReply> page);
    
    /**
	 * 积分悬赏动态榜
	 * @param pageSize
	 * @return
	 */
	public List<AskReply> queryScoreRewardList(int pageSize);
	
	/**
	 * 用户是否回复了一条询价，有则返回
	 * @param uid
	 * @param askId
	 * @return
	 */
	public AskReply getAskReplyByPidAndMemberId(String memberId, String askId);
	
	/**
	 * 根据page条件查询总数
	 * @param page
	 * @return
	 */
	public int queryAskReplyCount(Page<AskReply> page);
	
	
	/**
	 * 删除回复
	 * @param askReply
	 * @return
	 */
	public int delete(AskReply askReply);
	
	/**
	 * 获取回复详情
	 * @param id
	 * @return
	 */
	public AskReply get(String id);

	public int isReplied(String askId, String memberId);
	
	/**
	 * 查询回复列表
	 * @param page
	 * @return
	 */
	public Page<AskReply> queryPage(Page<AskReply> page);
	
	/**
	 * 根据询价id得到询价的多条回复中最新推荐的回复
	 * @param pid
	 * @return
	 */
	public AskReply getIsRecommendReplyLimtOne(String pid);
	
	/**
	 * 根据批次id导出已经推荐询价回复列表
	 * @param piciId
	 * @return
	 */
	public List<AskReply> getExportPiciReplyInfo(String piciId);
	
	/**
	 * 询价任务导入推荐出错时回滚数据
	 * @param parameterMap
	 */
	public void rollBackAskReplyData(Map<String, String> parameterMap);
	
	/**
	 * 根据询价id导出已经推荐询价回复列表
	 * @param pids
	 * @return
	 */
	public List<AskReply> getExportReplyInfoByIds(List<String> pids);
	
	/**
	 * 根据ID列表获取最佳回复列表
	 */
	public List<AskReply> getBestReplyByIds(List<String> pids);
	/**
	 * 会员五期，我回复的询价
	 * @param page
	 * @return
	 */
	public Page<AskReply> queryPageForMyReply(Page<AskReply> page);
	/**
	 * 会员五期，我回复询价的总数
	 * @param page
	 * @return
	 */
	public int queryMyReplyCount(Page<AskReply> page);

	/**
	 * 获取最新解决的询价列表
	 * @param page
	 * @return
	 */
	public Page<AskReply> queryNewestBestReply(Page<AskReply> page);
	
	/**
	  * 方法描述：系统秒回自动匹配：
	  * 1、回复询价数据两个月内进行匹配；
	  * 2、材料名称、型号规格这二个字段完全匹配；
	  * 3、若发布询价时有指定品牌，那么在秒回时品牌必须完全匹配，若发布时品牌为空，则可以任意匹配品牌；
	  * 4、批次导入询价：报价地区到市级，则无需秒回；
	  * 5、“秒回”需要写入数据字段与询价任务导入的数据一致；
	  * 6、只有审核通过的“秒回”信息才在询价圈显示出来；
	  * @author: F.Bin
	  * @time: 2015-3-17 下午2:25:23
	 */
	public AskReply findByMatchSecondBackReply(Map<String, String> params);
	
	/**
	 * 询价材价库列表
	 * @param parameterMap
	 * @return
	 */
	public List<AskReply> getReplyLibraryList(Map<String, String> params);
	
	public int getReplyLibraryListCount(Map<String, String> params);
	
	/**
	 * 根据询价id获取一条最佳回复
	 * @param pid
	 * @return
	 */
	public AskReply getBestReplyById(String pid);
	
	/**
	 * 根据询价id获取一条最新回复
	 * @param pid
	 * @return
	 */
	public AskReply getNewReplyById(String pid);
	
	/**获取被推荐的回复
	 * @param params
	 * @return
	 */
	public List<AskReply> getIsRecommendReplyList(Map<String, String> params);
	/**
	 * 查询回复，包含相应询价部分信息
	 * @param page
	 * @return
	 */
	public List<AskReply> queryPageReplys(Page<AskReply> page);
	/**
	 * 统计回复，包含相应询价部分信息
	 * @param page
	 * @return
	 */
	public Integer queryReplysCount(Page<AskReply> page);
	
}
