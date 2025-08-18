import { combineReducers } from 'redux';
import userReducer from './slice/userSlice';
import registrationReducer from './slice/registrationSlice';
import trashMaterialReducer from './slice/trashMaterialSlice';
import trashPickersReducer from './slice/trashPickersSlice';
import trashRequestReducer from "./slice/trashRequestSlice";

const rootReducer = combineReducers({
  user: userReducer,
  registration: registrationReducer,
  trashMaterial: trashMaterialReducer,
  trashPickers: trashPickersReducer, 
  trashRequest: trashRequestReducer,
  // other reducers
});

export default rootReducer;
