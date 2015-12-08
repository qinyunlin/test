package com.concom.soa.infrastructure.persist.zjt.reply;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.reply.AskComments;
import com.concom.lang.Page;

public interface AskCommentsDao {
	/**
	 * 添加评论接口
	 * @param askComments
	 */
	public void add(AskComments askComments);
	
	/**
	 * 查询评论借口
	 * @param params
	 * @return
	 */
	public List<AskComments> queryList(Map<String, String> params);
	
	/**
	 * 根据条件删除评论
	 * @param params
	 */
    public void del(Map<String, String> params);
    /**
     * 分页查询
     * @param page
     * @return
     */
	public Page<AskComments> queryPage(Page<AskComments> page);
	/**
	 * 分页查询，包含fromuser和touser信息
	 * @param page
	 * @return
	 */
	public Page<AskComments> queryPageAskComments(Page<AskComments> page);
	
	/**
	 * 获取某条询价回复下的评论总数
	 * @param params
	 * @return
	 */
	public int queryCount(Map<String, String> params);
}
