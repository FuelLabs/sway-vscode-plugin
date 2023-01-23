import { log } from '../util';

export default function forcBuild(forcDir: string) {
  log.terminal(`cd ${forcDir} && forc build`);
}
