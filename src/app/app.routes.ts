import {Routes} from '@angular/router';
import {ButtonsComponent} from './components/buttons/buttons.component';
import {InputsComponent} from './components/inputs/inputs.component';
import {TablesComponent} from './components/tables/tables.component';
import {OverviewComponent} from './components/overview/overview.component';


export const routes: Routes = [
  {path: 'buttons', component: ButtonsComponent},
  {path: 'inputs', component: InputsComponent},
  {path: 'tables', component: TablesComponent},
  {path: 'overview', component: OverviewComponent},
  // {path: 'sc-dialogs', component: DialogsComponent},
  // {path: 'custom-table', component: CustomTableComponent},
  // {path: 'search-bar', component: SearchBarComponent},
  // {path: 'password-reset', component: PasswordResetComponent},
  // {path: 'login', component: LoginComponent},
  // {path: 'forgot-password', component: ForgotPasswordComponent},
  // {path: 'reusable-inputs', component: ReusableInputsComponent},
  {path: '', redirectTo: 'overview', pathMatch: 'prefix'},
  // {path: '**', component: PageNotFoundComponent},
];
