// import { errors, Guard, isRegExp, isString, KeyValue, likeKeyValue, reinterpret } from '@skintest/common';
// import { AssertHost, AssertHow, AssertWhat, fail, pass, Query, QueryList, TestResult, Verify } from '@skintest/sdk';
// import { ElementState } from './element';
// import { Page } from './page';

// export class WebVerify implements Verify {
//   constructor(private page: Page) {
//   }

//   statement<V>(
//     query: Query | QueryList,
//     assert: AssertHost,
//     expected: V
//   ): Promise<TestResult> {
//     Guard.notNull(query, 'query');
//     Guard.notNull(assert, 'assert');

//     if (query.type === 'query') {
//       return this.conditionOnQuery(query, assert, expected);
//     }

//     return this.conditionOnQueryList(query, assert, expected);
//   }

//   private async conditionOnQuery<V>(
//     query: Query,
//     assert: AssertHost,
//     expected: V
//   ): Promise<TestResult> {
//     const selector = query.toString();
//     const elementRef = await this.page.query(selector);
//     if (!elementRef) {
//       if (assert.what === 'state' && '' + expected === 'exists') {
//         if (assert.no) {
//           return pass();
//         }

//         return fail
//           .condition({
//             host: assert,
//             query,
//             actual: 'not exists',
//             etalon: expected
//           });
//       }

//       return fail.element({ query });
//     }


//     // todo: remove copy/paste code below
//     switch (assert.what) {
//       case AssertWhat.text: {
//         const actual = await elementRef.text();
//         const etalon = reinterpret<string>(expected);
//         if (this.test(assert, actual, etalon) === true) {
//           return pass();
//         }

//         return fail
//           .condition({
//             actual,
//             etalon,
//             query,
//             host: assert,
//           });
//       }
//       case AssertWhat.state: {
//         const etalon = reinterpret<ElementState>(expected);
//         const actual = await elementRef.state(etalon);
//         if (this.test(assert, actual, true)) {
//           return pass();
//         }

//         return fail
//           .condition({
//             actual: assert.no ? etalon : opposite(etalon),
//             etalon,
//             query,
//             host: assert,
//           });
//       }
//       case AssertWhat.class: {
//         const etalon = reinterpret<string>(expected);
//         const classList = await elementRef.classList();
//         if (classList.has(etalon)) {
//           return pass();
//         }

//         return fail
//           .condition({
//             actual: classList.toString(),
//             etalon,
//             query,
//             host: assert,
//           });
//       }
//       case AssertWhat.attribute:
//       case AssertWhat.style: {
//         const getActual = (name: string) =>
//           assert.what === AssertWhat.attribute
//             ? elementRef.attribute(name)
//             : elementRef.style(name);

//         if (isString(expected)) {
//           const etalon = reinterpret<string>(expected);
//           const actual = await getActual(etalon);
//           assert.how = AssertHow.exists;

//           if (this.test(assert, actual, etalon)) {
//             return pass();
//           }

//           return fail
//             .condition({
//               actual,
//               etalon,
//               query,
//               host: assert,
//             });
//         }

//         if (likeKeyValue(expected)) {
//           const [name, etalon] = reinterpret<KeyValue<string>>(expected);
//           const actual = await getActual(name);
//           if (!isString(etalon)) {
//             assert.how = AssertHow.like;
//           }

//           if (this.test(assert, actual, etalon)) {
//             return pass();
//           }

//           return fail
//             .condition({
//               actual,
//               etalon,
//               query,
//               host: assert,
//             });
//         }

//         throw errors.invalidArgument('expected', expected);
//       }
//       default: {
//         throw errors.invalidArgument('what', assert.what);
//       }
//     }
//   }

//   private async conditionOnQueryList<V>(
//     query: QueryList,
//     assert: AssertHost,
//     expected: V
//   ): Promise<TestResult> {
//     const selector = query.toString();
//     const elementRefList = await this.page.queryList(selector);
//     switch (assert.what) {
//       case AssertWhat.length: {
//         const actual = await elementRefList.length;
//         const etalon = reinterpret<number>(expected);
//         if (this.test(assert, actual, etalon)) {
//           return pass();
//         }

//         return fail
//           .condition({
//             actual,
//             etalon,
//             query,
//             host: assert,
//           });
//       }
//       default: {
//         throw errors.invalidArgument('what', assert.what);
//       }
//     }
//   }

//   private test<V>(assert: AssertHost, received: V, expected: V): boolean {
//     let result: boolean;
//     switch (assert.how) {
//       case AssertHow.exists: {
//         result = !!received;
//         break;
//       }
//       case AssertHow.above: {
//         result = received > expected;
//         break;
//       }
//       case AssertHow.below: {
//         result = received < expected;
//         break;
//       }
//       case AssertHow.equals: {
//         result = expected === received;
//         break;
//       }
//       case AssertHow.like: {
//         if (isString(expected)) {
//           result = ('' + received).includes('' + expected);
//           break;
//         }

//         if (isRegExp(expected)) {
//           const actualText = '' + received;
//           const regexp = reinterpret<RegExp>(expected);
//           result = actualText.match(regexp) !== null;
//           break;
//         }

//         throw errors.invalidArgument('expected', expected);
//       }
//       default: {
//         throw errors.invalidArgument('how', assert.how);
//       }
//     }

//     return assert.no ? !result : result;
//   }
// }

// function opposite(state: ElementState): string {
//   switch (state) {
//     case 'checked': return 'unchecked';
//     case 'disabled': return 'enabled';
//     case 'editable': return 'not editable';
//     case 'enabled': return 'disabled';
//     case 'exists': return 'not exists';
//     case 'focused': return 'not focused';
//     case 'hidden': return 'visible';
//     case 'visible': return 'not visible';
//     default: throw errors.invalidArgument('state', state);
//   }
// }