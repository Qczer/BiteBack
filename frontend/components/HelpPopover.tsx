import { Dimensions, Text, View } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";

type HelpPopoverProps = {
  isVisible: boolean;
  from: any;
  onRequestClose: () => void;
  text: string;
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const HelpPopover = ({
  isVisible,
  from,
  onRequestClose,
  text,
}: HelpPopoverProps) => {
  return (
    <Popover
      popoverStyle={{ backgroundColor: "#cbbb9c" }}
      isVisible={isVisible}
      from={from}
      onRequestClose={onRequestClose}
      placement={PopoverPlacement.TOP}
      arrowSize={{ width: 10, height: 6 }}
      backgroundStyle={{ backgroundColor: "transparent" }}
      animationConfig={undefined}
      displayArea={{ x: 0, y: 0, width: width, height: height - 50 }}
    >
      <View
        style={{
          backgroundColor: "#1c1c1c",
          padding: 10,
          borderWidth: 3,
          borderColor: "#cbbb9c",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>{text}</Text>
      </View>
    </Popover>
  );
};

export default HelpPopover;
