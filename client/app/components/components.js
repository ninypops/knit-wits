import ConfirmationModule from './confirmation/confirmation.module';
import IncidentFormModule from './incidentForm/incidentForm.module';
import IncidentListModule from './incidentList/incidentList.module';
import NavigationModule from './navigation/navigation.module';
import PasswordModule from './password/password.module';
import SearchBoxModule from './searchBox/searchBox.module';
import angular from 'angular';

const ComponentsModule = angular.module('app.components', [
	ConfirmationModule.name,
	IncidentFormModule.name,
	IncidentListModule.name,
	NavigationModule.name,
	SearchBoxModule.name,
	PasswordModule.name,
]);

export default ComponentsModule;
