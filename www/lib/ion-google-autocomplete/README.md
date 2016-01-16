ion-google-autocomplete
================

Ionic directive for a location dropdown that utilizes google maps

![Animated demo](https://github.com/guillahume/ion-google-autocomplete/raw/master/demo.gif)

This is a simple directive for an autocomplete overlay location field built for Ionic Framework.

#Installation

Installation should be dead simple, you can grab a copy from bower:
```bash
bower install ion-google-autocomplete
```

Or clone this repository.

For the geolocation service to work, you'll need to have Google Maps javascript API somewhere in your HEAD tag:
`<script src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>`

You'll need to add `ion-google-autocomplete` as a dependency on your Ionic app:
```javascript
angular.module('myApp', [
  'ionic',
  'ion-google-autocomplete'
]);
```

That's pretty much it. Now you can use the directive like so:
`<ion-google-autocomplete placeholder="Enter an address, Apt# and ZIP" ng-model="location" places-options="placesOptions" />`

and in your controller:
`    $scope.placesOptions = {
      types: ['geocode', 'establishment'],
      componentRestrictions: {country:'fr'}
    };`

more info on places options :    
https://developers.google.com/maps/documentation/javascript/reference#AutocompletionRequest
