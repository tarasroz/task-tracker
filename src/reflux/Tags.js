import React from 'react';
import Immutable from 'immutable';
import './style.scss';
import {cx} from './utilities/Utilities';
import createReactClass from 'create-react-class';

export var Tags = createReactClass({
    statics: {
      tags: [
        { value: 'low', label: 'low' },
        { value: 'middle', label: 'middle' },
        { value: 'high', label: 'high' }
      ]
    },
    getInitialState () {
      return {
        tags: Immutable.fromJS(this.props.tags || []),
        editing: false
      };
    },
    render () {
      var classes = cx({
        'filtertag-tags': true,
        [this.props.className]: true,
        'is-editing': this.state.editing,
        'is-tagged': this.state.tags.size > 0
      });
      
      var dropdown;
      
      if (this.state.editing) {
        dropdown = (
          <ul className="filtertag-tags__dropdown">
          {Tags.tags.map(tag => <li key={tag.value} className="filtertag-tags__item" onClick={this.toggleTag.bind(this, tag.value)}>{tag.label}</li>)}
          </ul>
        );  
      }
      
      return (
        <div className={classes} onClick={this.toggleEdit} onBlur={this.endEdit} tabIndex="0">
          <span className="filtertag-tags__label">
            {this.state.tags.size===0?'tags':this.state.tags.map(tag => {
              var classes = cx({
                'filtertag-tags__value': true,
                ['is-' + tag]: true
              });
  
              return (<span className={classes}>{tag}</span>);
            })}
          </span>
          {dropdown}
        </div>
      );
    },
    toggleEdit (e) {
      e.stopPropagation();
  
      if (this.state.editing) {
        this.endEdit();
      } else {
        this.beginEdit();
      }
    },
    beginEdit () {
      if (this.state.editing) {
        return;
      }
      
      this.setState({'editing': true});
      Tags.activeID = null; //this.getID();
    },
    endEdit () {
      console.log('Ending edit...');
      
      if (Tags.active && Tags.active === this) {
        Tags.active = null;
      }
      
      this.setState({'editing': false});
    },
    toggleTag (tag, e) {
      e.stopPropagation();
      
      var tags = this.state.tags;
      if (!tags) {
        console.assert(!tags, 'Tags is expected');
        return;
      }
      
      var index = tags.indexOf(tag);
      if (index === -1) {
        tags = tags.push(tag);
      } else {
        tags = tags.delete(index);
      }
      
      this.setState({
        tags: tags
      });
      
      var onToggleTag = this.props.onToggleTag;
      if (!onToggleTag) {
        console.info('No handler for onToggleTag');
        return;
      }
      
      onToggleTag(tags);
      this.endEdit();
    }
  })