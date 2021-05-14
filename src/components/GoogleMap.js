import React, { useEffect, useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Geocode from "react-geocode";

const REACT_APP_MAPAPI_KEY = process.env.REACT_APP_MAPAPI_KEY_CLIENT;
Geocode.setApiKey(REACT_APP_MAPAPI_KEY);
Geocode.enableDebug();

function GoogleMap(props) {
  const [address, setAddress] = useState("");
  const [zoom, setZoom] = useState(15);
  const [mapCenter, setMapCenter] = React.useState({
    lat: 49.2827291,
    lng: -123.1207375,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((response) => {
      const currentPosition = {
        lat: response.coords.latitude,
        lng: response.coords.longitude,
      };
      setZoom(16);
      setMapCenter(currentPosition);
      const coords = response.coords;
      Geocode.fromLatLng(coords.latitude, coords.longitude).then(
        (response) => {
          const address = response.results[0].formatted_address;
          setAddress(address);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }, []);

  const handleSelect = (address) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setZoom(17);
        setMapCenter(latLng);
      })
      .catch((error) => console.error("Error", error));
  };

  const handleChange = (address) => {
    setAddress(address);
  };

  const onMarkerDragEnd = (props, map, e) => {
    let lat = e.latLng.lat();
    let lng = e.latLng.lng();
    setMapCenter({ lat, lng });
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        let address = response.results[0].formatted_address;
        setAddress(address);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const selectLocation = (props, map, e) => {
    let lat = e.latLng.lat();
    let lng = e.latLng.lng();
    setMapCenter({ lat, lng });
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        let address = response.results[0].formatted_address;
        setAddress(address);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const onInfoWindowClose = () => {};

  return (
    <div id="googleMaps" className="GooGleMap-1-Container">
      <h2>Google Map</h2>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        highlightFirstSuggestion={true}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
              })}
              style={{
                width: "89%",
                height: "40px",
                paddingLeft: "16px",
                marginTop: "2px",
                marginBottom: "10px",
              }}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, i) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active
                  ? {
                      backgroundColor: "#cceeff",
                      cursor: "pointer",
                      width: "89%",
                    }
                  : {
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      width: "89%",
                      borderBottom: "1px dark",
                    };
                return (
                  <div
                    key={i}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <Map
        className="GooGleMap-1"
        google={props.google}
        initialCenter={mapCenter}
        zoom={zoom}
        center={mapCenter}
        onClick={selectLocation}
      >
        <Marker
          position={mapCenter}
          onDragend={onMarkerDragEnd}
          draggable={true}
          onInfoWindowClose={onInfoWindowClose}
        ></Marker>
      </Map>
    </div>
  );
}

const LoadingContainer = (props) => <div>loading container!</div>;

export default GoogleApiWrapper({
  apiKey: REACT_APP_MAPAPI_KEY,
  LoadingContainer: LoadingContainer,
})(GoogleMap);
