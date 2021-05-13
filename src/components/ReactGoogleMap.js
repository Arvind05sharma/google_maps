import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Geocode from "react-geocode";

const REACT_APP_MAPAPI_KEY = process.env.REACT_APP_MAPAPI_KEY_CLIENT;
Geocode.setApiKey(REACT_APP_MAPAPI_KEY);
Geocode.enableDebug();
const containerStyle = {
  width: "1120px",
  height: "420px",
};

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};

function ReactGoogleMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: REACT_APP_MAPAPI_KEY,
  });
  const [map, setMap] = React.useState(null);
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const [mapCenter, setMapCenter] = React.useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  const [address, setAddress] = React.useState("");
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((response) => {
      const currentPosition = {
        lat: response.coords.latitude,
        lng: response.coords.longitude,
      };
      setZoom(17);
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

  const handleChange = (address) => {
    setAddress(address);
  };

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

  const onMarkerDragEnd = (e) => {
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

  const selectLocation = (e) => {
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

  return isLoaded ? (
    <div id="google_map" className="GooGleMap-2-Conatiner">
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
      <GoogleMap
        className="GooGleMap-2"
        mapContainerStyle={containerStyle}
        center={{
          lat : mapCenter.lat,
          lng : mapCenter.lng
        }}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={selectLocation}
      >
        {mapCenter.lat ? (
          <Marker
            position={mapCenter}
            onDragEnd={(e) => onMarkerDragEnd(e)}
            draggable={true}
          >
            <InfoWindow position={mapCenter}>
              <h1 className="Infowindow">{address}</h1>
            </InfoWindow>
          </Marker>
        ) : null}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(ReactGoogleMap);
