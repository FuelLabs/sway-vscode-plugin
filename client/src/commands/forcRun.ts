import { Terminal } from '../util/util';

export default function forcRun(forcDir: string) {
  Terminal.Sway.execute(`cd ${forcDir} && forc run --unsigned`);
}
