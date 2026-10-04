import { patcher, webpack } from "revenge";
import { setAudioOutputDevice } from "../utils.tsx";

export const patch = (storage: any, unpatches: Array<() => void>) => {
  const VoicePanelHeaderSpeaker = webpack.getByProps("VoicePanelHeaderSpeaker") || webpack.getBySource("VoicePanelHeaderSpeaker");

  if (!VoicePanelHeaderSpeaker) return unpatches;

  unpatches.push(
    patcher.after(VoicePanelHeaderSpeaker, "type", (args, res) => {
      if (args[0]?.isConnectedToVoiceChannel) {
        const savedDevice = storage.get("rememberOutputDevice.device");
        if (savedDevice) {
          setAudioOutputDevice(savedDevice);
        }
      }
      return res;
    })
  );

  return unpatches;
};
