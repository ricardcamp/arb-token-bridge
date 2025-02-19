import '@synthetixio/synpress/support/index.d.ts'
import {
  connectToApp,
  login,
  logout,
  openTransactionsPanel,
  restoreAppState,
  saveAppState,
  closeLowBalanceDialog
} from '../support/commands'
import { NetworkType } from '../support/common'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to connect MetaMask to the UI.
       * @example cy.login()
       */
      connectToApp(): typeof connectToApp
      login(options: {
        networkType: NetworkType
        addNewNetwork?: boolean
        url?: string
        query?: { [s: string]: string }
      }): typeof login
      logout(): typeof logout
      restoreAppState(): typeof restoreAppState
      saveAppState(): typeof saveAppState
      openTransactionsPanel(): typeof openTransactionsPanel
      closeLowBalanceDialog(): typeof closeLowBalanceDialog
    }
  }
}
