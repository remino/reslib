/* eslint-disable import/no-extraneous-dependencies */

import 'mock-local-storage'

global.window = {}

window.localStorage = global.localStorage
