// src/patches/rememberOutputDevice.tsx
import { patcher, webpack as webpack3 } from "revenge";

// src/utils.tsx
import { webpack as webpack2 } from "revenge";

// src/components/AudioOutputDevicesSelectionSheet.tsx
import { React as React2, ReactNative } from "revenge/common";
import { webpack } from "revenge";

// src/utils.tsx
var AudioDeviceModule = webpack2.getByProps("getAudioDevices", "setAudioOutputDevice");
var AudioDeviceIcons = webpack2.getByProps("audioDeviceToIconMap");
var ActionSheetModule = webpack2.getByProps("openLazy", "hideActionSheet");
var getAudioDevices = () => AudioDeviceModule?.getAudioDevices() || [];
var setAudioOutputDevice = (device) => AudioDeviceModule?.setAudioOutputDevice(device);

// src/patches/rememberOutputDevice.tsx
var patch = (storage, unpatches2) => {
  const VoicePanelHeaderSpeaker = webpack3.getByProps("VoicePanelHeaderSpeaker") || webpack3.getBySource("VoicePanelHeaderSpeaker");
  if (!VoicePanelHeaderSpeaker) return unpatches2;
  unpatches2.push(
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
  return unpatches2;
};

// src/patches/silentCall.tsx
import { patcher as patcher2, webpack as webpack4 } from "revenge";
var patch2 = (storage, unpatches2) => {
  const callModule = webpack4.getByProps("call", "ring", "stopRinging");
  if (!callModule) return unpatches2;
  unpatches2.push(
    patcher2.instead(callModule, "ring", (args, origFunc) => {
      const channelId = args[0];
      const isSilent = storage.get(`silentCall.users.${channelId}`) ?? storage.get("silentCall.default");
      if (!isSilent) {
        return origFunc.apply(callModule, args);
      }
    })
  );
  return unpatches2;
};

// manifest.json
var manifest_default = {
  name: "Better Calls",
  description: "Adds more options to calling, such as silent calls, call confirmations, and more",
  authors: [
    {
      name: "RenS"
    }
  ],
  main: "./src/index.tsx",
  vendetta: {
    icon: "icon-call"
  }
};

// src/index.tsx
var createStorage = () => {
  const data = {
    "silentCall.enabled": true,
    "silentCall.default": false,
    "silentCall.users": {},
    "rememberOutputDevice.enabled": false,
    "rememberOutputDevice.device": void 0
  };
  return {
    get: (key) => data[key],
    set: (key, val) => {
      data[key] = val;
    },
    unset: (key) => {
      delete data[key];
    }
  };
};
var pluginStorage = createStorage();
var unpatches = [];
var index_default = {
  ...manifest_default,
  onStart() {
    const devices = getAudioDevices();
    if (devices.length > 0 && !pluginStorage.get("rememberOutputDevice.device")) {
      pluginStorage.set("rememberOutputDevice.device", devices[0]);
    }
    if (pluginStorage.get("silentCall.enabled")) {
      patch2(pluginStorage, unpatches);
    }
    if (pluginStorage.get("rememberOutputDevice.enabled")) {
      patch(pluginStorage, unpatches);
    }
  },
  onStop() {
    for (const unpatch of unpatches) {
      unpatch();
    }
    unpatches = [];
  }
};
export {
  index_default as default
};
