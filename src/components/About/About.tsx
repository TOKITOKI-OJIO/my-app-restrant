import * as React from "react";
import { Typography, Card, Button } from "@arco-design/web-react";
import _ from "lodash";
export default function Example(props) {
  const [item, setItems] = React.useState([
    { id: 101, text: "Apple" },
    { id: 102, text: "Banana" },
    { id: 103, text: "Cherry" },
  ]);
  const items = [
    { id: 101, text: "Apple" },
    { id: 102, text: "Banana" },
    { id: 103, text: "Cherry" },
  ];
  return (
    <Card style={{ height: "80vh" }}>
      <Button
        onClick={() => {
          const newItem: Array<any> = _.cloneDeep(item);
          newItem.shift();
          setItems(newItem);
        }}
      >-</Button>
      <Button
        onClick={() => {
          const newItem: Array<any> = _.cloneDeep(item);
          newItem.unshift({ id: Math.random(), text: "Apple" + Math.random() });
          setItems(newItem);
        }}
      >+</Button>
      <ul>
        {item.map((item, index) => (
          <li key={index}>
            {item.text} <input type="text" />
          </li>
        ))}
      </ul>
    </Card>
  );
}
