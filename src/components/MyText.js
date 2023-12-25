import { Text } from "react-native";
import { useTheme } from "../theme/ThemeManager";

function MyText({ children, ...props }) {
  const { currentTheme, fonts } = useTheme();

  const { style, ...otherProps } = props;

  var _otherStyleProps;

  if (style && style.fontWeight) {
    const { fontWeight, ...otherStyleProps } = style;
    _otherStyleProps = otherStyleProps;
  }

  return (
    <Text
      style={[
        {
          fontFamily:
            style && style.fontWeight && style.fontWeight === "bold"
              ? fonts.futura_medium
              : fonts.futura_lig,

          color: currentTheme.TextColor,

          overflow: "hidden",
        },
        style && style.fontWeight ? _otherStyleProps : style,
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  );
}

export default MyText;
