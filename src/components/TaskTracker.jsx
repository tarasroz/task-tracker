import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "./List";
import { FilterBox } from "../reflux/FilterBox";

class TaskTracker extends Component {
  render() {
    return (
      <div className="app">

        <List
          id="open"
          title="Open"
          taskCallbacks={this.props.taskCallbacks}
          cards={this.props.cards.filter(card => card.status === "open")}
        />

        <List
          id="pending"
          title="Pending"
          taskCallbacks={this.props.taskCallbacks}
          cards={this.props.cards.filter(card => card.status === "pending")}
        />

        <List
          id="done"
          title="Done"
          taskCallbacks={this.props.taskCallbacks}
          cards={this.props.cards.filter(card => card.status === "done")}
        />

        <FilterBox />
      </div>
    );
  }
}

TaskTracker.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
};

export default TaskTracker;
