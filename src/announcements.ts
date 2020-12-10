/**
 * This file is part of the vscode-kanban distribution.
 * Copyright (c) Marcel Joachim Kloubert.
 *
 * vscode-kanban is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * vscode-kanban is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import * as vscode from 'vscode';

const REFACTORING_ANNOUNCEMENT_KEY = 'vsckb_announcement_20201009_655f729b';
const REFACTORING_ANNOUNCEMENT_DNSA_VALUE = '2';

interface MessageItem extends vscode.MessageItem {
    id: number;
}

/**
 * Shows announcements.
 */
export async function showAnnouncements(context: vscode.ExtensionContext) {
    //TODO: load from external resource

    let doNotShowAgain = false;

    try {
        const VALUE = context.globalState.get<string>(REFACTORING_ANNOUNCEMENT_KEY);
        if (VALUE !== REFACTORING_ANNOUNCEMENT_DNSA_VALUE) {
            const BTN = await vscode.window.showWarningMessage<MessageItem>(
                "[VSCODE-KANBAN] Do you like to code in React.js and to help refactoring the view?",
                {
                    id: 1,
                    title: 'YES, show me more ...',
                },
                {
                    id: 2,
                    title: 'No, but I would like to DONATE ...',
                },
                {
                    id: 3,
                    title: 'Later ...',
                },
                {
                    id: 4,
                    title: 'Do not show again',
                }
            );

            if (BTN) {
                switch (BTN.id) {
                    case 1:
                        // yes
                        doNotShowAgain = await vscode.env.openExternal(vscode.Uri.parse('https://github.com/mkloubert/vscode-kanban/issues/54'));
                        break;

                    case 2:
                        // donate
                        {
                            const DONATE_BTN = await vscode.window.showWarningMessage<MessageItem>(
                                "Thanks a lot 🙏🙏🙏 What service do you like to use?",
                                {
                                    id: 1,
                                    title: 'PayPal',
                                },
                                {
                                    id: 2,
                                    title: 'open collective',
                                },
                                {
                                    id: 3,
                                    title: 'Not now',
                                },
                            );

                            if (DONATE_BTN) {
                                switch (DONATE_BTN.id) {
                                    case 1:
                                        // PayPal
                                        doNotShowAgain = await vscode.env.openExternal(vscode.Uri.parse('https://paypal.me/MarcelKloubert'));
                                        break;

                                    case 2:
                                        // open collective
                                        doNotShowAgain = await vscode.env.openExternal(vscode.Uri.parse('https://opencollective.com/vscode-kanban'));
                                        break;
                                }
                            }
                        }
                        break;

                    case 4:
                        doNotShowAgain = true;  // do not show again
                        break;
                }
            }
        }
    } finally {
        if (doNotShowAgain) {
            await context.globalState.update(REFACTORING_ANNOUNCEMENT_KEY, REFACTORING_ANNOUNCEMENT_DNSA_VALUE);
        }
    }
}
