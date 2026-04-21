// Copyright 2024 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

// BannerBrowserWallet is intentionally self-contained (no @polkadot/react-components
// dependency) so tests can run without loading the full component tree.
// Without an i18n provider, react-i18next's useTranslation returns a `t` that
// echoes back the key — we rely on that behaviour for text assertions.

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import BannerBrowserWallet, { __test__ } from './BannerBrowserWallet.js';

const { DISMISS_KEY, readDismissed, writeDismissed } = __test__;

describe('BannerBrowserWallet storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('readDismissed returns false for empty storage', () => {
    expect(readDismissed()).toBe(false);
  });

  it('writeDismissed → readDismissed round-trips', () => {
    writeDismissed();
    expect(readDismissed()).toBe(true);
    expect(window.localStorage.getItem(DISMISS_KEY)).toBe('1');
  });

  it('readDismissed is safe when localStorage throws', () => {
    const originalGetItem = window.localStorage.getItem.bind(window.localStorage);

    Object.defineProperty(window.localStorage, 'getItem', {
      configurable: true,
      value: () => { throw new Error('blocked'); }
    });

    expect(() => readDismissed()).not.toThrow();
    expect(readDismissed()).toBe(false);

    Object.defineProperty(window.localStorage, 'getItem', {
      configurable: true,
      value: originalGetItem
    });
  });

  it('writeDismissed is safe when localStorage throws', () => {
    const originalSetItem = window.localStorage.setItem.bind(window.localStorage);

    Object.defineProperty(window.localStorage, 'setItem', {
      configurable: true,
      value: () => { throw new Error('blocked'); }
    });

    expect(() => writeDismissed()).not.toThrow();

    Object.defineProperty(window.localStorage, 'setItem', {
      configurable: true,
      value: originalSetItem
    });
  });
});

describe('BannerBrowserWallet component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the dismiss button when not dismissed', () => {
    render(<BannerBrowserWallet />);

    expect(screen.getByTestId('dismiss-browser-wallet-banner')).not.toBeNull();
  });

  it('renders nothing when already dismissed', () => {
    window.localStorage.setItem(DISMISS_KEY, '1');

    const { container } = render(<BannerBrowserWallet />);

    expect(container.innerHTML).toBe('');
  });

  it('hides on dismiss click and persists', () => {
    const { container } = render(<BannerBrowserWallet />);

    const btn = container.querySelector('[data-testid="dismiss-browser-wallet-banner"]');

    expect(btn).not.toBeNull();
    fireEvent.click(btn!);

    // After dismiss, component returns null — container should be empty
    expect(container.innerHTML).toBe('');
    expect(window.localStorage.getItem(DISMISS_KEY)).toBe('1');
  });

  it('remounting after dismiss shows nothing', () => {
    writeDismissed();
    const { container } = render(<BannerBrowserWallet />);

    expect(container.innerHTML).toBe('');
    expect(container.querySelector('[data-testid="dismiss-browser-wallet-banner"]')).toBeNull();
  });
});
