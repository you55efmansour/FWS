import { makeAutoObservable, observable } from "mobx";

class CreateModal {
  modalStack = [];

  constructor() {
    // autoBind ensures 'this' is preserved; modalStack shallow so React elements aren't proxied
    makeAutoObservable(
      this,
      { modalStack: observable.shallow },
      { autoBind: true }
    );
  }

  get isOpen() {
    return this.modalStack.length > 0;
  }

  open(modal) {
    this.modalStack.push(modal);
  }

  close() {
    this.modalStack.pop();
  }

  clear() {
    this.modalStack = [];
  }
}

const createModal = new CreateModal();
export default createModal;