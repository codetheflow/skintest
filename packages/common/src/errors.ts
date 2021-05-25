export type Exception = Error;

function error(name: string, message: string): Exception {
  const ex = new Error(message);
  ex.name = `skintest.${name}`;
  return ex;
}

export const errors = {
  invalidArgument<T = unknown>(name: string, value: T): Exception {
    return error('invalidArgument', `\`${name}\` with value \`${value}\``);
  },
  undefined(name: string): Exception {
    return error('undefined', name);
  },
  notNull(name: string): Exception {
    return error('notNull', name);
  },
  notEmpty(name: string): Exception {
    return error('notEmpty', name);
  },
  pageNotFound(id: string): Exception {
    return error('pageNotFound', `page \`${id}\` is not found`);
  },
  noCurrentPage(): Exception {
    return error('noCurrentPage', `no page opened, please make sure that \`I.open()\` was called before`);
  },
  elementNotFound(selector: string): Exception {
    return error('elementNotFound', `element \`${selector}\` is not found`);
  },
  callerNotFound(site: string): Exception {
    return error('callerNotFound', `here ${site}`);
  },
  timeout(source: string, ex: Error): Exception {
    return error('timeout', `${source} timeout exceed`);
  }
}