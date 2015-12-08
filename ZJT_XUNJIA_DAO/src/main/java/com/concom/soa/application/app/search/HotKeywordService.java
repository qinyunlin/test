package com.concom.soa.application.app.search;

import java.util.List;

public interface HotKeywordService {
	/**
	 * 热门搜索关键字
	 * @param n
	 * @return
	 */
	List<String> fetchTopN(int n);
	
	void recordKeyword(String keyword);
}
