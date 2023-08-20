import { observable } from "rct-state";
import { buildData } from "./data";
interface State {
  data: Array<{ id: number; label: string }>;
  selectId: number;
}

const initialState: State = {
  data: [],
  selectId: -1,
};

class StateManager {
  state$ = observable(initialState);

  get dataLength(): number {
    return this.state$.data.get().length;
  }

  create = {
    _1_000rows: () => {
      this.state$.batch(() => {
        this.state$.selectId.set(0);
        this.state$.data.set(buildData(1000));
      });
    },
    _10_000rows: () => {
      this.state$.batch(() => {
        this.state$.selectId.set(0);
        this.state$.data.set(buildData(10000));
      });
    },
  };

  add = () => {
    const appendData = buildData(1000);
    this.state$.data.set(this.state$.data.get().concat(appendData));
  };

  update = () => {
    const data = this.state$.data.get();
    const dataLength = data.length;
    this.state$.batch(() => {
      for (let i = 0; i < dataLength; i += 10) {
        const r = data[i];
        this.state$.data[i].set({ id: r.id, label: r.label + " !!!" });
      }
    });
  };

  clear = () => {
    this.state$.batch(() => {
      this.state$.selectId.set(0);
      this.state$.data.set([]);
    });
  };

  swapRows = () => {
    if (this.dataLength <= 998) {
      return;
    }

    const data_1 = this.state$.data[1].get();
    const data_998 = this.state$.data[998].get();
    this.state$.batch(() => {
      this.state$.data[1].set(data_998);
      this.state$.data[998].set(data_1);
    });
  };

  remove = (id: number) => {
    // console.log("#remove", id);
    this.state$.batch(() => {
      this.state$.data.set(
        this.state$.data.get().filter((item) => item.id !== id)
      );
    });
  };

  select = (id: number) => {
    // console.log("#select id", id);
    this.state$.selectId.set(id);
  };
}

export const manager = new StateManager();
export const state$ = manager.state$;
// @ts-ignore
window.state$ = state$;
