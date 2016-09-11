'use strict'

exports = module.exports = TimeCache

function TimeCache (options) {
  if (!(this instanceof TimeCache)) {
    return new TimeCache(options)
  }

  const validity = options.validity || 30 // seconds

  const entries = {}

  this.put = (key, value, validity) => {
    if (!entries[key]) {
      entries[key] = {
        value: value,
        timestamp: getTimeStamp(),
        validity: validity
      }
    }
    sweep()
  }

  this.get = (key) => {
    if (entries[key]) {
      return entries[key].value
    } else {
      throw new Error('key does not exist')
    }
  }

  this.has = (key) => {
    if (entries[key]) {
      return true
    } else {
      return false
    }
  }

  function sweep () {
    Object
      .keys(entries)
      .map((key) => {
        const entry = entries[key]
        const v = entry.validity || validity
        const delta = getTimeElapsed(entry.timestamp)
        if (delta > v) {
          delete entries[key]
        }
      })
  }
}

function getTimeStamp () {
  return new Date()
}

function getTimeElapsed (prevTime) {
  const currentTime = new Date()
  const delta = currentTime.getTime() - prevTime.getTime()
  const seconds = Math.floor((delta) / (1000))
  return seconds
}
