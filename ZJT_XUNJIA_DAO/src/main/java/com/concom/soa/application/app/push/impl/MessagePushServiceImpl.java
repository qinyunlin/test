package com.concom.soa.application.app.push.impl;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.push.CloudPush;
import com.concom.entity.dto.xunjia.app.push.MessageLog;
import com.concom.soa.application.app.push.CloudPushService;
import com.concom.soa.application.app.push.MessageLogService;
import com.concom.soa.application.app.push.MessagePushService;
import com.concom.soa.infrastructure.helper.MessageBuilder;
import com.concom.soa.infrastructure.helper.MessagePushHelper;


@Service()
public class MessagePushServiceImpl implements MessagePushService {

	@Autowired
	private MessagePushHelper messagePushHelper;
	@Autowired
	private CloudPushService cloudPushService;
	
	@Autowired
	private MessageLogService messageLogService;
	

	@Override
	public void unicastNotification(String memberId, String title,
			String description) {
		
		unicastNotification(memberId,title,description,MessageLog.MSG_TYPE_NORMAL,null);
	}

	@Override
	public void unicastNotification(String memberId, String title,
			String description, Integer messageType, String askId) {
		try {
			CloudPush cloudPush = cloudPushService.getBoundMsgByMemberId(memberId);
			String messages = null;
			if(cloudPush != null){
				Map<String, Object> customContent= new HashMap<String,Object>();
				if(StringUtils.isNotEmpty(askId)){
					customContent.put("askId", askId);
				}
				customContent.put("messageType", messageType);
				messagePushHelper.setUserId(cloudPush.getUserId());
				if(MessagePushHelper.DEVICE_TYPE_ANDROID == cloudPush.getDevice_type()){
					if(StringUtils.isNotEmpty(title)){
						messages = new MessageBuilder().title(title).description(description)
								.androidCustomContent(customContent)
								.createMessages();
					}else{
						messages = new MessageBuilder().description(description)
								.androidCustomContent(customContent)
								.createMessages();
					}
					messagePushHelper.androidPushNotification(messages);
				}else if(MessagePushHelper.DEVICE_TYPE_IOS == cloudPush.getDevice_type()){
					messages = new MessageBuilder().iosAps(description).iosCustomContent(customContent).createMessages();
					messagePushHelper.iosPushNotification(messages);
				}
				//消息日志
				MessageLog messageLog = new MessageLog();
				messageLog.setMemberId(memberId);
				messageLog.setTitle(title);
				messageLog.setDescription(description);
				messageLog.setDeviceType(cloudPush.getDevice_type());
				messageLog.setMobile(cloudPush.getMobile());
				messageLog.setMessages(messages);
				if(StringUtils.isNotBlank(String.valueOf(messageType))){
					messageLog.setMessageType(messageType);
				}
				messageLog.setAskId(askId);
				messageLogService.add(messageLog);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	@Override
	public void broadcastNotification(String title, String description) {
		String androidMsg = null;
		if(StringUtils.isNotEmpty(title)){
			androidMsg = new MessageBuilder().title(title).description(description).createMessages();
		}else{
			androidMsg = new MessageBuilder().description(description).createMessages();
		}
		String iosMsg = new MessageBuilder().iosAps(description).createMessages();
		messagePushHelper.androidPushBroadcastNotification(androidMsg);
		messagePushHelper.iosPushBroadcastNotification(iosMsg);
		
	}

	

}
