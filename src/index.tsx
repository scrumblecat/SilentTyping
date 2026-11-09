// SPDX-License-Identifier: GPL-3.0-or-later
// Mobile adaptation of SilentTyping by Ven, Rini and ImBanana for Vencord.
import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { Image, Pressable, View } from 'react-native';
import { assets, commands, metro, patcher } from '@unbound-app/api';
import { BottomSheets } from '@unbound-app/api/metro/components';
import { messages } from '@unbound-app/i18n';
import { settings, useSetting } from '@unbound-app/settings';

const Typing = metro.findByProps('startTyping', 'stopTyping');
const ComposerActions = metro.findByFilePath(
  'modules/chat_input/native/action_buttons/ChatInputRightActions.tsx',
);
const ChannelMenu = metro.findByFilePath(
  'modules/channel/native/ChannelLongPressActionSheet.tsx',
);

function toggle(value?: boolean): boolean {
  settings.isEnabled = value ?? !settings.isEnabled;
  return settings.isEnabled;
}

function label(enabled: boolean): string {
  return enabled ? messages.TURN_OFF : messages.TURN_ON;
}

function ComposerToggle() {
  const showIcon = useSetting('showIcon');
  const enabled = useSetting('isEnabled');
  if (!showIcon) return null;

  const color = metro.common.Theme.colors?.INTERACTIVE_ICON_DEFAULT ?? '#85858f';
  return (
    <Pressable
      accessibilityLabel={label(enabled)}
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      hitSlop={6}
      onPress={() => toggle()}
      style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
    >
      <Image
        source={assets.getIdByName('KeyboardIcon')}
        style={{ width: 20, height: 20, tintColor: color }}
      />
      {enabled && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 23,
            height: 2,
            borderRadius: 1,
            backgroundColor: '#ed4245',
            transform: [{ rotate: '-45deg' }],
          }}
        />
      )}
    </Pressable>
  );
}

function ChannelMenuToggle() {
  const showMenu = useSetting('contextMenu');
  const enabled = useSetting('isEnabled');
  if (!showMenu) return null;

  const Row = BottomSheets.ActionSheetRow;
  return <Row label={label(enabled)} onPress={() => toggle()} />;
}

type RowProps = {
  children?: ReactNode;
  hasIcons?: boolean;
  label?: string;
  onPress?: () => void;
};

function addMenuToggle(node: ReactNode): ReactNode {
  if (Array.isArray(node)) return node.map(addMenuToggle);
  if (!isValidElement<RowProps>(node)) return node;

  const { children, hasIcons } = node.props;
  const rows = Children.toArray(children);
  const type = node.type as { displayName?: string; name?: string };
  const isRowGroup = (type.displayName ?? type.name) === 'ActionSheetRowGroup' ||
    (typeof hasIcons === 'boolean' && rows.length > 0 &&
      rows.every((row) =>
        isValidElement<RowProps>(row) &&
        typeof row.props.label === 'string' &&
        typeof row.props.onPress === 'function'
      ));

  if (isRowGroup) {
    return cloneElement(node, undefined, children, <ChannelMenuToggle key="silent-typing" />);
  }

  return children == null ? node : cloneElement(node, undefined, addMenuToggle(children));
}

export function start() {
  patcher.instead(Typing, 'startTyping', ({ args, original }) => {
    const [channelId] = args;
    const allowed = typeof channelId === 'string' && channelId.length > 0 &&
      settings.showTypingIn.split(',').some((id) => id.trim() === channelId);
    if (settings.isEnabled && !allowed) return;
    return original(...args);
  });

  commands.register({
    silenttype: {
      description: 'COMMAND_DETAIL',
      options: { value: commands.option.boolean({ description: 'COMMAND_VALUE' }) },
      execute: ({ value }) => ({
        ephemeral: true,
        content: toggle(value) ? messages.TURNED_ON : messages.TURNED_OFF,
      }),
    },
  });

  patcher.react.after(ComposerActions, 'default', ({ result }) => {
    if (!isValidElement<{ children?: ReactNode }>(result)) return;
    return cloneElement(
      result,
      undefined,
      <ComposerToggle key="silent-typing" />,
      result.props.children,
    );
  });

  patcher.react.after(ChannelMenu, 'default', ({ result }) => addMenuToggle(result as ReactNode));
}
