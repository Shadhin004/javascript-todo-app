const submitButton = document.querySelector('#todo-input-button')
const submitForm = document.querySelector('#todo-submit-form')
const inputBox = document.querySelector('#todo-input-box')
const alertMessageBox = document.querySelector('#alert-message')
const todoListContainer = document.querySelector('#todo-container')
const todoCounterContainer = document.querySelector('#todo-counter')

const searchForm = document.querySelector('#todo-search-form')
const searchButton = document.querySelector('#todo-search-button')
const searchBox = document.querySelector('#todo-search-box')
const resetButton = document.querySelector('#todo-reset-button')

const editFormContainer = document.createElement('div')

let userInput = ''
let tempEditText = ''
let searchQuery = ''
const todoList = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []

const handleUserinput = () => {
    userInput = event.target.value;
}

const removeText = (className) => {
    alertMessageBox.textContent = ''
    alertMessageBox.classList.remove(className)
}

const showAlertText = (text, className) => {
    alertMessageBox.textContent = text
    alertMessageBox.classList.add(className)
    setTimeout(() => removeText(className), 1000)
}

const handleFormSubmit = () => {
    if (userInput) {
        const tempTodo = {
            id: Date.now(),
            title: userInput,
            completed: false
        }
        todoList.push(tempTodo)
        localStorage.setItem('todos', JSON.stringify(todoList))
        displayTodos()
        showAlertText('Todo added to List successfully!', 'success')
        userInput = ''

    }
    submitForm.reset()
}

// Display 
const displayTodos = () => {
    todoListContainer.innerHTML = ''
    todoCounterContainer.innerHTML = ''
    todoList.forEach((todo, index) => {
        //parent div
        const parentDiv = document.createElement('div')
        parentDiv.classList.add('parent-div')

        //checkbox
        const checkBox = document.createElement('input')
        checkBox.type = 'checkBox'
        checkBox.checked = todo.completed
        checkBox.addEventListener('change', ()=>handleCheckBox(todo.id))

        //title container
        const todoTextContainer = document.createElement('p')
        todoTextContainer.textContent = todo.title
        todoTextContainer.style.textDecoration = todo.completed ? 'line-through' : 'none'

        //delete button
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.classList.add('delete-button')
        deleteButton.addEventListener('click', ()=> deleteTodo(todo.id))

        //edit button
        const editModeOn = false
        const editButton = document.createElement('button')
        editButton.textContent = 'Edit'
        editButton.addEventListener('click', ()=> editTodo(todo, index))

        parentDiv.appendChild(checkBox)
        parentDiv.appendChild(todoTextContainer)
        parentDiv.appendChild(editButton)
        parentDiv.appendChild(deleteButton)

        todoListContainer.appendChild(parentDiv)

        });
    todoCounter()
}

//Delete function
const deleteTodo = (todoId) => {
    todoList = todoList.filter((todo)=> todo.id !== todoId)

    localStorage.setItem('todos', JSON.stringify(todoList))
    displayTodos()
    showAlertText('Todo deleted from List successfully!', 'success')
}

//Checkbox functionality
const handleCheckBox =(todoId)=>{
    const checkedTodo = todoList.find((todo)=> todo.id === todoId)
    checkedTodo.completed = !checkedTodo.completed
    localStorage.setItem('todos', JSON.stringify(todoList))
    displayTodos()
    showAlertText('Status has been changed successfully!', 'success')
}

//Edit todo
const editTodo = (todo, index) =>{
    //edit form
    const editInputBox = document.createElement('input')
    editInputBox.type = 'text'
    editInputBox.value = todo.title
    editInputBox.addEventListener('change', handleEditInputBox)

    const saveButton = document.createElement('button')
    saveButton.textContent = 'Save'
    saveButton.addEventListener('click', ()=> saveEditedTodo(todo, tempEditText))
    
    editFormContainer.appendChild(editInputBox)
    editFormContainer.appendChild(saveButton)
    
    const div = document.getElementsByClassName('parent-div')

    div[index].insertAdjacentElement('afterend', editFormContainer)

}

//Handle edit
const handleEditInputBox=()=>{
    tempEditText = event.target.value
    
}

//Save edited Todo
const saveEditedTodo = (item, text) =>{
    const targetEditTodo = todoList.find((todo)=> todo.id === item.id)
    targetEditTodo.title = tempEditText
    localStorage.setItem('todos', JSON.stringify(todoList))
    displayTodos()
    showAlertText('Todo Edited successfully!', 'success')

    tempEditText = ''
    editFormContainer.innerHTML = ''
    editFormContainer.remove()
}

//Search functionality
const handleSearchBox =()=>{
    searchQuery = event.target.value
}
const searchTodo =()=>{
    // const result = todoList.filter((todo)=> (todo.title.toUpperCase().match(searchQuery.toUpperCase())))
    // todoList = result
    const   todoList = todoList.filter((todo)=> (todo.title.toUpperCase().match(searchQuery.toUpperCase())))
    displayTodos()
}
const resetSearch =()=>{
    todoList = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
    displayTodos()
    searchForm.reset()
}

//todo counter
const todoCounter = () =>{    
    const completedTodos = todoList.filter((todo)=> todo.completed === true)
    const incompletedTodos = todoList.filter((todo)=> todo.completed === false)

    const completeTodoContainer = document.createElement('p')
    completeTodoContainer.textContent = `Completed - ${completedTodos.length}`
    
    const incompleteTodoContainer = document.createElement('p')
    incompleteTodoContainer.textContent = `Incompleted - ${incompletedTodos.length}`

    const totalTodoContainer = document.createElement('p')
    totalTodoContainer.textContent = `Total - ${todoList.length}`

    todoCounterContainer.appendChild(completeTodoContainer)
    todoCounterContainer.appendChild(incompleteTodoContainer)
    todoCounterContainer.appendChild(totalTodoContainer)
}

submitButton.addEventListener('click', handleFormSubmit)
inputBox.addEventListener('change', handleUserinput)
document.addEventListener('DOMContentLoaded', displayTodos)
searchBox.addEventListener('change', handleSearchBox)
searchButton.addEventListener('click', searchTodo)
resetButton.addEventListener('click', resetSearch)

