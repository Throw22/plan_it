import React, {
  Component
}
from "react";
import InitialSubmissionForm from "../components/InitialSubmissionForm";
import {
  fetchLocationsData,
  setFetching
}
from "../actions/locationsActions";
import {
  toggleMealsInclusion
}
from '../actions/builderActions';
import {
  connect
}
from "react-redux";
import {
  withRouter
}
from "react-router-dom";
import ItineraryHelper from "../helpers/itineraryHelper";
import "../stylesheets/loading.css";
import {
  geocodeByAddress,
  getLatLng
}
from "react-places-autocomplete";
import {
  changeTransportationMode
}
from "../actions/itineraryActions";

//references
import preferences from '../references/preferences';
import modesOfTransportation from '../references/modesOfTransportation';

import TimeHelper from '../helpers/timeHelper';


function initPreferences(preferences) {
  const prefs = {};
  preferences.forEach((pref) => {
    prefs[pref] = true;
  });
  return prefs;
}

const Loader = () => <div className="loader">Loading...</div>;

class InitialSubmissionFormContainer extends Component {
  constructor(props) {
    super(props);
    
    //Determine if location is required
    let geolocationPermission = true;
    navigator.permissions.query({'name': 'geolocation'})
    .then( permission => {
      if (permission.state === 'denied'){
        geolocationPermission = false;
      }
    });


    this.state = {
      nextHour: TimeHelper.getNextHour(),
      startTime: TimeHelper.getNextHour(),
      endTime: TimeHelper.getNextHour() + 2 * 60 * 60 * 1000,
      startingLocation: null,
      address: "",
      addressError: "",
      error: null,
      validItinerary: false,
      preferences: initPreferences(preferences),
      includeMeals: this.props.builder.mealsIncluded,
      requireAddress: geolocationPermission
    };
  }

  componentDidMount() {
    //check localStorage for itinerary: id
    if (ItineraryHelper.validItinerary()) {
      this.setState({
        validItinerary: ItineraryHelper.getItineraryObj()
      });
    }
    else {
      this.setState({
        validItinerary: false
      });
    }
  }

  componentWillReceiveProps(newProps) {
    //if locations.data is now populated, redirect them to itinerary-creation
    /**
     * Pattern is to push from inside the lifecycle hooks from the 
     * containers which are responsible for dispatching the actions
     * 
     * */
    if (Object.keys(newProps.locations.data).length > 0) {
      let totalNumOfLocations = Object.keys(newProps.locations.data).reduce((acc, loc) => {
        return acc + newProps.locations.data[loc].length;
      }, 0);
      if (totalNumOfLocations === 0) {
        this.setState({
          error: "No selections returned! Try adding more preferences."
        });
      }
      else {
        this.props.history.push("/itinerary-creation");
      }
    }
    //if error in form
    if (newProps.locations.error) {
      this.setState({
        error: newProps.locations.error
      });
    }


    if (newProps.builder.mealsIncluded !== this.state.includeMeals) {
      this.setState({
        includeMeals: !this.state.includeMeals
      });
    }

  }



  onStartTimeChange = e => {
    //if the endTime would be less than two hours after the new startTime
    //advance it to at least two hours
    if (this.state.endTime - +e.target.value < 2) {
      this.setState({
        startTime: +e.target.value,
        endTime: +e.target.value + 2
      });
    }
    else {
      this.setState({
        startTime: +e.target.value
      });
    }
  };

  onEndTimeChange = e => {
    this.setState({
      endTime: +e.target.value
    });
  };

  onChangeAddress = address => this.setState({
    address,
    addressError: ""
  });
  onAddressError = status => {
    this.setState({
      address: "",
      addressError: "No results"
    });
  };


  //toggle the check box value,
  //assumes default unchecked
  onPrefChange = e => {
    this.setState({
      preferences: {
        ...this.state.preferences,
        [e.target.value]: !this.state.preferences[e.target.value]
      }
    });
  }

  onMealsChange = e => {
    this.props.toggleMealsInclusion();
  }

  onTransporationModeChange = e => {
    this.props.changeTransportationMode(e.target.value);
  }

  onFormSubmit = e => {
    e.preventDefault();
    this.props.setFetching();
    //construct simple json for form submission from the state
    let data = {
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      preferences: Object.keys(this.state.preferences).filter((pref) => {
        return this.state.preferences[pref];
      }),
      includeMeals: this.state.includeMeals,
      transportationMode: this.props.itinerary.transportationMode
    };
    if (this.state.address) {
      //if user entered address
      geocodeByAddress(this.state.address)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
          console.log("Success", latLng);
          data.startingLocation = [latLng.lat, latLng.lng];
        })
        .then(() => {
          console.log("FROM AUTOCOMPLETE", data);
          this.props.fetchLocationsData({
            formSubmission: data
          });
        })
        .catch(error => console.error("Error", error));
    }
    else if ("geolocation" in navigator) {
      //attempt to get location with geolocation API if user didn't enter address
      /* geolocation is available */

      let p = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(function(position) {
          resolve([position.coords.latitude, position.coords.longitude]);
        }, reject);
      });
      p
        .then(
          coordinates => {
            data.startingLocation = coordinates;
          },
          geolocationDeny => {
            //prompt with box for starting location and update the state?
            console.log("Please enter a starting location");
            this.setState({
              requireAddress: true,
              error: "Please let us know where you'd like to start."
            });

          }
        )
        .then(form => {
          console.log("updated data", data);
          //send form to action dispatcher
          this.props.fetchLocationsData({
            formSubmission: data
          });
        });
    }
    else {
      /* geolocation IS NOT available */
      //Set the address input field to required
    }
  };
  render() {
    if (this.props.locations.isFetching) {
      return <Loader />;
    }
    else {
      //create new rounded time to pass to submission form each time
      //consider moving to lifecycle hook to check for changes to avoid rerenders
      return (
        <InitialSubmissionForm
          onSubmit={this.onFormSubmit}
          onStartTimeChange={this.onStartTimeChange}
          onEndTimeChange={this.onEndTimeChange}
          onAddressError={this.onAddressError}
          onChangeAddress={this.onChangeAddress}
          onPrefChange={this.onPrefChange}
          onMealsChange={this.onMealsChange}
          onTransporationModeChange={this.onTransporationModeChange}
          modesOfTransportation={modesOfTransportation}
          currentModeOfTransportation={this.props.itinerary.transportationMode}
          requireAddress={this.state.requireAddress}
          {...this.state}
        />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    locations: state.locations,
    builder: state.builder,
    itinerary: state.itinerary
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLocationsData: form => {
      dispatch(fetchLocationsData(form));
    },
    toggleMealsInclusion: () => {
      dispatch(toggleMealsInclusion());
    },
    changeTransportationMode: (mode) => {
      dispatch(changeTransportationMode(mode));
    },
    setFetching: () => {
      dispatch(setFetching());
    }
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InitialSubmissionFormContainer)
);
