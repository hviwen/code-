class EventHandler {
  constructor(element) {
    this.element = element
    this.listeners = new Map()

    this.handleClick = event => {
      console.log(`Click handled by ${this.constructor.name}`)
      this.triggerCustomEvent('click', event)
    }

    this.handleKeydown = event => {
      console.log(`Keydown handled: ${event.key}`)
      this.triggerCustomEvent('keydown', event)
    }
  }


  addEventListener(eventType, callback) {
    if(!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType).push(callback)

    if(eventType === 'click'){
     this.element.addEventListener('click',this.handleClick)
    }else if(eventType === 'keydown'){
      this.element.addEventListener('keydown', this.handleKeydown)
    }
  }

  removeEventListener(eventType, callback) {
    if(this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType)
      const index = callbacks.indexOf(callback)
      if(index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  triggerCustomEvent(eventType, originalEvent) {
    if(this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        callback(originalEvent)
      })
    }
  }

  destroy() {
    this.listeners.clear()
    this.element.removeEventListener('click', this.handleClick)
    this.element.removeEventListener('keydown', this.handleKeydown)
  }
}
