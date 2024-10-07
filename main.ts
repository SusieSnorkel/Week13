// Define the task type to enforce data structure with TypeScript
interface Task {
    id: number;
    name: string;
}

// API URL for the tasks endpoint
const API_URL = 'http://localhost:3000/tasks';

// Helper function to get and display tasks from the API
async function getTasks(): Promise<void> {
    try {
        // Fetch tasks data from the API
        const response = await fetch(API_URL);
        const tasks: Task[] = await response.json();

        // Select the task list element in the DOM
        const taskList = document.getElementById('taskList') as HTMLUListElement;
        taskList.innerHTML = ''; // Clear the task list before displaying updated data

        // Loop over tasks to create list items for each
        tasks.forEach(task => {
            // Create a list item element with Bootstrap classes
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = task.name;

            // Create a delete button for each task
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTask(task.id);

            // Append the delete button to the list item and the item to the list
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Helper function to add a new task via the API
async function addTask(name: string): Promise<void> {
    try {
        // Send a POST request with the new task's name in JSON format
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        // Refresh the task list if the request is successful
        if (response.ok) {
            getTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Helper function to delete a task via the API by its ID
async function deleteTask(id: number): Promise<void> {
    try {
        // Send a DELETE request for the specified task ID
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        // Refresh the task list if the request is successful
        if (response.ok) {
            getTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Add event listener for form submission to handle adding a new task
const taskForm = document.getElementById('taskForm') as HTMLFormElement;
taskForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    const taskName = (document.getElementById('taskName') as HTMLInputElement).value;

    // Add the task if there's a valid name, then clear the input field
    if (taskName) {
        await addTask(taskName);
        (document.getElementById('taskName') as HTMLInputElement).value = '';
    }
});

// Fetch and display tasks on page load
getTasks();
