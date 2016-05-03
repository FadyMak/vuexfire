import Vue from 'vue'

/**
 * Check if a value is an object.
 *
 * @param {*} val
 * @return {boolean}
 */
function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * Convert firebase snapshot into a bindable data record.
 *
 * @param {FirebaseSnapshot} snapshot
 * @return {Object}
 */
function createRecord (snapshot) {
  let value = snapshot.val()
  let record = isObject(value)
    ? value
    : { '.value': value }
  record['.key'] = snapshot.key()
  return record
}

/**
 * Find the index for an object with given key.
 *
 * @param {array} array
 * @param {string} key
 * @return {number}
 */
function indexForKey (array, key) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]['.key'] === key) {
      return i
    }
  }
  return -1
}

function bindAsObject (state, key, config) {
  let cancelCb = config.cancelCallback
  let source = config.source
  let once = config.once ? config.once : false
  let cb = (snapshot) => state[key] = createRecord(snapshot)

  if (once) {
    source.once('value', cb, cancelCb)
  } else {
    source.on('value', cb, cancelCb)
  }
}

function bindAsArray (state, key, config) {
  let array = state[key]
  let cancelCb = config.cancelCallback
  let source = config.source
  let once = config.once ? config.once : false

  if (once) {
    // To-Do
  } else {
    source.on('child_added', function (snapshot, prevKey) {
      let index = prevKey ? indexForKey(array, prevKey) + 1 : 0
      array.splice(index, 0, createRecord(snapshot))
    }, cancelCb)

    source.on('child_removed', function (snapshot) {
      var index = indexForKey(array, snapshot.key())
      array.splice(index, 1)
    }, cancelCb)

    source.on('child_changed', function (snapshot) {
      var index = indexForKey(array, snapshot.key())
      array.splice(index, 1, createRecord(snapshot))
    }, cancelCb)

    source.on('child_moved', function (snapshot, prevKey) {
      var index = indexForKey(array, snapshot.key())
      var record = array.splice(index, 1)[0]
      var newIndex = prevKey ? indexForKey(array, prevKey) + 1 : 0
      array.splice(newIndex, 0, record)
    }, cancelCb)
  }

}

export default function bind (store, refsConfig) {
  const state = store.state
  // keys mapping to the Vuex state
  const keys = Object.keys(refsConfig)

  for (let key of keys) {
    let config = refsConfig[key]
    if (config.hasOwnProperty('source')) {
      if (config.hasOwnProperty('asArray') && config.asArray) {
        // check that user actually defined the item as an array in the state
        bindAsArray(state, key, config)
      } else {
        bindAsObject(state, key, config)
      }
    }
  }

}
