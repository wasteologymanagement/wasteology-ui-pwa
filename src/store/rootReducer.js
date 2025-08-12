import { combineReducers } from 'redux';
import userReducer from './slice/userSlice';
import registrationReducer from './slice/registrationSlice';
import priceReducer from './slice/trashMaterialSlice';

const rootReducer = combineReducers({
  user: userReducer,
  registration: registrationReducer,
  price: priceReducer,
  // other reducers
});

export default rootReducer;
