import React from 'react';
import './style.scss';
import { cx } from './utilities/Utilities';
import { actionFilter } from './actions/Actions';
import createReactClass from 'create-react-class';

export var FilterBox = createReactClass({
    statics: {
        tags: [
            { value: 'low', label: 'low' },
            { value: 'middle', label: 'middle' },
            { value: 'high', label: 'high' }
        ]
    },
    getInitialState() {
        return {
            tags: []
        };
    },
    render() {
        var selectedTags = this.state.tags;

        var tagList = FilterBox.tags.map((tag) => {
            var classes = cx({
                'filterbox__item': true,
                'is-checked': selectedTags.indexOf(tag.value) !== -1,
                ['is-' + tag.value]: true
            });
            return (
                <span className={classes}
                    onClick={this.toggleFilter.bind(null, tag.value)}
                    key={tag.value}>
                    {tag.label}
                </span>
            );
        });

        return (
            <div className="filterbox">
                <div className="filterbox__item"> Filter: {tagList} </div>
            </div>
        );
    },
    toggleFilter(tag) {
        console.log('Adding more tag to the filter: %s', tag);

        var tags = this.state.tags;
        var index = tags.indexOf(tag);

        if (index === -1) {
            tags.push(tag);
        } else {
            tags.splice(index, 1);
        }

        console.log('Filtering by tags: %o', tags);
        this.setState({
            tags: tags
        });

        actionFilter(tags);
    }
});