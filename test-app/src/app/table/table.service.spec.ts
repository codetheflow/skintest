import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { TableService } from './table.service';


describe('TableService', () => {
  let service: TableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableService]
    });

    service = TestBed.inject(TableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getRows should return the same the #setRows value', () => {
    const rows = ['first', 'second', 'third'];
    service.setRows(rows);
    expect(service.getRows()).toEqual(['first', 'second', 'third']);
  });

  it('#setRows should accepts null and undefined and convert them to an empty array', () => {
    service.setRows(null);
    expect(service.getRows()).toHaveSize(0);
    service.setRows(undefined);
    expect(service.getRows()).toHaveSize(0);
  });

  it('#getColumns should return the same #setColumns value', () => {
    const columns = ['first', 'second', 'third'];
    service.setColumns(columns);
    expect(service.getColumns()).toEqual(['first', 'second', 'third']);
  });

  it('#setColumns should accepts null and undefined and convert them to an empty array', () => {
    service.setRows(null);
    expect(service.getRows()).toHaveSize(0);
    service.setRows(undefined);
    expect(service.getRows()).toHaveSize(0);
  });

  it('#updateState$ should return the "empty" state on start', (done) => {
    service.updateState$.subscribe(state => {
      expect(state).toEqual('empty');
      done();
    });
  });

  it('#updateState$ should next "has-rows" on #setRows', (done) => {
    service.setRows(['first', 'second', 'third']);
    service.updateState$.subscribe(state => {
      expect(state).toEqual('has-rows');
      done();
    });
  });

  it('#checkState should not trigger redundant #updateState$ events', fakeAsync(() => {
    const states = [];
    service.updateState$
      .subscribe(state => states.push(state));

    service.checkState(); service.setRows(['first', 'second', 'third']);
    service.checkState(); service.setRows(['first', 'second', 'third']);
    service.checkState(); service.setRows([]);
    service.checkState(); service.setRows(null);
    service.checkState(); service.setRows(['first', 'second', 'third']);
    service.checkState(); service.setRows(['first', 'second', 'third']);

    flushMicrotasks();
    expect(states).toEqual(['empty', 'has-rows', 'empty', 'has-rows']);
  }));
});
