import { defineSettings, setting } from '@unbound-app/settings/schema';

export default defineSettings({
  isEnabled: setting.boolean({
    default: true,
    title: 'ENABLED',
    subtitle: 'ENABLED_DETAIL',
  }),
  showTypingIn: setting.string({
    default: '',
    title: 'EXCEPTIONS',
    subtitle: 'EXCEPTIONS_DETAIL',
  }),
  showIcon: setting.boolean({
    default: false,
    title: 'SHOW_ICON',
    subtitle: 'SHOW_ICON_DETAIL',
  }),
  contextMenu: setting.boolean({
    default: true,
    title: 'SHOW_MENU',
    subtitle: 'SHOW_MENU_DETAIL',
  }),
});
