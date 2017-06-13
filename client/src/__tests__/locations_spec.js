import deepFreeze from 'deep-freeze';

import locationsReducer from '../reducers/locationsReducer';
import { FETCH_LOCATIONS_DATA_SUCCESS, FETCH_LOCATIONS_DATA_FAILURE } from '../actions/types';

it("updates the location data", function(){
    const initialState = {
        data: {}
    };
    const action = {
        type: FETCH_LOCATIONS_DATA_SUCCESS,
        data: {
            food: ["yum yum"]
        }
    };
    const finalState = {
        data: {
            food: ["yum yum"]
        }
    };
    deepFreeze(initialState);
    deepFreeze(action);
    
    
    expect(locationsReducer(initialState, action)).toEqual(finalState);
})

it("updates the error in the state on failure", function(){
    const initialState = {
        data: {},
        error: null
    };
    const action = {
        type: FETCH_LOCATIONS_DATA_FAILURE,
        error: "There was an error while fetching"
    };
    const finalState = {
        data: {},
        error: "There was an error while fetching"
    };
    deepFreeze(initialState);
    deepFreeze(action);
    
    
    expect(locationsReducer(initialState, action)).toEqual(finalState);
})

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
import fetchMock from 'fetch-mock'
import { fetchLocationsData } from '../actions/locations';

describe('async actions', () => {
    afterEach(() => {
        fetchMock.reset();
    })
    it('creates FETCH LCATIONS DATA SUCCESS upon successful status 200', () => {
        fetchMock.get(`api/locations`, {
            status: 200,
            body: {
                locations:{food: [], sights: []}
            }
        })
        const expectedActions = [{
            type: FETCH_LOCATIONS_DATA_SUCCESS,
            data: {food: [], sights: []}
        }]
        const store = mockStore({
            locations: {}
        })
        // return fetch(`/api/users/vaccines?token=${token}`)
        // .then(response => {
        //     expect(response.status).toEqual(200);
        // })
        return store.dispatch(fetchLocationsData()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})