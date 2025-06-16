import html from "../core.js";
import { connect } from "../store.js";

const connector = connect();

function TodoItem({ todo, index, editIndex, priorities }) {
    return html`
        <li class="${todo.completed && "completed"} ${editIndex === index && "editing"}">
            <div class="view ${todo.priority}">
                <input
                    class="toggle"
                    type="checkbox"
                    ${todo.completed && "checked"}
                    onchange="dispatch('toggle', ${index})"
                />
                <label ondblclick="dispatch('startEdit', ${index})">${todo.title}</label>

                <select
                    name="priority"
                    id="priority-select"
                    onchange="dispatch('addPriority', ${index}, this.value.trim())"
                >
                    ${Object.keys(priorities).map(
                        (option) => html`
                            <option value="${option}" ${todo.priority === option ? "selected" : ""}>
                                ${option[0].toUpperCase() + option.slice(1)}
                            </option>
                        `
                    )}
                </select>
                <button class="destroy" onclick="dispatch('destroy', ${index})"></button>
            </div>
            <input
                class="edit"
                value="${todo.title}"
                onkeyup="event.keyCode === 13 && dispatch('endEdit', this.value.trim()) || event.keyCode === 27 && dispatch('cancelEdit')"
                onblur="dispatch('endEdit', this.value.trim())"
            />
        </li>
    `;
}

export default connector(TodoItem);
