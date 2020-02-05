import React from 'react';
import Immutable from 'immutable';
import './style.scss';
import { cx } from './utilities/Utilities';
import { actionTag } from './actions/Actions';
import { storeFiltertags } from './store/Store';
import createReactClass from 'create-react-class';
import { Tags } from './Tags';

export var FilterTagsContainer = createReactClass({
    getInitialState() {
        return {
            items: Immutable.fromJS(storeFiltertags.items)
        };
    },
    componentDidMount() {
        this.stopListening = storeFiltertags.listen((data) => {
            console.log("data: ", data);
            this.setState({
                items: Immutable.fromJS(data) // Freeze the object state
            })
        });
    },
    componentWillUnmount() {
        this.stopListening();
    },
    render() {
        var content;
        if (!this.state.items.size) {
            content = (
                <div className='filtertag-list'>
                    <p className="filtertag-list__message">
                        You have nothing to do!
                    </p>
                </div>
            );
        }
        else {
            let items = (this.state.items.map((item) => {
                var boundItemTag = this.onTagDelegate.bind(this, item);

                var classes = cx({
                    'filtertag-list__item filtertag-item': true,
                    'is-checked': item.get('status') === 'done'
                });

                return (
                    <li className={classes} key={item.get('id')}>
                        <Tags className='filtertag-item__tags' tags={item.get('tags')} editable='true'
                            onToggleTag={boundItemTag}
                        />
                    </li>
                );
            }));
            //*/
            content = (
                <ul className='filtertag-list'>
                    {items}
                </ul>
            );
        }

        return content;
    },

    onTagDelegate(item, tags) {
        console.log('Tags applied to item %s: %o', item.get('summary'), tags);
        actionTag(item, tags);
    }
});