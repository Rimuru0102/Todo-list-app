import storage from "./util/storage.js";

const init = {
    todos: storage.get(),
    filter: "all",
    filters: {
        all: () => true,
        active: (todo) => !todo.completed,
        completed: (todo) => todo.completed,
    },
    editIndex: null,
    priorities: {
        important: 0,
        normal: 1,
        unimportant: 2,
    },
};

const actions = {
    add({ todos }, title) {
        if (title) {
            todos.push({ title, completed: false, priority: "normal" });
            storage.set(todos);
        }
    },
    toggle({ todos }, index) {
        const todo = todos[index];
        todo.completed = !todo.completed;
        storage.set(todos);
    },
    toggleAll({ todos }, completed) {
        todos.forEach((todo) => (todo.completed = completed));
        storage.set(todos);
    },
    destroy({ todos }, index) {
        todos.splice(index, 1);
        storage.set(todos);
    },
    switchFilter(state, filter) {
        state.filter = filter;
    },
    clearCompleted(state) {
        state.todos = state.todos.filter(state.filters.active);
        storage.set(state.todos);
    },
    startEdit(state, index) {
        state.editIndex = index;
    },
    endEdit(state, title) {
        if (state.editIndex != null) {
            if (title) {
                state.todos[state.editIndex].title = title;
                storage.set(state.todos);
            } else {
                this.destroy(state, state.editIndex);
            }
            state.editIndex = null;
        }
    },
    cancelEdit(state) {
        state.editIndex = null;
    },
    addPriority(state, index, priority) {
        const todo = state.todos[index];
        todo.priority = priority;
        storage.set(state.todos);
        state.todos.sort((a, b) => state.priorities[a.priority] - state.priorities[b.priority]);
        storage.set(state.todos);
    },
};

export default function reducer(state = init, action, args) {
    actions[action] && actions[action](state, ...args);
    return state;
}
