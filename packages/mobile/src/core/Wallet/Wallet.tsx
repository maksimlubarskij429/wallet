import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WalletProps } from './Wallet.interface';
import * as S from './Wallet.style';
import { Button, CurrencyIcon, Icon, NavBar, ShowMore, Text } from '$uikit';
import { useTheme, useTranslator, useWalletInfo } from '$hooks';
import { openReceive, openRequireWalletModal, openSend } from '$navigation';
import { walletActions, walletSelector } from '$store/wallet';
import { FlatList, View } from 'react-native';
import { ns, toLocaleNumber } from '$utils';
import { CryptoCurrencies } from '$shared/constants';
import { toastActions } from '$store/toast';
import { ActionButtonProps } from '$core/Balances/BalanceItem/BalanceItem.interface';

const ActionButton: FC<ActionButtonProps> = (props) => {
  const { children, onPress, icon, isLast, iconStyle } = props;

  return (
    <S.ActionWrapper isLast={isLast}>
      <S.Action>
        <S.Background borderEnd borderStart />
        <S.ActionCont withDelay={false} onPress={onPress}>
          <Icon name={icon} color="constantLight" />
        </S.ActionCont>
      </S.Action>
      <Text variant="label3" color='foregroundSecondary'>{children}</Text>
    </S.ActionWrapper>
  );
};

export const Wallet: FC<WalletProps> = ({ route }) => {
  const theme = useTheme();
  const currency = route.params.currency;
  const { wallet, address } = useSelector(walletSelector);
  const t = useTranslator();
  const dispatch = useDispatch();
  const [lockupDeploy, setLockupDeploy] = useState('loading');

  useEffect(() => {
    if (currency === CryptoCurrencies.Ton && wallet && wallet.ton.isLockup()) {
      wallet.ton
        .getWalletInfo(address[currency])
        .then((info: any) => {
          setLockupDeploy(['empty', 'uninit'].includes(info.status) ? 'deploy' : 'deployed');
        })
        .catch((err: any) => {
          dispatch(toastActions.fail(err.message));
        });
    }
  }, []);

  const currencyUpper = useMemo(() => {
    return currency?.toUpperCase();
  }, [currency]);

  const { amount, priceDiff, rate, fiatInfo } = useWalletInfo(currency);

  const handleReceive = useCallback(() => {
    if (!wallet) {
      return openRequireWalletModal();
    }

    openReceive(currency);
  }, [currency, wallet]);

  const handleSend = useCallback(() => {
    if (!wallet) {
      return openRequireWalletModal();
    }

    openSend(currency);
  }, [currency, wallet]);

  const handleDeploy = useCallback(() => {
    setLockupDeploy('loading');
    dispatch(
      walletActions.deployWallet({
        onDone: () => setLockupDeploy('deployed'),
        onFail: () => setLockupDeploy('deploy'),
      }),
    );
  }, [dispatch]);

  return (
    <S.Wrap>
      <NavBar>
        Toncoin
      </NavBar>
      <FlatList
        ListHeaderComponent={
          <>
                <S.HeaderWrap>
                  <S.FlexRow>
                    <S.AmountWrapper>
                      <Text variant="h2">
                        {toLocaleNumber(amount)} {currencyUpper}
                      </Text>
                      <Text style={{ marginTop: 2 }} variant='body2' color='foregroundSecondary'>
                        {fiatInfo.amount}
                      </Text>
                      <S.Price>
                        <Text color='foregroundSecondary' variant='body2'>
                          {rate}
                        </Text>
                        <Text style={{ marginLeft: 6 }} variant='body2' color={fiatInfo.color}>
                          {fiatInfo.percent}&nbsp;&nbsp;24{t('wallet_hours_symbol')}
                        </Text>
                      </S.Price>
                      <S.AboutWrapper>
                        <ShowMore backgroundColor={theme.colors.backgroundPrimary} maxLines={2} text={t('about_ton')} />
                      </S.AboutWrapper>
                    </S.AmountWrapper>
                    <S.IconWrapper>
                      <Icon size={40} name='ic-ton-28' color="constantLight" />
                    </S.IconWrapper>
                  </S.FlexRow>
                  <S.Divider />
                  <S.ActionsContainer>
                    <ActionButton onPress={handleSend} icon="ic-arrow-up-28">
                      {t('wallet_buy')}
                    </ActionButton>
                    <ActionButton onPress={handleSend} icon="ic-arrow-up-28">
                      {t('wallet_send')}
                    </ActionButton>
                    <ActionButton onPress={handleReceive} icon="ic-arrow-down-28">
                      {t('wallet_receive')}
                    </ActionButton>
                    <ActionButton isLast onPress={handleSend} icon="ic-arrow-up-28">
                      {t('wallet_sell')}
                    </ActionButton>
                  </S.ActionsContainer>
                  <S.Divider />
                </S.HeaderWrap>
                <S.ExploreWrap>
                  <Text variant='h3' color='foregroundPrimary'>
                    {t('wallet_about')}
                  </Text>
                </S.ExploreWrap>
            {wallet && wallet.ton.isLockup() && (
              <View style={{ padding: ns(16) }}>
                <Button
                  onPress={handleDeploy}
                  disabled={lockupDeploy === 'deployed'}
                  isLoading={lockupDeploy === 'loading'}
                >
                  {lockupDeploy === 'deploy' ? 'Deploy Wallet' : 'Deployed'}
                </Button>
              </View>
            )}
          </>
        }
        keyExtractor={(_, index) => `${index}`}
        data={[]}
        renderItem={() => null}
      />
    </S.Wrap>
  );
};