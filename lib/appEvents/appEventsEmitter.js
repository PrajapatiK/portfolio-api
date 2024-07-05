const EventEmitter = require('events').EventEmitter;

class Event extends EventEmitter {
  sendEvent(type, data) {
    this.emit(type, data);
  }

  getListeners(eventType) {
    return this.listeners(eventType);
  }
}

const AppEventBus = new Event();

module.exports = {
  AppEventEmitter: Event,
  AppEventBus,
};
