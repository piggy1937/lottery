export default class DrawService {

  static instance;

  constructor() {
    this.noDuplicate = true;
    this.isRolling = false;
    this.isPickBlocked = false;
  }

  static from(all) {
    if (!DrawService.instance) {
      DrawService.instance = new DrawService();
    }
    DrawService.instance.all = all;
    return DrawService.instance;
  }

  rollUp() {
    if (!this.isRolling) {
      clearInterval(this.timer);
      if (this.all.length === 0) {
        throw new Error("No item in pool");
      }
      this.isRolling = true;
      this.timer = setInterval(this.change.bind(this), 80);
    }
    return this;
  }

  removeItem(oneItemIndex) {
    this.all.splice(oneItemIndex, 1);
  }

  change() {
    const index = Math.floor(Math.random() * this.all.length);
    this.currentlySelectedIndex = index;
    this.currentlySelectedItem = this.all[index];
    this.onSelectedChangedCallback(this.currentlySelectedItem);
  }

  setOnSelectedChangedCallback(callback) {
    this.onSelectedChangedCallback = callback;
    return this;
  }
  setOnPickBlockedChangedCallback(callback) {
    this.onPickBlockedChangedCallback = callback;
    return this;
  }

  setNoDuplicate(noDuplicate = true) {
    this.noDuplicate = noDuplicate;
    return this;
  }

  setPickBlocked(blocked) {
    this.isPickBlocked = blocked;
    this.onPickBlockedChangedCallback(blocked);
  }
  pickOneThenDo(callback) {

    if (!this.isPickBlocked) {
      this.setPickBlocked(true);
      setTimeout((() => {
        clearInterval(this.timer);
        if (this.noDuplicate) {
          this.removeItem(this.currentlySelectedIndex);
        }
        callback(this.currentlySelectedItem);
        this.isRolling = false;
        this.setPickBlocked(false);
      }).bind(this), 1000, this);
    }
  }
}
