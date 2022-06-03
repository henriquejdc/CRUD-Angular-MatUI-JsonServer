import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Angular13-CRUD-JSON'
  productsData : any = [];

  displayedColumns: string[] = [
    'productName',
    'category',
    'date',
    'freshness',
    'price',
    'comment',
    'actions'
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api : ApiService
  ) {}

  ngOnInit() : void {
    this.getAllProducts();
  }

  openDialog() : void {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(
      val => {
        if (val === 'save') {
          this.getAllProducts();
        }
      }
    );
  }

  getAllProducts() : any {
    this.api.getProduct()
    .subscribe({
      next: (res : any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        alert("Error on load products!");
      }
    })
  }

  editProduct(row : any) : void {
    this.dialog.open(DialogComponent, {
      width:'30%',
      data: row
    }).afterClosed().subscribe(
      val => {
        if (val === 'update') {
          this.getAllProducts();
        }
      }
    );
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id)
    .subscribe({
      next: (res : any) => {
        alert("Product deleted sucessfully!");
        this.getAllProducts();
      },
      error: () => {
        alert("Error while deleting product!");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
