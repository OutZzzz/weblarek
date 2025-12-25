import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { TFormValidate } from "../../../types";

export abstract class BaseForm<T> extends Component<T & TFormValidate> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    this.errorsElement = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    );

    this.container.addEventListener('submit', (event) => {
      event.preventDefault()
      this.onSubmit()
    });
  }

  protected abstract onSubmit(): void

  set valid(value: boolean) {
    this.submitButton.disabled = !value
  }

  set error(value: string) {
    this.errorsElement.textContent = value
  }
}
