import React, { Component, useCallback, useMemo } from "react";
import { render } from "react-dom";
import { manager, state$ } from "./manager";

// console.log("#state$", state$, state$.__immutable__.get("data").length);

const initialState = { data: [], selected: 0 };

function Row({ index }) {
  const { item, selected } = state$.useSelector((state) => {
    // console.log('#state.data', state.data, state$.data.get)
    const item = state$.__immutable__.getIn(["data", index]) || {};
    // console.log('#item', item);
    return {
      item: item,
      selected: state.selectId === item?.id,
    };
  });
  // return <div></div>;
  const onSelect = useCallback(() => {
    manager.select(item.id);
  }, [index, item]);
  const onRemove = useCallback(() => {
    manager.remove(item.id);
  }, [index, item]);

  return (
    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={onSelect}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={onRemove}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  );
}

class Button extends Component {
  render() {
    const { id, cb, title } = this.props;

    return (
      <div className="col-sm-6 smallpad">
        <button
          type="button"
          className="btn btn-primary btn-block"
          id={id}
          onClick={cb}
        >
          {title}
        </button>
      </div>
    );
  }
}

class Jumbotron extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button
                id="run"
                title="Create 1,000 rows"
                cb={manager.create._1_000rows}
              />
              <Button
                id="runlots"
                title="Create 10,000 rows"
                cb={manager.create._10_000rows}
              />
              <Button id="add" title="Append 1,000 rows" cb={manager.add} />
              <Button
                id="update"
                title="Update every 10th row"
                cb={manager.update}
              />
              <Button id="clear" title="Clear" cb={manager.clear} />
              <Button id="swaprows" title="Swap Rows" cb={manager.swapRows} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Main() {
  const dataLength = state$.useSelector(() => manager.dataLength);
  // console.log("#dataLength", dataLength);

  const $rows = useMemo(
    () =>
      new Array(dataLength)
        .fill(0)
        .map((_, index) => <Row key={index} index={index} />),
    [dataLength]
  );

  return (
    <div className="container">
      <Jumbotron />
      <table className="table table-hover table-striped test-data">
        <tbody>{$rows}</tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  );
}

render(<Main />, document.getElementById("main"));
