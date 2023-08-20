import { observable } from "rct-state";
import { Seq, List } from "immutable";
import { buildData } from "./data";
interface State {
  data: List<Array<{ id: number; label: string }>>;
  selectId: number;
}

const initialState: State = {
  data: List([]),
  selectId: -1,
};

class StateManager {
  state$ = observable(initialState);

  get dataLength(): number {
    return this.state$.__immutable__.get("data").size;
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
    this.state$.data.set(
      this.state$.__immutable__.get("data").concat(appendData)
    );
  };

  update = () => {
    const dataLength = this.dataLength;
    this.state$.batch(() => {
      for (let i = 0; i < dataLength; i += 10) {
        const r = this.state$.data[i].get();
        this.state$.data[i].set({ id: r.id, label: r.label + " !!!" });
      }
    });
  };

  clear = () => {
    this.state$.batch(() => {
      this.state$.selectId.set(0);
      this.state$.data.set(List([]));
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
    this.state$.batch(() => {
      this.state$.data.set(
        this.state$.__immutable__.get("data").filter((item) => item.id !== id)
      );
    });
  };

  select = (id: number) => {
    this.state$.selectId.set(id);
  };
}

export const manager = new StateManager();
export const state$ = manager.state$;
// @ts-ignore
window.state$ = state$;
// @ts-ignore
window.Seq = Seq;