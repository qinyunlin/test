package com.concom.soa.application.app.push;

import com.concom.entity.dto.xunjia.app.push.CloudPush;


/**
 * 消息推送之终端信息绑定
 * @author handself
 *
 */
public interface CloudPushService {
	/**
	 * 获取绑定信息
	 * @param memberId
	 * @return
	 */
	CloudPush getBoundMsgByMemberId(String memberId);

	/**
	 * 解绑
	 * @param memberId
	 */
	void unBoundByMemberId(String memberId);
	/**
	 * 更新终端绑定信息
	 * @param cloudPush
	 */
	void boundUpdate(CloudPush cloudPush);
	/**
	 * 绑定终端
	 * @param cloudPush
	 */
	void bound(CloudPush cloudPush);
}
