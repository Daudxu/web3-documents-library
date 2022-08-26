import { combineReducers } from 'redux-immutable';
import { reducer as handerReducer } from '../views/common/header/store';
// import { reducer as approvescanReducer } from '../views/approvescan/store';

const reducer = combineReducers({
    header: handerReducer,
    // approvescan: approvescanReducer
});

export default reducer;