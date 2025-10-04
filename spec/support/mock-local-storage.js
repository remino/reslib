/* eslint-disable import-x/no-extraneous-dependencies */

import 'mock-local-storage'

global.window = {}

window.localStorage = global.localStorage
