expect = require('chai').expect
_un = require('underscore')
sinon = require('sinon')
form = require('../src/form.js')
require('sinon-as-promised')

describe 'capCase', ->
  it 'returns the string with the first letter capitalized', ->
    cappedString = capCase('telephone')
    expect(cappedString).to.equal 'Telephone'
    return
  it 'returns a nonstring as false', ->
    cappedString = capCase(null)
    expect(cappedString).to.equal false
    return
  return
describe 'ifUpper(char)', ->
  it 'should return true if the character is uppercase', ->
    expect(ifUpper('U')).to.equal true
    return
  it 'returns false if the character is uppercase', ->
    expect(ifUpper('u')).to.equal false
    return
  it 'returns false there is not a character', ->
    expect(ifUpper(8)).to.equal false
    return
  return
describe 'addWord(label, key)', ->
  it 'separates keys into words based on camelCasing', ->
    label = addWord('', 'newKey')
    expect(label).to.equal 'New Key'
    return
  it 'only capitalizes the first letter of one  word', ->
    label = addWord('', 'newkey')
    expect(label).to.equal 'Newkey'
    return
  it 'adds an new to an existing label (expects a space)', ->
    label = addWord('Initial ', 'newkey')
    expect(label).to.equal 'Initial Newkey'
    return
  it 'throws an error for passing through not a string', ->
    try
      label = addWord('Initial ', 8)
    catch err
      expect(err).to.be.an.instanceof TypeError
    return
  return
describe 'labelMaker(key, subKey)', ->
  it 'it creates a label from two words', ->
    label = labelMaker('Initial', 'newKey')
    expect(label).to.equal 'Initial New Key'
    return
  it 'throws an error if no subkey', ->
    try
      label = labelMaker('Initial ')
    catch err
      expect(err).to.be.an.instanceof TypeError
    return
  return
descibe 'getDirectoryJSON(dir,tree)', ->
  it '', ->
  return
