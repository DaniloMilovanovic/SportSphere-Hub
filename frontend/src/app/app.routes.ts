import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome-component/welcome-component';
import { ForgottenPasswordComponent } from './components/forgotten-password-component/forgotten-password-component';
import { ResetPasswordComponent } from './components/reset-password-component/reset-password-component';
import { AdminLoginComponent } from './components/admin-login-component/admin-login-component';
import { RegistrationComponent } from './components/registration-component/registration-component';
import { FacilityDetailsComponent } from './components/facility-details-component/facility-details-component';
import { AdminComponent } from './components/admin-component/admin-component';
import { AthleteProfileOverviewComponent } from './components/athlete-profile-overview-component/athlete-profile-overview-component';
import { AthleteReservationComponent } from './components/athlete-reservation-component/athlete-reservation-component';
import { AthleteGradingComponent } from './components/athlete-grading-component/athlete-grading-component';
import { AthletePlayerSearchComponent } from './components/athlete-player-search-component/athlete-player-search-component';
import { AthleteFacilityDetailsComponent } from './components/athlete-facility-details-component/athlete-facility-details-component';
import { AthleteIndividualTrainingComponent } from './components/athlete-individual-training-component/athlete-individual-training-component';
import { AthleteShopComponent } from './components/athlete-shop-component/athlete-shop-component';
import { EmployedProfileOverviewComponent } from './components/employed-profile-overview-component/employed-profile-overview-component';
import { EmployedReservationComponent } from './components/employed-reservation-component/employed-reservation-component';
import { EmployedPromotionShopComponent } from './components/employed-promotion-shop-component/employed-promotion-shop-component';
import { EmployedCalendarComponent } from './components/employed-calendar-component/employed-calendar-component';
import { AthleteStatisticsComponent } from './components/athlete-statistics-component/athlete-statistics-component';
import { EmployedFacilityCreationComponent } from './components/employed-facility-creation-component/employed-facility-creation-component';
import { EmployedReportComponent } from './components/employed-report-component/employed-report-component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path: "", component: WelcomeComponent},
    {path: "welcome", component: WelcomeComponent},
    {path: "forgotPassword", component: ForgottenPasswordComponent},
    {path: "reset-password/:token", component: ResetPasswordComponent},
    {path: "adminLogin", component: AdminLoginComponent},
    {path: "registration", component: RegistrationComponent},
    {path: "facilityDetails", component: FacilityDetailsComponent},
    {path: "admin", canActivate: [AuthGuard], data: {roles: ["administrator"]}, component: AdminComponent},
    {path: "athleteProfileOverview", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthleteProfileOverviewComponent},
    {path: "athleteReservation", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthleteReservationComponent},
    {path: "athleteFacilityDetails", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthleteFacilityDetailsComponent},
    {path: "athletePlayerSearch", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthletePlayerSearchComponent},
    {path: "athleteIndividualTraining", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthleteIndividualTrainingComponent},
    {path: "athleteGradeFacilities", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthleteGradingComponent},
    {path: "athleteShop", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthleteShopComponent},
    {path: "athleteStatistics", canActivate: [AuthGuard], data: {roles: ["sportista"]}, component: AthleteStatisticsComponent},
    {path: "employedProfileOverview", canActivate: [AuthGuard], data: {roles: ["zaposleni"]}, component: EmployedProfileOverviewComponent},
    {path: "employedReservation", canActivate: [AuthGuard], data: {roles: ["zaposleni"]}, component: EmployedReservationComponent},
    {path: "employedPromotionShop", canActivate: [AuthGuard], data: {roles: ["zaposleni"]}, component: EmployedPromotionShopComponent},
    {path: "employedCalendar", canActivate: [AuthGuard], data: {roles: ["zaposleni"]}, component: EmployedCalendarComponent},
    {path: "employedFacilityCreation", canActivate: [AuthGuard], data: {roles: ["zaposleni"]}, component: EmployedFacilityCreationComponent},
    {path: "employedReport", canActivate: [AuthGuard], data: {roles: ["zaposleni"]}, component: EmployedReportComponent}
    
    
];
