package com.concom.soa.infrastructure.persist.zjt.ask;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.ask.AskPiciReturnVisitRecord;
import com.concom.lang.Page;
/**
 * 询价批次回访记录数据操作接口
 * @author rongliangkang
 *
 */
public interface AskPiciReturnVisitRecordDao {
	/**
	 * 新增
	 * @param record
	 * @return
	 */
	public int add(AskPiciReturnVisitRecord record);
	/**
	 * 查询
	 * @param params
	 * @return
	 */
	public List<AskPiciReturnVisitRecord> queryList(Map<String,Object> params);
	/**
	 * 分页查询
	 * @param page
	 * @return
	 */
	public Page<AskPiciReturnVisitRecord> queryPage(Page<AskPiciReturnVisitRecord> page);
}
