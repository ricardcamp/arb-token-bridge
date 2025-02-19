import { Tab } from '@headlessui/react'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { CompleteDepositData } from '../../hooks/useDeposits'
import { useNetworksAndSigners } from '../../hooks/useNetworksAndSigners'
import { CompleteWithdrawalData } from '../../hooks/useWithdrawals'
import { useAppState } from '../../state'
import { getNetworkLogo, getNetworkName } from '../../util/networks'
import {
  PageParams,
  TransactionsTable
} from './TransactionsTable/TransactionsTable'
import { PendingTransactions } from './PendingTransactions'
import { FailedTransactionsWarning } from './FailedTransactionsWarning'
import { isFailed, isPending } from '../../state/app/utils'
import Image from 'next/image'
import { TabButton } from '../common/Tab'

export const TransactionHistory = ({
  depositsPageParams,
  withdrawalsPageParams,
  depositsData,
  depositsLoading,
  depositsError,
  withdrawalsData,
  withdrawalsLoading,
  withdrawalsError,
  setDepositsPageParams,
  setWithdrawalsPageParams
}: {
  depositsPageParams: PageParams
  withdrawalsPageParams: PageParams
  depositsData: CompleteDepositData
  withdrawalsData: CompleteWithdrawalData
  depositsLoading: boolean
  depositsError: boolean
  withdrawalsLoading: boolean
  withdrawalsError: boolean
  setDepositsPageParams: Dispatch<SetStateAction<PageParams>>
  setWithdrawalsPageParams: Dispatch<SetStateAction<PageParams>>
}) => {
  const { l1, l2 } = useNetworksAndSigners()

  const {
    app: { mergedTransactions }
  } = useAppState()

  const pendingTransactions = useMemo(() => {
    return mergedTransactions?.filter(tx => isPending(tx))
  }, [mergedTransactions])

  const failedTransactions = useMemo(() => {
    return mergedTransactions?.filter(tx => isFailed(tx))
  }, [mergedTransactions])

  const roundedTabClasses =
    'roundedTab ui-not-selected:arb-hover roundedTabRight relative flex flex-row flex-nowrap items-center gap-2 rounded-tl-lg rounded-tr-lg px-4 py-2 text-base ui-selected:bg-white ui-not-selected:text-white'

  return (
    <div className="flex flex-col justify-around gap-6">
      {/* Pending transactions cards */}
      <PendingTransactions
        loading={depositsLoading || withdrawalsLoading}
        transactions={pendingTransactions}
        error={depositsError || withdrawalsError}
      />

      {/* Warning to show when there are 3 or more failed transactions for the user */}
      <FailedTransactionsWarning transactions={failedTransactions} />

      {/* Transaction history table */}
      <div>
        <Tab.Group>
          <Tab.List className={'flex flex-row whitespace-nowrap'}>
            <TabButton
              aria-label="show deposit transactions"
              className={`${roundedTabClasses}`}
            >
              {/* Deposits */}
              <Image
                src={getNetworkLogo(l2.network.chainID)}
                className="h-6 w-auto"
                alt="Deposit"
              />
              {`To ${getNetworkName(l2.network.chainID)}`}
            </TabButton>
            <TabButton
              aria-label="show withdrawal transactions"
              className={`${roundedTabClasses} roundedTabLeft`}
            >
              {/* Withdrawals */}
              <Image
                src={getNetworkLogo(l1.network.chainID)}
                className="h-6 w-auto"
                alt="Withdraw"
              />
              {`To ${getNetworkName(l1.network.chainID)}`}
            </TabButton>
          </Tab.List>
          <Tab.Panel className="overflow-auto">
            <TransactionsTable
              type="deposits"
              pageParams={depositsPageParams}
              setPageParams={setDepositsPageParams}
              transactions={depositsData.transformedDeposits}
              loading={depositsLoading}
              error={depositsError}
              pendingTransactions={pendingTransactions}
            />
          </Tab.Panel>
          <Tab.Panel className="overflow-auto">
            <TransactionsTable
              type="withdrawals"
              pageParams={withdrawalsPageParams}
              setPageParams={setWithdrawalsPageParams}
              transactions={withdrawalsData.transformedWithdrawals}
              loading={withdrawalsLoading}
              error={withdrawalsError}
              pendingTransactions={pendingTransactions}
            />
          </Tab.Panel>
        </Tab.Group>
      </div>
    </div>
  )
}
