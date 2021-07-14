

type Statistics = {
  modified: string,
  added: string,
  deleted: string,
};

export function hmr(file: string, fn: (stat: Statistics) => void): void {
  console.log(file);
  console.log(fn);
}

// export class HMR {
//   parentModuleName = module.parent?.filename as string;
//   requireCache = require.cache;

//   constructor(
//     private watchDir: string,
//     private callback: () => void) { 
//     const watcher = this.setupWatcher();
//     watcher.on('all', this.handleFileChange.bind(this));
//     this.callback();
//   }

//   getCacheByModuleId(moduleId: string) {
//     return this.requireCache[moduleId];
//   }

//   deleteModuleFromCache(moduleId: string) {
//     delete this.requireCache[moduleId];
//   }

//   setupWatcher() {
//     return chokidar.watch(['**/*.js'], {
//       ignoreInitial: true,
//       cwd: this.watchDir,
//       ignored: [
//         '.git',
//         'node_modules',
//       ],
//     });
//   }

//   handleFileChange(event: unknown, file: string) {
//     const moduleId = path.resolve(this.watchDir, file);
//     const module = this.getCacheByModuleId(moduleId);

//     if (module) {
//       const modulesToReload = [module.id];
//       let parentModule = module.parent;

//       while (parentModule && parentModule.id !== '.') {
//         modulesToReload.push(parentModule.id);
//         parentModule = parentModule.parent;
//       }

//       modulesToReload.forEach((id) => {
//         this.deleteModuleFromCache(id);
//       });

//       this.callback();
//     }
//   }
// }