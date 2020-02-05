import React, { Component } from 'react';
import TaskTracker from '../components/TaskTracker';
import update from 'immutability-helper';
import 'whatwg-fetch';

export const API_URL = 'http://localhost:3000';
export const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'        // this can be any string
};

class TaskTrackerContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: [
                {
                    id: 1,
                    title: "Start the Book",
                    color: "#3a7e28",
                    status: "open",
                    tasks: [
                    ]
                },
                {
                    id: 2,
                    title: "Read the Book",
                    color: "#bd8d31",
                    status: "pending",
                    tasks: [
                    ]
                },
                {
                    id: 3,
                    title: "End the Book",
                    color: "red",
                    status: "done",
                    tasks: [
                    ]
                },
            ]
        }
    }

    addTask(cardId, taskName) {
        // let prevState = this.state;
        let newTask;
        // find the index of the card
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

        // create a new task with the given name and a temporary id
        if (cardIndex > 1) {
            newTask = { id: Date.now(), name: taskName, done: true };
        } else {
            newTask = { id: Date.now(), name: taskName, done: false };
        }

        // create a new state including the new created task 
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: { $push: [newTask] }
            }
        })

        // set new state to the mutated object
        this.setState({ cards: nextState })

        // call the API to add the task to the server
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        })
            .then((res) => {
                // if (res.ok) {
                return res.json()
                // }
                // else {
                //     // Throw an error if server response wasn't 'ok'
                //     throw new Error("Server response wasn't OK");
                // }
            })
            .then((responseData) => {
                // when the server returns the definitive id for the new task on the
                // server, update it on our local reactful state
                newTask.id = responseData.id;
                this.setState({ id: nextState })
            })
        // .catch((error) => {
        //     this.setState(prevState);
        // });
    }

    deleteTask(cardId, taskId, taskIndex) {
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        // let prevState = this.state;

        // create a new object without the task
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: { $splice: [[taskIndex, 1]] }
            }
        });

        // set the component state to the mutated object
        this.setState({ cards: nextState });

        // call the api to remove the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`,
            { method: 'delete', headers: API_HEADERS }
        )
            .then(res => {
                return res
            })
    }

    toggleTask(cardId, taskId, taskIndex) {
        let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
        let prevState = this.state;

        // Save a reference to the task's done value
        let newDoneValue = false;
        let newTask;

        let prevName = prevState.cards[cardIndex].tasks[`${taskIndex}`].name;

        if (cardIndex === 2) {
            alert("Please, do not toggle it! Restart a page.")
        } else if (cardIndex >= 1) {
            newTask = { id: taskId, name: prevName, done: true };
        } else {
            newTask = { id: taskId, name: prevName, done: false };
        }

        let nextState = update(this.state.cards, {
            [cardIndex + 1]: {
                tasks: {
                    $push: [newTask]
                }
            },
            [cardIndex]: {
                tasks: { $splice: [[taskIndex, 1]] }
            }
        });

        this.setState({ cards: nextState });

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({ done: newDoneValue })
        })
            .then(res => {
                console.log("response: ", res);
            })
    }

    componentDidMount() {
        fetch(API_URL + '/cards')
            .then(response => response.json())
            .then(responseData => this.setState({ cards: responseData }))
        // .catch(error => ("Error fetching and parsing data" + error));
    }

    render() {
        return (
            <TaskTracker
                cards={this.state.cards}
                taskCallbacks={{
                    add: this.addTask.bind(this),
                    delete: this.deleteTask.bind(this),
                    toggle: this.toggleTask.bind(this)
                }} />
        )
    }
}

export default TaskTrackerContainer;