import { React } from "revenge/common";
import { patch as patchRememberOutputDevice } from "./patches/rememberOutputDevice.tsx";
import { patch as patchSilentCall } from "./patches/silentCall.tsx";
import { getAudioDevices } from "./utils.tsx";
import manifest from "../manifest.json" assert { type: "json" };

// Mock Storage internal
const createStorage = () => {
  const data: Record<string, any> = {
    "silentCall.enabled": true,
    "silentCall.default": false,
    "silentCall.users": {},
    "rememberOutputDevice.enabled": false,
    "rememberOutputDevice.device": undefined,
  };

  return {
    get: (key: string) => data[key],
    set: (key: string, val: any) => { data[key] = val; },
    unset: (key: string) => { delete data[key]; },
  };
};

const pluginStorage = createStorage();
let unpatches: Array<() => void> = [];

export default {
  ...manifest,

  onStart() {
    const devices = getAudioDevices();
    if (devices.length > 0 && !pluginStorage.get("rememberOutputDevice.device")) {
      pluginStorage.set("rememberOutputDevice.device", devices[0]);
    }

    if (pluginStorage.get("silentCall.enabled")) {
      patchSilentCall(pluginStorage, unpatches);
    }

    if (pluginStorage.get("rememberOutputDevice.enabled")) {
      patchRememberOutputDevice(pluginStorage, unpatches);
    }
  },

  onStop() {
    for (const unpatch of unpatches) {
      unpatch();
    }
    unpatches = [];
  }
};
