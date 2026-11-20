/**
 * Helpers for the customer-facing InstaPay payment step.
 *
 * We never invent a bank deep link. If the clinic configured a real URL
 * (https, http or instapay://) it is offered as an "Open InstaPay" action;
 * otherwise the configured value is treated as the account/number to display
 * and encode in the QR code.
 */

const ALLOWED_LINK_PROTOCOLS = new Set(["http:", "https:", "instapay:"]);

export function instapayLink(account: string): string | null {
  const value = account.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return ALLOWED_LINK_PROTOCOLS.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Plain-text QR payload — shows the account and amount on any scanner. */
export function instapayQrText(account: string, amountLabel: string): string {
  return `InstaPay\nAccount: ${account.trim()}\nAmount: ${amountLabel}`;
}

export function instapayAccountLabel(account: string): string {
  return account.trim();
}
