// Copyright 2024 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

// BannerBrowserWallet is intentionally self-contained (no @polkadot/react-components
// dependency) so tests can run without loading the full component tree.
// Without an i18n provider, react-i18next's useTranslation returns a `t` that
// echoes back the key — we rely on that behaviour for text assertions.

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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

  it('readDismissed is safe when localStorage.getItem throws', () => {
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

  it('writeDismissed is safe when localStorage.setItem throws', () => {
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

  it('key is versioned (.v1) so future invalidation can be done by bumping', () => {
    expect(DISMISS_KEY).toMatch(/\.v\d+$/);
    expect(DISMISS_KEY).toBe('dbc:browserWalletBannerDismissed.v1');
  });

  it('legacy un-versioned key is not honored', () => {
    // Simulate a stale dismiss flag from a prior (un-versioned) deployment.
    window.localStorage.setItem('dbc:browserWalletBannerDismissed', '1');
    expect(readDismissed()).toBe(false);
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

    expect(container.innerHTML).toBe('');
    expect(window.localStorage.getItem(DISMISS_KEY)).toBe('1');
  });

  it('remounting after dismiss shows nothing', () => {
    writeDismissed();

    const { container } = render(<BannerBrowserWallet />);

    expect(container.innerHTML).toBe('');
    expect(container.querySelector('[data-testid="dismiss-browser-wallet-banner"]')).toBeNull();
  });

  it('has aria-label on dismiss button for screen readers', () => {
    render(<BannerBrowserWallet />);

    const btn = screen.getByTestId('dismiss-browser-wallet-banner');

    // aria-label comes from t('Dismiss'); without i18n provider the key echoes back.
    expect(btn.getAttribute('aria-label')).toBe('Dismiss');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('syncs dismissal from another tab via storage event', () => {
    const { container } = render(<BannerBrowserWallet />);

    expect(container.querySelector('[data-testid="dismiss-browser-wallet-banner"]')).not.toBeNull();

    // Simulate another tab writing the dismiss flag + dispatching a storage event.
    window.localStorage.setItem(DISMISS_KEY, '1');

    // StorageEvent isn't always available in the test env; use a plain Event
    // shape and attach properties — the component reads e.key / e.newValue.
    act(() => {
      const evt = new window.Event('storage') as Event & { key?: string; newValue?: string };

      evt.key = DISMISS_KEY;
      evt.newValue = '1';
      window.dispatchEvent(evt);
    });

    expect(container.innerHTML).toBe('');
  });

  it('ignores storage events for unrelated keys', () => {
    const { container } = render(<BannerBrowserWallet />);

    act(() => {
      const evt = new window.Event('storage') as Event & { key?: string; newValue?: string };

      evt.key = 'some-other-key';
      evt.newValue = '1';
      window.dispatchEvent(evt);
    });

    // Banner should still be visible
    expect(container.querySelector('[data-testid="dismiss-browser-wallet-banner"]')).not.toBeNull();
  });

  it('responds to localStorage.clear() (key === null) from another tab', () => {
    // Start dismissed
    writeDismissed();

    const { container } = render(<BannerBrowserWallet />);

    expect(container.innerHTML).toBe('');

    // Another tab clears localStorage → our dismiss flag is gone → banner should re-appear
    window.localStorage.clear();

    act(() => {
      const evt = new window.Event('storage') as Event & { key: string | null; newValue: string | null };

      evt.key = null;
      evt.newValue = null;
      window.dispatchEvent(evt);
    });

    expect(container.querySelector('[data-testid="dismiss-browser-wallet-banner"]')).not.toBeNull();
  });

  it('renders the settings hint text in the banner', () => {
    const { container } = render(<BannerBrowserWallet />);

    // Hint key is echoed back by stubbed i18next.
    expect(container.textContent).toMatch(/toggle this in Settings/);
  });

  it('unmount cleans up the storage event listener (no leak)', () => {
    const addSpy: Array<[string, EventListenerOrEventListenerObject]> = [];
    const removeSpy: Array<[string, EventListenerOrEventListenerObject]> = [];
    const origAdd = window.addEventListener.bind(window);
    const origRemove = window.removeEventListener.bind(window);

    window.addEventListener = ((type: string, handler: EventListenerOrEventListenerObject) => {
      addSpy.push([type, handler]);
      origAdd(type, handler);
    }) as typeof window.addEventListener;
    window.removeEventListener = ((type: string, handler: EventListenerOrEventListenerObject) => {
      removeSpy.push([type, handler]);
      origRemove(type, handler);
    }) as typeof window.removeEventListener;

    const { unmount } = render(<BannerBrowserWallet />);
    const addedStorage = addSpy.filter(([t]) => t === 'storage').length;

    expect(addedStorage >= 1).toBe(true);
    unmount();

    const removedStorage = removeSpy.filter(([t]) => t === 'storage').length;

    expect(removedStorage).toBe(addedStorage);

    window.addEventListener = origAdd;
    window.removeEventListener = origRemove;
  });
});
