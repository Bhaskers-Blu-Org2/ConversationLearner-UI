/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

export function VerifyPageTitle() { cy.Get('[data-testid="log-dialogs-title"]').contains('Log Dialogs').should('be.visible') }
export function CreateNewLogDialogButton() { cy.Get('[data-testid="log-dialogs-new-button"]').Click() }
export function VerifyNewLogDialogButtonIsDisabled() { cy.Get('[data-testid="log-dialogs-new-button"]').should('be.disabled') }
export function VerifyNewLogDialogButtonIsEnabled() { cy.Get('[data-testid="log-dialogs-new-button"]').should('be.enabled') }