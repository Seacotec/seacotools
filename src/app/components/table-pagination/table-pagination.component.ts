import {Component} from '@angular/core';
import {TableColumn} from '../../../../projects/seacotools/src/lib/core/types/table-types';
import {ScTableComponent} from '../../../../projects/seacotools/src/lib/sc-table/sc-table.component';


@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  imports: [ScTableComponent]
})
export class TablePaginationComponent {

  columns: TableColumn[] = [
    { field: 'id', label: 'ID', sortable: true, sortType: 'number' },
    { field: 'name', label: 'Name', sortable: true, sortType: 'text' },
    { field: 'email', label: 'Email', sortable: true, sortType: 'text' },
    { field: 'age', label: 'Age', sortable: true, sortType: 'number' },
  ];

  data: any[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 29 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 34 },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 42 },
    { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', age: 25 },
    { id: 5, name: 'Charlie Davis', email: 'charlie.davis@example.com', age: 30 },
    { id: 6, name: 'Grace Lee', email: 'grace.lee@example.com', age: 27 },
    { id: 7, name: 'Mark Wilson', email: 'mark.wilson@example.com', age: 45 },
    { id: 8, name: 'Emma Thomas', email: 'emma.thomas@example.com', age: 32 },
    { id: 9, name: 'David White', email: 'david.white@example.com', age: 38 },
    { id: 10, name: 'Sophia Martinez', email: 'sophia.martinez@example.com', age: 36 },
    { id: 11, name: 'Lucas Baker', email: 'lucas.baker@example.com', age: 28 },
    { id: 12, name: 'Olivia Martin', email: 'olivia.martin@example.com', age: 33 },
    { id: 13, name: 'William Harris', email: 'william.harris@example.com', age: 40 },
    { id: 14, name: 'Isabella Clark', email: 'isabella.clark@example.com', age: 26 },
    { id: 15, name: 'James Rodriguez', email: 'james.rodriguez@example.com', age: 31 },
    { id: 16, name: 'Matthew Adams', email: 'matthew.adams@example.com', age: 29 },
    { id: 17, name: 'Ella Scott', email: 'ella.scott@example.com', age: 34 },
    { id: 18, name: 'Liam Turner', email: 'liam.turner@example.com', age: 42 },
    { id: 19, name: 'Ava Parker', email: 'ava.parker@example.com', age: 25 },
    { id: 20, name: 'Chris Gray', email: 'chris.gray@example.com', age: 30 },
    { id: 21, name: 'Sarah Evans', email: 'sarah.evans@example.com', age: 27 },
    { id: 22, name: 'Henry King', email: 'henry.king@example.com', age: 45 },
    { id: 23, name: 'Lily Wright', email: 'lily.wright@example.com', age: 32 },
    { id: 24, name: 'Owen Hill', email: 'owen.hill@example.com', age: 38 },
    { id: 25, name: 'Mia Young', email: 'mia.young@example.com', age: 36 },
    { id: 26, name: 'Jack Allen', email: 'jack.allen@example.com', age: 28 },
    { id: 27, name: 'Amelia Hernandez', email: 'amelia.hernandez@example.com', age: 33 },
    { id: 28, name: 'Zoe Mitchell', email: 'zoe.mitchell@example.com', age: 40 },
    { id: 29, name: 'Noah Perez', email: 'noah.perez@example.com', age: 26 },
    { id: 30, name: 'Hannah Rivera', email: 'hannah.rivera@example.com', age: 31 },
    { id: 31, name: 'Ethan Edwards', email: 'ethan.edwards@example.com', age: 29 },
    { id: 32, name: 'Sophie Carter', email: 'sophie.carter@example.com', age: 34 },
    { id: 33, name: 'Nathan Torres', email: 'nathan.torres@example.com', age: 42 },
    { id: 34, name: 'Emily Rogers', email: 'emily.rogers@example.com', age: 25 },
    { id: 35, name: 'Oliver Bennett', email: 'oliver.bennett@example.com', age: 30 },
    { id: 36, name: 'Charlotte Berry', email: 'charlotte.berry@example.com', age: 27 },
    { id: 37, name: 'Benjamin Jenkins', email: 'benjamin.jenkins@example.com', age: 45 },
    { id: 38, name: 'Grace Myers', email: 'grace.myers@example.com', age: 32 },
    { id: 39, name: 'Alexander Reed', email: 'alexander.reed@example.com', age: 38 },
    { id: 40, name: 'Ella Powell', email: 'ella.powell@example.com', age: 36 },
    { id: 41, name: 'Jacob Howard', email: 'jacob.howard@example.com', age: 28 },
    { id: 42, name: 'Victoria Ward', email: 'victoria.ward@example.com', age: 33 },
    { id: 43, name: 'Daniel Cooper', email: 'daniel.cooper@example.com', age: 40 },
    { id: 44, name: 'Chloe Peterson', email: 'chloe.peterson@example.com', age: 26 },
    { id: 45, name: 'Logan Bailey', email: 'logan.bailey@example.com', age: 31 },
  ];

}
