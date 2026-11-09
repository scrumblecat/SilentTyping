# SilentTyping

An Unbound plugin that hides your typing indicator in Discord on iOS.

## What is this?

When you start writing a message, the plugin stops your phone from sending the typing signal. The setting applies on each iPhone where you install it.

## How do I install it?

You'll need [Unbound](https://unbound.rip/docs/user/installing) on your iPhone.

1. In Discord, open **Settings → Unbound → Plugins → + → Install from URL**.
2. Paste this link:

   ```text
   https://raw.githubusercontent.com/scrumblecat/SilentTyping/main/dist/manifest.json
   ```

3. Turn on **Silent Typing** in Plugins.

## Can I change the settings?

Run `/silenttype` in a chat to toggle it. Use `value:true` to hide your typing or `value:false` to show it again. Only you see the confirmation.

In the plugin settings, enter comma-separated channel IDs under **Always show typing in**. You can also add a keyboard button next to the message box or turn off the toggle in the channel long-press menu.

## How do I test it?

The bundle has passed local checks and still needs an iPhone test. Open a DM with someone who can watch from another account. Start typing with Silent Typing on, then run `/silenttype value:false` and type again. Check that they only see the indicator the second time.

## How do I build it?

You'll need Bun and a checkout of [Unbound at `78f0797`](https://github.com/marioparaschiv/unbound/commit/78f0797fa6458dde665039ea3e629f44aaa). In the Unbound checkout, run `bun install --filter @unbound-app/cli --ignore-scripts`. Set `UNBOUND_SOURCE` to the absolute path of that checkout, then run this in the plugin folder:

```sh
bun install
bun --bun run build
```

The build goes into `dist/`. To try it without hosting the files, [connect your iPhone to Unbound's debugger](https://unbound.rip/docs/developer/development/debugging#connecting-a-device), then run `bunx @unbound-app/cli@0.11.0 push . --build=false`.

## Credits

Based on [Vencord's SilentTyping](https://github.com/Vendicated/Vencord/tree/main/src/plugins/silentTyping) by Ven, Rini, and ImBanana. The iOS port and this README were written with Codex.

Licensed under GPL-3.0-or-later. See [LICENSE](LICENSE).
