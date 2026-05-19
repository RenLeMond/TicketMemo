// pages/settings/settings.js
const storage = require('../../utils/storage.js');

Page({
  data: {
    settings: {
      passwordEnabled: false,
      password: '',
      autoBackup: false,
      compressImage: true,
      theme: 'light'
    },
    showPwdModal: false,
    pwdInput: '',
    pwdConfirm: '',
    lastBackupAt: '从未'
  },

  onShow() {
    this.setData({
      settings: storage.getSettings(),
      lastBackupAt: storage.get('last_backup_at', '从未')
    });
  },

  onTogglePassword(e) {
    const val = e.detail.value;
    if (val) {
      this.setData({ showPwdModal: true, pwdInput: '', pwdConfirm: '' });
    } else {
      wx.showModal({
        title: '关闭密码',
        content: '关闭密码需要验证当前密码',
        editable: true,
        placeholderText: '输入当前密码',
        success: (r) => {
          if (!r.confirm) {
            this.setData({ settings: Object.assign({}, this.data.settings) });
            return;
          }
          if (r.content !== this.data.settings.password) {
            wx.showToast({ title: '密码错误', icon: 'none' });
            this.setData({ settings: Object.assign({}, this.data.settings) });
            return;
          }
          const s = Object.assign({}, this.data.settings, { passwordEnabled: false, password: '' });
          storage.setSettings(s);
          this.setData({ settings: s });
          wx.showToast({ title: '已关闭密码', icon: 'none' });
        }
      });
    }
  },

  onPwdInput(e)    { this.setData({ pwdInput: e.detail.value }); },
  onPwdConfirm(e)  { this.setData({ pwdConfirm: e.detail.value }); },

  onSavePassword() {
    const { pwdInput, pwdConfirm } = this.data;
    if (!pwdInput || pwdInput.length < 6) {
      wx.showToast({ title: '密码至少 6 位', icon: 'none' });
      return;
    }
    if (pwdInput !== pwdConfirm) {
      wx.showToast({ title: '两次输入不一致', icon: 'none' });
      return;
    }
    const s = Object.assign({}, this.data.settings, { passwordEnabled: true, password: pwdInput });
    storage.setSettings(s);
    this.setData({ settings: s, showPwdModal: false });
    wx.showToast({ title: '密码已设置', icon: 'success' });
  },

  onCancelPassword() {
    this.setData({ showPwdModal: false, settings: Object.assign({}, this.data.settings) });
  },

  onToggleAutoBackup(e) {
    const s = Object.assign({}, this.data.settings, { autoBackup: e.detail.value });
    storage.setSettings(s);
    this.setData({ settings: s });
  },

  onToggleCompress(e) {
    const s = Object.assign({}, this.data.settings, { compressImage: e.detail.value });
    storage.setSettings(s);
    this.setData({ settings: s });
  },

  onPickTheme(e) {
    const t = e.currentTarget.dataset.theme;
    const s = Object.assign({}, this.data.settings, { theme: t });
    storage.setSettings(s);
    this.setData({ settings: s });
  },

  onPermissionTip() {
    wx.showModal({
      title: '权限说明',
      content: '本小程序仅申请：\n\n• 相机：拍摄小票（仅本地处理）\n• 相册：导入图片 / 保存导出文件\n• 本地存储：保存小票数据\n\n绝不申请位置、通讯录、麦克风等多余权限。',
      showCancel: false
    });
  },

  onWipe() {
    wx.showModal({
      title: '一键清空所有数据',
      content: '将永久删除全部小票、事件、分类与设置，且不可恢复。确认操作？',
      confirmColor: '#C97B47',
      success: (r) => {
        if (!r.confirm) return;
        storage.clear();
        storage.set('app_inited', false);
        const app = getApp();
        if (app && typeof app.onLaunch === 'function') app.onLaunch();
        setTimeout(() => this.onShow(), 600);
        wx.showToast({ title: '已清空并重置', icon: 'success' });
      }
    });
  }
});
