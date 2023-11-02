import mitt from 'mitt'

export class Dispatcher<
	Events extends {
		change: any
	}
> {
	protected emitter = mitt<Events>()
	protected emit = this.emitter.emit

	public on = this.emitter.on
	public off = this.emitter.off
	public all = this.emitter.all

	constructor() {
		// use a proxy to dispatch an event whenever any property is changed on the object
		return new Proxy(this, {
			set: (target, property, value) => {
				let success = Reflect.set(target, property, value)
				if (success) {
					this.emit('change', value)
				}
				return success
			}
		})
	}

	toJSON() {
		return {}
	}
}
