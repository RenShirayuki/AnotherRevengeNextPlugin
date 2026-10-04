import { webpack } from "revenge";
import AudioOutputDevicesSelectionSheet from "./components/AudioOutputDevicesSelectionSheet.tsx";

const AudioDeviceModule = webpack.getByProps("getAudioDevices", "setAudioOutputDevice");
const AudioDeviceIcons = webpack.getByProps("audioDeviceToIconMap");
const ActionSheetModule = webpack.getByProps("openLazy", "hideActionSheet");

export type SimpleAudioDeviceType = 'EARPIECE' | 'BLUETOOTH_HEADSET' | 'WIRED_HEADSET' | 'SPEAKERPHONE' | 'INVALID';
export type AudioDevice = {
  deviceName: string;
  deviceId: number;
  simpleDeviceType: SimpleAudioDeviceType;
  deviceType: number;
};

export const getAudioDevices = () => (AudioDeviceModule?.getAudioDevices() as AudioDevice[]) || [];
export const setAudioOutputDevice = (device: AudioDevice) => AudioDeviceModule?.setAudioOutputDevice(device);
export const getAudioDeviceIcon = (simpleDeviceType: SimpleAudioDeviceType) => AudioDeviceIcons?.audioDeviceToIconMap?.[simpleDeviceType];
export const getAudioDeviceDisplayText = (device: Pick<AudioDevice, 'deviceType'>) => AudioDeviceIcons?.getAudioDeviceToDisplayText?.(device);

export const showAudioOutputDevicesSelectionSheet = (props: {
  storage: any;
  onPress?: () => void;
  fromVoiceCall?: boolean;
}) => {
  if (ActionSheetModule) {
    ActionSheetModule.openLazy(
      Promise.resolve(() => <AudioOutputDevicesSelectionSheet {...props} />),
      "better-calls:audio-output-devices-select"
    );
  }
};
