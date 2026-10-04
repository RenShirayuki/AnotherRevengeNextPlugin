import { React, ReactNative } from "revenge/common";
import { webpack } from "revenge";
import { getAudioDeviceDisplayText, getAudioDeviceIcon, getAudioDevices, setAudioOutputDevice } from "../utils.tsx";

export default function AudioOutputDevicesSelectionSheet({
  onPress,
  storage,
  fromVoiceCall,
}: { onPress?: () => void; storage: any; fromVoiceCall?: boolean }) {
  const devices = getAudioDevices();
  const ActionSheet = webpack.getByProps("ActionSheet")?.ActionSheet || ReactNative.View;

  return (
    <ActionSheet>
      <ReactNative.View style={{ padding: 16 }}>
        <ReactNative.Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#FFF" }}>
          Select Preferred Audio Output Device
        </ReactNative.Text>
        
        {devices.map((device) => (
          <ReactNative.TouchableOpacity
            key={device.deviceId.toString()}
            style={{
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
            onPress={() => {
              storage.set("rememberOutputDevice.device", device);
              setAudioOutputDevice(device);
              if (onPress) onPress();
            }}
          >
            <ReactNative.Text style={{ color: "#FFF" }}>
              {getAudioDeviceDisplayText(device)} ({device.deviceName})
            </ReactNative.Text>
          </ReactNative.TouchableOpacity>
        ))}

        {fromVoiceCall && (
          <ReactNative.Text style={{ fontSize: 12, color: "#888", marginTop: 12 }}>
            Alternatively, you can swipe up the dock in the call UI to access stock audio output options.
          </ReactNative.Text>
        )}
      </ReactNative.View>
    </ActionSheet>
  );
}
