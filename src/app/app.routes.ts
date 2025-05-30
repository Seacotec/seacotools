import {Routes} from '@angular/router';
import {ButtonsComponent} from './components/buttons/buttons.component';
import {InputsComponent} from './components/inputs/inputs.component';
import {TablesComponent} from './components/tables/tables.component';
import {OverviewComponent} from './components/overview/overview.component';
import {TablePaginationComponent} from './components/table-pagination/table-pagination.component';
import {ValidationComponent} from './components/validation/validation.component';


export const routes: Routes = [
  {path: 'buttons', component: ButtonsComponent},
  {path: 'inputs', component: InputsComponent},
  {path: 'validations', component: ValidationComponent},
  {path: 'tables', component: TablesComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'pagination', component: TablePaginationComponent},
  {path: '', redirectTo: 'overview', pathMatch: 'prefix'},
  // {path: '**', component: PageNotFoundComponent},
];
