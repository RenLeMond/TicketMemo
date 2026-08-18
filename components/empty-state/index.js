const icons = require('../../utils/icons.js');

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    iconSrc: { type: String, value: icons.FUNC.empty },
    text: { type: String, value: '这里还空空的呢～' },
    sub: { type: String, value: '' }
  }
});
