
import { loop } from "./index";

describe("library", function () {
    it("loops 100 times", async function () {
        return new Promise<void>(resolve => {
            let tick = 0;
            function update() {
                tick += 1;
                if (tick === 100) {
                    handle.stop();
                    resolve();
                }
            }
            const handle = loop(100, update);
        });
    });
})