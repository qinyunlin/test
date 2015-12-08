/**
 * 
 */
package com.concom.soa.application.zjt.ask;

import com.concom.entity.dto.xunjia.ask.UploadInfo;


/**
 * @author iceray
 *
 */
public interface UploadInfoService {

	/**
	 * 上传文件工程师信息保存方
	 * @param uploadInfo
	 */
	void addUploadInfo(UploadInfo uploadInfo);
	
	/**
	 * 获取上传文件工程师信息
	 * @param memberId
	 * @return
	 */
	UploadInfo getUploadInfo(String memberId);
}
