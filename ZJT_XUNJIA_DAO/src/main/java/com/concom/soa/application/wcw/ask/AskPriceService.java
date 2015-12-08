package com.concom.soa.application.wcw.ask;

import java.util.List;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.lang.Page;

/**
 * 
 * @author zhengreat
 *
 */
public interface AskPriceService {

	public AskPrice getAskPriceById(String askId);
	
	public List<AskPrice> getAskPriceByIds(List<String> ids);
	
	
	public Page<AskPrice> queryPageForWcwSJB(int currentPage, int pageSize, List<String> keywords, String fiterKey, String cgSubcid,String cgCid,String memberId,boolean isReply);
	
	public int queryForWcwSJBCount(List<String> keywords, String fiterKey, String cgSubcid,String cgCid,
			String memberId, boolean isReply);
}
