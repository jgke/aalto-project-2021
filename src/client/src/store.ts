import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { projectReducer } from './reducers/projectReducer';

const reducer = combineReducers({
    project: projectReducer,
});

export const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk))
);
