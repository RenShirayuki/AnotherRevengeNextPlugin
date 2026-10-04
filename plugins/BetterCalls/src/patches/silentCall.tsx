import { patcher, webpack } from "revenge";

export const patch = (storage: any, unpatches: Array<() => void>) => {
  const callModule = webpack.getByProps("call", "ring", "stopRinging");

  if (!callModule) return unpatches;

  // Intercept fungsi ringing panggilan
  unpatches.push(
    patcher.instead(callModule, "ring", (args, origFunc) => {
      const channelId = args[0];
      const isSilent = storage.get(`silentCall.users.${channelId}`) ?? storage.get("silentCall.default");

      if (!isSilent) {
        return origFunc.apply(callModule, args);
      }
    })
  );

  return unpatches;
};
