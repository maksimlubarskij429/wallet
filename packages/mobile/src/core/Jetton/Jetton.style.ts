import styled, { RADIUS } from '$styled';
import Animated from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { deviceWidth, ns } from '$utils';
import { StatelessHighlight } from '$uikit';

export const Wrap = styled.View`
  flex: 1;
`;

export const HeaderWrap = styled.View`
  align-items: center;
  margin-bottom: ${ns(16)}px;
  padding-horizontal: ${ns(12)}px;
`;

export const ContentWrap = styled(Animated.View)`
  flex: 1;
  max-height: 100%;
  position: relative;
`;

export const Logo = styled(FastImage)`
  border-radius: ${ns(64 / 2)}px;
  width: ${ns(64)}px;
  height: ${ns(64)}px;
  margin-left: ${ns(16)}px;
`;

export const JettonNameWrapper = styled.View`
  margin-bottom: ${ns(12)}px;
`;

export const JettonIDWrapper = styled.View``;

export const FlexRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${ns(16)}px;
  margin-bottom: ${ns(28)}px;
`;

export const JettonAmountWrapper = styled.View`
  flex: 1;
`;

const borders = (borderStart: boolean, borderEnd: boolean) => {
  return `
    ${
      borderStart
        ? `
        border-top-left-radius: ${ns(RADIUS.normal)}px;
        border-top-right-radius: ${ns(RADIUS.normal)}px;
      `
        : ''
    }
  ${
    borderEnd
      ? `
        border-bottom-left-radius: ${ns(RADIUS.normal)}px;
        border-bottom-right-radius: ${ns(RADIUS.normal)}px;
      `
      : ''
  }
  `;
};

export const ActionWrapper = styled.View<{ isLast?: boolean }>`
  margin-right: ${({ isLast }) => (!isLast ? ns(25.5) : 0)}px;
  align-items: center;
  justify-content: center;
`;

export const Divider = styled.View`
  height: ${ns(0.5)}px;
  width: ${deviceWidth}px;
  background: rgba(79, 90, 112, 0.24);
  margin-bottom: ${ns(24)}px;
`

export const Action = styled.View`
  margin-bottom: ${ns(8)}px;
  width: ${ns(44)}px;
  height: ${ns(44)}px;
  align-items: center;
  justify-content: center;
`;

export const ActionsContainer = styled.View`
  justify-content: center;
  flex-direction: row;
  margin-bottom: ${ns(20)}px;
`;

export const IconWrap = styled.View`
`;

export const ActionCont = styled(StatelessHighlight)`
  border-radius: ${ns(48 /2)}px;
`;

export const Background = styled.View<{ borderStart: boolean; borderEnd: boolean }>`
  background: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${ns(48 /2)}px;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;