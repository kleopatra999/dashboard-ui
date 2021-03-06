import {combineReducers} from 'redux';
import apps from './apps';
import user from './user';
import userList from './userList';
import manageApp from './manageApp';
import cache from './cache';
import queue from './queue';
import analytics from './analytics';
import {reducer as formReducer} from 'redux-form';

const todoApp = combineReducers({
    apps,
    user,
    userList,
    manageApp,
    analytics,
    cache,
    queue,
    form: formReducer
});

export default todoApp;
