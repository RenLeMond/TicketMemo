// pages/settings/settings.js
const storage = require('../../utils/storage.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    themeClass: '',
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
    lastBackupAt: '从未',
    icons: {
      settings: icons.FUNC.settings,
      encrypt: icons.FUNC.encrypt,
      backup: icons.FUNC.backup,
      filter: icons.FUNC.filter,
      calendar: icons.FUNC.calendar,
      trash: icons.FUNC.trash
    }
  },

  onShow() {
    this.refreshSettings();
  },

  refreshSettings() {
    const s = storage.getSettings();
    this.setData({
      themeClass: storage.getThemeClass(),
      settings: s,
      lastBackupAt: storage.get('last_backup_at', '从未')
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onTogglePassword(e) {
    const val = e.detail.value;
    if (val) {
      this.setData({ showPwdModal: true, pwdInput: '', pwdConfirm: '' });
    } else {
      wx.showModal({
        title: '关闭启动密码',
        content: '为确认本人操作，请输入当前 6 位密码',
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
          wx.showToast({ title: '已关闭密码保护', icon: 'none' });
        }
      });
    }
  },

  onPwdInput(e)    { this.setData({ pwdInput: e.detail.value }); },
  onPwdConfirm(e)  { this.setData({ pwdConfirm: e.detail.value }); },

  onSavePassword() {
    const { pwdInput, pwdConfirm } = this.data;
    if (!pwdInput || pwdInput.length < 6) {
      wx.showToast({ title: '密码需至少 6 位数字或字符', icon: 'none' });
      return;
    }
    if (pwdInput !== pwdConfirm) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' });
      return;
    }
    const s = Object.assign({}, this.data.settings, { passwordEnabled: true, password: pwdInput });
    storage.setSettings(s);
    this.setData({ settings: s, showPwdModal: false });
    wx.showToast({ title: '启动密码已开启 🌿', icon: 'success' });
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
    try { if (wx.vibrateShort) wx.vibrateShort({ type: 'light' }); } catch (err) {}
    const s = Object.assign({}, this.data.settings, { theme: t });
    storage.setSettings(s);
    this.setData({
      settings: s,
      themeClass: storage.getThemeClass()
    });
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.theme = t;
    }
    wx.showToast({ title: '已切换主题 🌿', icon: 'none', duration: 600 });
  },

  onPermissionTip() {
    wx.showModal({
      title: '权限透明声明',
      content: '小票日记严格遵守个人开发者隐私规范：\n\n• 相机：用于小票拍摄（仅本地离线使用）\n• 相册：用于导入小票或保存导出海报\n• 本地存储：用于保存小票手账记录\n\n绝无后台云端收集，绝不申请定位/通讯录/录音等权限。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  onWipe() {
    wx.showModal({
      title: '一键清空所有数据',
      content: '将永久删除全部小票、事件、自定义分类并重置演示数据。此操作不可撤销，确定清空？',
      confirmColor: '#B86F65',
      success: (r) => {
        if (!r.confirm) return;
        storage.resetAllData();
        this.refreshSettings();
        wx.showToast({ title: '已恢复初始状态 🌿', icon: 'success' });
      }
    });
  },

  noop() {}
});
