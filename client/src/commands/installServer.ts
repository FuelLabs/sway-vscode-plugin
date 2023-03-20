import { Terminal } from '../util';

export default function installServer() {
  Terminal.Sway.execute(
    `curl --proto '=https' --tlsv1.2 -sSf https://install.fuel.network/fuelup-init.sh | sh`
  );
}
