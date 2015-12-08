/**
 * 
 */
package com.concom.soa.infrastructure.persist.zjt.ask;

import com.concom.entity.dto.xunjia.ask.UploadInfo;


/**
 * 上传时工程师信息参数
 * @author iceray
 *
 */
public interface AskPriceUploadInfoDao {

	/**
	 * 上传时保存工程师信息
	 * @param uploadInfo
	 */
	void addInfo(UploadInfo uploadInfo);
	
	/**
	 * 获取上次上传时工程师信息
	 * @param memberId
	 * @return
	 */
	UploadInfo getUploadInfo(String memberId);
}
