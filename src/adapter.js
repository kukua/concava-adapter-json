import Store from 'jfs'

var tokens, meta, stores = {}

export let auth = (req, options, data, cb) => {
	if ( ! tokens) tokens = new Store(options.file)

	tokens.get(req.auth.token, (err, user) => {
		if (err || ! user) return cb('Unauthorized token.')
		cb(null, user)
	})
}

export let metadata = (req, options, data, { SensorAttribute }, cb) => {
	if ( ! meta) meta = new Store(options.file)

	meta.get(data.getDeviceId(), (err, meta) => {
		if (err || ! meta) return cb(`No metadata for ${data.getDeviceId()}.`)

		var attributes = meta.map((info) => {
			var attr = new SensorAttribute(info.name)

			if ( ! Array.isArray(info.converters)) {
				return cb(`No converters for ${data.getDeviceId()}.`)
			}

			info.converters.forEach((conv) => {
				var type = conv, value
				if (Array.isArray(conv)) [ type, value ] = conv
				attr.addConverter(type, value)
			})

			if (Array.isArray(info.calibrators)) {
				info.calibrators.forEach((fn) => attr.addCalibrator(new Function(fn)))
			}

			if (Array.isArray(info.validators)) {
				info.validators.forEach((val) => {
					var type = val, value
					if (Array.isArray(val)) [ type, value ] = val
					attr.addValidator(type, value)
				})
			}

			return attr
		})

		data.setAttributes(attributes)
		cb()
	})
}

export let storage = (req, options, data, cb) => {
	var deviceId = data.getDeviceId()
	var store = stores[deviceId]

	if ( ! store) {
		store = stores[deviceId] = new Store(options.path + `/store.${deviceId}.json`)
	}

	store.save(data.getData(), cb)
}
