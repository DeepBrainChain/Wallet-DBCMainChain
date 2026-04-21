// Copyright 2024 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import i18next from '@polkadot/react-components/i18n';

import BannerBrowserWallet, { __test__ } from './BannerBrowserWallet.js';

const { DISMISS_KEY } = __test__;

describe('BannerBrowserWallet', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the warning text when not previously dismissed', () => {
    render(<BannerBrowserWallet />);

    expect(
      screen.getByText(/create or import a wallet directly in this browser/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('dismiss-browser-wallet-banner')).toBeInTheDocument();
  });

  it('renders nothing when localStorage flag is already set', () => {
    window.localStorage.setItem(DISMISS_KEY, '1');

    const { container } = render(<BannerBrowserWallet />);

    expect(container).toBeEmptyDOMElement();
  });

  it('hides itself after dismiss and persists the choice', () => {
    render(<BannerBrowserWallet />);

    expect(
      screen.getByText(/create or import a wallet directly in this browser/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('dismiss-browser-wallet-banner'));

    expect(
      screen.queryByText(/create or import a wallet directly in this browser/i)
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem(DISMISS_KEY)).toBe('1');
  });

  it('translates the warning into Chinese when language is zh', async () => {
    await i18next.changeLanguage('zh');
    render(<BannerBrowserWallet />);

    // 现在可以直接在浏览器内创建或导入钱包 = "you can now create or import a wallet directly in this browser"
    expect(screen.getByText(/现在可以直接在浏览器内创建或导入钱包/)).toBeInTheDocument();

    await i18next.changeLanguage('en');
  });

  it('survives when localStorage throws (private-mode safari etc.)', () => {
    const original = window.localStorage.getItem;

    // Simulate storage access blocked
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        ...window.localStorage,
        getItem: () => { throw new Error('blocked'); },
        setItem: () => { throw new Error('blocked'); }
      }
    });

    try {
      expect(() => render(<BannerBrowserWallet />)).not.toThrow();
      // Should still render since readDismissed() returns false on error
      expect(
        screen.getByText(/create or import a wallet directly in this browser/i)
      ).toBeInTheDocument();
      // Dismiss shouldn't throw either
      expect(() =>
        fireEvent.click(screen.getByTestId('dismiss-browser-wallet-banner'))
      ).not.toThrow();
    } finally {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: { ...window.localStorage, getItem: original }
      });
    }
  });
});
