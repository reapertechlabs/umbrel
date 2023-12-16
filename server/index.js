#!/usr/bin/env node
import fse from 'fs-extra'

import update from './update/index.js'
import server from './server.js'

const main = async() => {
  // Run migrations and exit if --update flag is passed
  if (process.argv.includes('--update')) {
    const updateIndex = process.argv.indexOf('--update')
    const updateRoot = process.argv[updateIndex + 1]
    const umbrelRoot = process.argv[updateIndex + 2]
    await update({updateRoot, umbrelRoot})
    process.exit(0)
  }

  if (!process.argv.includes('--data-directory')) throw new Error('No data directory specified')
  const UMBREL_ROOT = process.argv[process.argv.indexOf('--data-directory') + 1]
  if (!await fse.pathExists(`${UMBREL_ROOT}/.umbrel`)) throw new Error('Invalid data directory')
  server.set('UMBREL_ROOT', UMBREL_ROOT)

  // Start server

  const port = process.env.UMBRELD_PORT || 8881
  const bind_address = process.env.UMBRELD_HOST || '127.0.0.1'
 
  server.listen(port, bind_address, function() {
    console.log(`Umbrel server listening on port`)
  })
}

main()