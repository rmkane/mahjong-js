import * as Ammo from "ammo.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let ammoModule: any;
export const ammoReadyPromise = new Promise((resolve) => {
  new Ammo().then((res: unknown) => {
    ammoModule = res;
    resolve(res);
  });
});
