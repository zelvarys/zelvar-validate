import * as rulesModule from './rules.js';

const ruleFns = rulesModule.rules || rulesModule;

export type CustomMessages = Record<string, string>;

export class Validator<T = any> {
  private value: T;
  private errors: string[];
  private customMessages: CustomMessages;
  private asyncRules: Array<{ fn: (value: T) => Promise<boolean>; message: string }> = [];

  constructor(value: T, customMessages: CustomMessages = {}) {
    this.value = value;
    this.errors = [];
    this.customMessages = customMessages;
  }

  private _addError(ruleName: string, defaultMessage: string): this {
    const message = this.customMessages[ruleName] || defaultMessage;
    this.errors.push(message);
    return this;
  }

  customAsync(rule: (value: T) => Promise<boolean>, message: string): this {
    this.asyncRules.push({ fn: rule, message });
    return this;
  }

  async isValidAsync(): Promise<boolean> {
    if (this.errors.length > 0) {
      return false;
    }
    
    for (const rule of this.asyncRules) {
      const isValid = await rule.fn(this.value);
      if (!isValid) {
        this._addError('customAsync', rule.message);
      }
    }
    
    return this.errors.length === 0;
  }

  if(condition: (value: T) => boolean, ruleFn: (validator: Validator<T>) => Validator<T>): this {
    if (condition(this.value)) {
      ruleFn(this);
    }
    return this;
  }

  unless(condition: (value: T) => boolean, ruleFn: (validator: Validator<T>) => Validator<T>): this {
    if (!condition(this.value)) {
      ruleFn(this);
    }
    return this;
  }

  email(): this {
    if (!ruleFns.email(this.value)) {
      this._addError('email', 'Invalid email address');
    }
    return this;
  }

  phone(): this {
    if (!ruleFns.phone(this.value)) {
      this._addError('phone', 'Invalid phone number');
    }
    return this;
  }

  url(): this {
    if (!ruleFns.url(this.value)) {
      this._addError('url', 'Invalid URL');
    }
    return this;
  }

  strongPassword(): this {
    if (!ruleFns.strongPassword(this.value)) {
      this._addError('strongPassword', 'Password must contain uppercase, lowercase, number, and symbol');
    }
    return this;
  }

  custom(rule: (value: T) => boolean, message: string): this {
    if (!rule(this.value)) {
      this._addError('custom', message || 'Custom validation failed');
    }
    return this;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  getValue(): T {
    return this.value;
  }
}

export function validate<T>(value: T, customMessages: CustomMessages = {}): Validator<T> {
  return new Validator(value, customMessages);
}