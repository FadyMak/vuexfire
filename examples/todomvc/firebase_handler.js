import { refsConfig } from './vuex/store'

const todosRef = refsConfig.todos.source

export const addTodo = (text) => {
  todosRef.push({
    text: text,
    done: false
  })
}

export const deleteTodo = (todo) => {
  todosRef.child(todo['.key']).remove()
}

export const toggleTodo = (todo) => {
  todosRef.child(todo['.key']).update({done: !todo.done})
}

export const editTodo = (todo, text) => {
  todosRef.child(todo['.key']).update({text: text})
}

export const toggleAll = (todos, done) => {
  todos.forEach((todo) => {
    todosRef.child(todo['.key']).update({ done: done })
  })
}

export const clearCompleted = (todos) => {
  // limitation of binding as an array:
  // As Firebase docs mentions "Arrays are Evil"
  // and this is a perfect example of it
  let keysToDelete = todos.map((todo) => {
    if (todo.done) return todo['.key']
  })
  keysToDelete.forEach((key) => todosRef.child(key).remove())
}
