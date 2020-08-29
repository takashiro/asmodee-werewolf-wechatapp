import { RoomConfig } from '@asmodee/werewolf-core';
import { client } from '../../base/Client';
import Room from '../../base/Room';

Page({
	roomId: 0,

	data: {
	},

	onLoad(options): void {
		if (options.roomId) {
			this.roomId = parseInt(options.roomId, 10) || 0;
			if (this.roomId) {
				this.enterRoom();
			}
		}
	},

	// 事件处理函数
	inputRoomNumber(e: WechatMiniprogram.InputEvent): void {
		this.roomId = parseInt(e.detail.value, 10);
	},

	createRoom(): void {
		wx.showLoading({
			title: '加载中……',
		});
		wx.navigateTo({
			url: '../room-creator/index',
			complete() {
				wx.hideLoading();
			},
		});
	},

	enterRoom(): void {
		if (!this.roomId) {
			wx.showToast({
				title: '请输入房间号。',
				icon: 'none',
			});
			return;
		}

		wx.showLoading({
			title: '加载中……',
		});
		client.get({
			url: `room/${this.roomId}`,
			success(res) {
				wx.hideLoading();
				if (res.statusCode === 404) {
					wx.showToast({
						title: '房间不存在。',
						icon: 'none',
					});
				} else if (res.statusCode !== 200) {
					wx.showToast({
						title: '加载房间信息失败。',
						icon: 'none',
					});
				} else {
					wx.showLoading({
						title: '加载房间信息……',
					});

					Room.setConfig(res.data as RoomConfig);
					wx.hideLoading();
					wx.navigateTo({
						url: '../room/index',
					});
				}
			},
			fail() {
				wx.hideLoading();
				wx.showToast({
					title: '网络故障，请重试。',
					icon: 'none',
				});
			},
		});
	},

	onShareAppMessage() {
		return {
			title: '狼人杀上帝助手',
			desc: '支持36种特殊角色，邀请好友线下面杀吧！',
			path: '/page/home/index',
		};
	},
});
