import { log } from '../util';

export default function forcRun(forcDir: string) {
  log.terminal(`cd ${forcDir} && forc run --unsigned`);
}
