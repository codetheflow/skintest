import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { CommandModule } from '../command/command.module';
import { Checked } from '../common/checked';
import { IconModule } from '../icon/icon.module';
import { Column } from '../table/table-meta';
import { TableService } from '../table/table.service';

import { ColumnChooserComponent } from './column-chooser.component';

describe('ColumnChooserComponent', () => {
  let component: ColumnChooserComponent;
  let fixture: ComponentFixture<ColumnChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnChooserComponent],
      imports: [
        CommonModule,
        CommandModule,
        IconModule,
      ],
      providers: [
        TableService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#columns input should be in sync with #checkedColumns$', fakeAsync(() => {
    let checkedColumns: Array<Checked<Column>>;
    component.checkedColumns$.subscribe(xs => checkedColumns = xs);

    component.columns = ['first', 'second', 'third'];
    component.ngOnChanges({
      columns: new SimpleChange(null, component.columns, true)
    });

    flushMicrotasks();

    expect(
      checkedColumns
        // we do not call table.setColumns, so expect that all columns
        // should be in unchecked state
        .filter(x => !x.state)
        .map(x => x.data)
    ).toEqual(component.columns);
  }));

  it('#toggle should change column checked state', () => {
    const checkedColumn = new Checked<Column>('first', false);
    component.toggle.prob(checkedColumn);
    expect(checkedColumn.state).toBeTrue();
  });

  it('#toggle should change column checked state to unchecked if there are other checked columns', fakeAsync(() => {
    let checkedColumns: Array<Checked<Column>>;
    component.checkedColumns$.subscribe(xs => checkedColumns = xs);

    component.columns = ['first', 'second', 'third'];
    component.ngOnChanges({
      columns: new SimpleChange(null, component.columns, true)
    });

    flushMicrotasks();

    // check first and second columns
    component.toggle.prob(checkedColumns[0]);
    component.toggle.prob(checkedColumns[1]);
    // try to uncheck back first column
    component.toggle.prob(checkedColumns[0]);

    expect(checkedColumns[0].state).toBeFalse();
  }));

  it('#toggle should not change column checked state to unchecked if it\'s only one which is checked', fakeAsync(() => {
    let checkedColumns: Array<Checked<Column>>;
    component.checkedColumns$.subscribe(xs => checkedColumns = xs);

    component.columns = ['first', 'second', 'third'];
    component.ngOnChanges({
      columns: new SimpleChange(null, component.columns, true)
    });

    flushMicrotasks();

    // check first column
    component.toggle.prob(checkedColumns[0]);
    // try to uncheck back first column
    component.toggle.prob(checkedColumns[0]);

    expect(checkedColumns[0].state).toBeTrue();
  }));
});