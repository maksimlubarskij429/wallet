import { Modal, useNavigation } from '$libs/navigation';
import { SheetActions } from '$libs/navigation/components/Modal/Sheet/SheetsProvider';
import { push } from '$navigation/helper';
import { t } from '$translation';
import { Icon, List, Spacer, Text, TransitionOpacity } from '$uikit';
import { memo, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as S from '../../../core/ModalContainer/NFTOperations/NFTOperations.styles';
import { useExpiringDomains } from '$store/zustand/domains/useExpiringDomains';
import { formatter } from '$utils/formatter';
import { useFiatValue, useWallet } from '$hooks';
import { CryptoCurrencies, Decimals } from '$shared/constants';
import { copyText } from '$hooks/useCopyText';
import { useUnlockVault } from '$core/ModalContainer/NFTOperations/useUnlockVault';
import { RenewAllProgressButton } from './RenewAllProgressButton';
import { Base64, debugLog, delay, triggerNotificationSuccess } from '$utils';
import { Toast } from '$store/zustand/toast';
import { getTimeSec } from '$utils/getTimeSec';
import { Ton } from '$libs/Ton';
import TonWeb from 'tonweb';
import { Tonapi } from '$libs/Tonapi';

enum States {
  INITIAL,
  PROGRESS,
  SUCCESS,
  ERROR,
}

export const СonfirmRenewAllDomains = memo((props) => {
  const [state, setState] = useState(States.INITIAL);
  const nav = useNavigation();
  const domains = useExpiringDomains((state) => state.items);
  const remove = useExpiringDomains((state) => state.actions.remove);
  const unlock = useUnlockVault();
  const [current, setCurrent] = useState(0);
  const wallet = useWallet();

  const [count] = useState(domains.length);
  const [amount] = useState(0.02 * count);

  const fiatValue = useFiatValue(
    CryptoCurrencies.Ton,
    String(amount),
    Decimals[CryptoCurrencies.Ton],
  );

  const handleConfirm = useCallback(async () => {
    const unlocked = await unlock();
    const secretKey = await unlocked.getTonPrivateKey();

    try {
      setState(States.PROGRESS);

      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i];

        setCurrent(i + 1);

        const payload = new TonWeb.boc.Cell();
        payload.bits.writeUint(0x4eb1f0f9, 32);
        payload.bits.writeUint(0, 64);
        payload.bits.writeUint(0, 256);

        const seqno = await wallet.ton.getSeqno(await wallet.ton.getAddress());
        const tx = wallet.vault.tonWallet.methods.transfer({
          toAddress: domain.dns_item.address,
          amount: Ton.toNano('0.02'),
          seqno: seqno,
          payload,
          sendMode: 3,
          secretKey,
        });

        const queryMsg = await tx.getQuery();
        const boc = Base64.encodeBytes(await queryMsg.toBoc(false));
        await Tonapi.sendBoc(boc);

        await delay(15000);
        remove(domain.dns_item.address);
      }

      setState(States.SUCCESS);
      triggerNotificationSuccess();
      await delay(1750);

      nav.goBack();
      Toast.show(t('domains_renewed'));
    } catch (err) {
      debugLog(err);
      setState(States.ERROR);
    }
  }, [setCurrent]);

  const fiatAmount = `≈ ${fiatValue.fiatInfo.amount}`;
  const formattedAmount = formatter.format(amount, {
    currency: 'TON',
    currencySeparator: 'wide',
  });

  return (
    <Modal>
      <Modal.Header title={t('confirm_renew_all_domains_title')} />
      <Modal.Content>
        <List>
          <List.Item
            onPress={() => copyText(formattedAmount)}
            titleStyle={styles.listItemTitle}
            title={
              <Text variant="body1" color="textSecondary">
                {t('txActions.amount')}
              </Text>
            }
            value={formattedAmount}
            subvalue={fiatAmount}
          />
          <List.Item
            onPress={() => copyText(t('dns_addresses', { count: count }))}
            titleStyle={styles.listItemTitle}
            title={
              <Text variant="body1" color="textSecondary">
                {t('txActions.signRaw.recipient')}
              </Text>
            }
            value={t('dns_addresses', { count: count })}
          />
        </List>
      </Modal.Content>
      <Modal.Footer>
        <View style={S.styles.footer}>
          <TransitionOpacity
            style={S.styles.transitionContainer}
            isVisible={state === States.INITIAL}
            entranceAnimation={false}
          >
            <View style={S.styles.footerButtons}>
              <S.ActionButton mode="secondary" onPress={() => nav.goBack()}>
                {t('cancel')}
              </S.ActionButton>
              <Spacer x={16} />
              <S.ActionButton onPress={() => handleConfirm()}>
                {t('nft_confirm_operation')}
              </S.ActionButton>
            </View>
          </TransitionOpacity>
          <TransitionOpacity
            style={S.styles.transitionContainer}
            isVisible={state === States.PROGRESS}
            entranceAnimation={false}
          >
            <View style={styles.footer}>
              <RenewAllProgressButton total={count} current={current} />
            </View>
          </TransitionOpacity>
          <TransitionOpacity
            style={S.styles.transitionContainer}
            isVisible={state === States.SUCCESS}
          >
            <View style={S.styles.center}>
              <View style={S.styles.iconContainer}>
                <Icon name="ic-checkmark-circle-32" color="accentPositive" />
              </View>
              <Text variant="label2" color="accentPositive">
                {t('nft_operation_success')}
              </Text>
            </View>
          </TransitionOpacity>
          <TransitionOpacity
            style={S.styles.transitionContainer}
            isVisible={state === States.ERROR}
          >
            <View style={S.styles.center}>
              <View style={S.styles.iconContainer}>
                <Icon color="accentNegative" name="ic-exclamationmark-circle-32" />
              </View>
              <Text
                color="accentNegative"
                textAlign="center"
                variant="label2"
                numberOfLines={2}
              >
                {t('error_occurred')}
              </Text>
            </View>
          </TransitionOpacity>
        </View>
      </Modal.Footer>
    </Modal>
  );
});

export function openСonfirmRenewAllDomains() {
  push('SheetsProvider', {
    $$action: SheetActions.ADD,
    component: СonfirmRenewAllDomains,
    params: {},
    path: 'ConfirmRenewAll',
  });
}

const styles = StyleSheet.create({
  container: {},
  listItemTitle: {
    alignSelf: 'flex-start',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
