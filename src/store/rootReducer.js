import { combineReducers } from 'redux';
import userReducer from './slice/userSlice';
import registrationReducer from './slice/registrationSlice';
import trashMaterialReducer from './slice/trashMaterialSlice';

const rootReducer = combineReducers({
  user: userReducer,
  registration: registrationReducer,
  trashMaterial: trashMaterialReducer 
  // other reducers
});

export default rootReducer;
