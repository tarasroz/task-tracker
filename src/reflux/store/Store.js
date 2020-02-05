import Reflux from 'reflux';
import Immutable from 'immutable';
import '../style.scss';
import { actionTag, actionFilter } from '../actions/Actions';

export var storeFiltertags = Reflux.createStore({
  init() {
    this.filteringTags = Immutable.fromJS([]);
    this.items = [];
    this.filtered = this.items;

    console.log('Opening a new database');
    var request = indexedDB.open('todos', 2);
    request.onsuccess = (e) => {
      this.db = e.target.result;

      console.log('Filtertags database has been created under the name "todos".');

      var objectStore = this.db.transaction('todos').objectStore('todos');
      objectStore.openCursor().onsuccess = this.onCursor;
    };
    request.onerror = (e) => {
      console.error('An error has occurred. ERR: ' + e.message);
    };
    request.onupgradeneeded = (e) => {
      var db = e.target.result;
      console.log('Creating object store "todos"');

      var objectStore = db.createObjectStore('todos', { keyPath: 'id' });
      objectStore.transaction.oncomplete = () => {
        console.info('Object store has been created');
      };
    };

    this.listenTo(actionTag, this.onActionTag);
    this.listenTo(actionFilter, this.onActionFilter);
  },

  onCursor(e) {
    var cursor = e.target.result;

    if (!cursor) {
      // We have no more data
      console.info('No more items');
      this.trigger(this.items);

      return;
    }

    var filtertag = cursor.value;
    console.log('Loading item: ', filtertag.summary);
    this.items.push(Immutable.fromJS(filtertag));

    cursor.continue();
  },

  onActionTag(filtertag, tags) {
    console.log('Store: Updating item\'s tags as "%o" for %s', tags, filtertag.get('id'));
    var objectStore = this.db.transaction(['todos'], "readwrite").objectStore('todos');

    var updatedToDo = filtertag.update('tags', value => tags);
    console.log('Updated: ', updatedToDo.toJS());
    var request = objectStore.put(updatedToDo.toJS());

    request.onsuccess = (e) => {
      console.log('Store: Backend has been updated.');
      var index = this.items.indexOf(filtertag);

      this.items[index] = updatedToDo;
      console.log('Item\'s new tags: ', tags);

      var shouldKeepInFiltered = false;

      if (this.filteringTags.size === 0) {  // There is no filtering
        shouldKeepInFiltered = true;  // No effect here! Leave here for clarity
      }
      else {
        for (let tag of tags) {
          if (this.filteringTags.includes(tag)) {
            shouldKeepInFiltered = true;
            break;
          }
        }
        // TODO Improve this iteration
        if (!shouldKeepInFiltered) {
          var filtered = this.items.filter((item) => {
            for (let tag of this.filteringTags) {
              if (item.get('tags').indexOf(tag) !== -1) {

                return true;
              }
            }

            return false;
          });

          this.filtered = filtered;
          this.triggerAsync(this.filtered);
        }
      }
    };
  },
  onActionFilter(data) {
    console.log('Store: Filtering by tags: %o', data);

    var tags = data;
    if (!tags.length) {
      this.filtered = this.items;
      this.triggerAsync(this.filtered);

      return;
    }
    this.filteringTags = Immutable.fromJS(tags);
    console.log('Updated filtering tags: ', this.filteringTags);

    var filtered = this.items.filter((item) => {
      for (let tag of tags) {
        if (item.get('tags').indexOf(tag) !== -1) {

          return true;
        }
      }

      return false;
    });

    this.filtered = filtered;
    this.triggerAsync(this.filtered);
  }
});