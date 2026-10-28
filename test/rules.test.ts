import { describe, expect, it } from 'vitest';
import { rules } from '../src/index.js';

describe('email', () => {
  it('accepts valid addresses', () => {
    expect(rules.email('user@example.com')).toBe(true);
    expect(rules.email('USER@EXAMPLE.COM')).toBe(true);
    expect(rules.email('name+tag@sub.example.co.uk')).toBe(true);
  });

  it('rejects invalid addresses', () => {
    expect(rules.email('invalid')).toBe(false);
    expect(rules.email('user@')).toBe(false);
    expect(rules.email('@example.com')).toBe(false);
    expect(rules.email('user@example')).toBe(false);
    expect(rules.email('user@@example.com')).toBe(false);
    expect(rules.email('user name@example.com')).toBe(false);
    expect(rules.email('user@exam ple.com')).toBe(false);
  });
});

describe('phone', () => {
  it('accepts international formats', () => {
    expect(rules.phone('+1234567890')).toBe(true);
    expect(rules.phone('+1 (555) 123-4567')).toBe(true);
    expect(rules.phone('555-123-4567')).toBe(true);
  });

  it('rejects non-numeric input', () => {
    expect(rules.phone('abc123')).toBe(false);
    expect(rules.phone('')).toBe(false);
    expect(rules.phone('++123456789')).toBe(false);
    expect(rules.phone('1234567890123456')).toBe(false);
  });
});

describe('url', () => {
  it('accepts absolute URLs', () => {
    expect(rules.url('https://google.com')).toBe(true);
    expect(rules.url('http://localhost:3000')).toBe(true);
    expect(rules.url('ftp://example.com/file')).toBe(true);
  });

  it('rejects relative or malformed URLs', () => {
    expect(rules.url('not-a-url')).toBe(false);
    expect(rules.url('/relative/path')).toBe(false);
  });
});

describe('strongPassword', () => {
  it('requires all character classes', () => {
    expect(rules.strongPassword('Pass123!')).toBe(true);
    expect(rules.strongPassword('weak')).toBe(false);
    expect(rules.strongPassword('password123')).toBe(false);
    expect(rules.strongPassword('PASSWORD123!')).toBe(false);
    expect(rules.strongPassword('Password!')).toBe(false);
  });

  it('requires at least eight characters', () => {
    expect(rules.strongPassword('Pa1!')).toBe(false);
  });
});

describe('postalCode', () => {
  it('validates US postal codes by default', () => {
    expect(rules.postalCode('90210')).toBe(true);
    expect(rules.postalCode('90210-1234')).toBe(true);
    expect(rules.postalCode('9021')).toBe(false);
  });

  it('validates Canadian postal codes', () => {
    expect(rules.postalCode('M5V 2T6', 'CA')).toBe(true);
    expect(rules.postalCode('M5V2T6', 'CA')).toBe(false);
  });

  it('validates UK postal codes', () => {
    expect(rules.postalCode('SW1A 1AA', 'UK')).toBe(true);
    expect(rules.postalCode('SW1A1AA', 'UK')).toBe(false);
  });
});

describe('ip', () => {
  it('validates IPv4 by default', () => {
    expect(rules.ip('192.168.1.1')).toBe(true);
    expect(rules.ip('999.999.999.999')).toBe(false);
    expect(rules.ip('::1')).toBe(false);
  });

  it('validates IPv6 when requested', () => {
    expect(rules.ip('::1', 6)).toBe(true);
    expect(rules.ip('::', 6)).toBe(true);
    expect(rules.ip('1::', 6)).toBe(true);
    expect(rules.ip('2001:db8::1', 6)).toBe(true);
    expect(rules.ip('2001:db8:0:0:0:0:0:1', 6)).toBe(true);
    expect(rules.ip('::ffff:192.168.1.1', 6)).toBe(true);
    expect(rules.ip('fe80::1%eth0', 6)).toBe(true);
    expect(rules.ip('192.168.1.1', 6)).toBe(false);
    expect(rules.ip('1::2::3', 6)).toBe(false);
    expect(rules.ip('1:2:3:4:5:6:7', 6)).toBe(false);
    expect(rules.ip('1:2:3:4:5:6:7:8:9', 6)).toBe(false);
  });
});
