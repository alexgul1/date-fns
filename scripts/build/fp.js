#!/usr/bin/env node

/**
 * @file
 * The script generates the FP functions using the docs JSON file.
 *
 * It's a part of the build process.
 */

const fs = require('fs')
const path = require('path')
const prettier = require('./_lib/prettier')
const jsDocs = require(path.resolve(process.cwd(), 'tmp/docs.json'))

const generatedAutomaticallyMessage =
  "// This file is generated automatically by `scripts/build/fp.js`. Please, don't change it."
const FP_DIR = './src/fp'

const fpFns = Object.keys(jsDocs)
  .map((category) => jsDocs[category])
  .reduce((previousValue, newValue) => [...previousValue, ...newValue], [])
  .filter((doc) => doc.kind === 'function' && doc.isFPFn)

buildFP(fpFns)

function getFPFn(resultFnName, initialFnName, arity) {
  return [generatedAutomaticallyMessage]
    .concat('')
    .concat(`import fn from '../../${initialFnName}/index'`)
    .concat(`import convertToFP from '../_lib/convertToFP/index'`)
    .concat('')
    .concat(`export default convertToFP(fn, ${arity})`)
    .concat('')
    .join('\n')
}

function buildFPFn({ title, generatedFrom, args: { length } }) {
  const fpFnLines = getFPFn(title, generatedFrom, length)
  const fpFnDir = `${FP_DIR}/${title}`

  if (!fs.existsSync(fpFnDir)) {
    fs.mkdirSync(fpFnDir)
  }
  fs.writeFileSync(`${fpFnDir}/index.ts`, prettier(fpFnLines))
}

function buildFP(fns) {
  fns.forEach(buildFPFn)
}
