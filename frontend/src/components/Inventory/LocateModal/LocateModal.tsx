import { useEffect, useState } from "react";

import { Text } from "@mantine/core";

import { upperFirst, useLocalStorage } from "@mantine/hooks";

import clsx from "clsx";
import { Item } from "../../../types/types";
import classes from "./LocateModal.module.css";

type LocateModalProps = {
  item: Item;
};

const LocateModal = ({ item }: LocateModalProps) => {
  const [data, setData] = useState({
    leftTop: "",
    leftBottom: "",
    rightTop: "",
    rightMiddle: "",
    rightBottom: "",
    bottom: "",
  });

  const [, setRecent] = useLocalStorage<number[]>({
    key: "recently-searched",
    defaultValue: [],
  });

  useEffect(() => {
    const locationData = {
      [`${item.location.shelf}${upperFirst(
        item.location.rack
      )}`]: `Col ${item.location.col}, Row ${item.location.row}`,
    };

    setData((prev) => ({ ...prev, ...locationData }));
    //       increamentSearchCount();
    setRecent((prev: number[]) =>
      [...new Set([Number(item.id), ...prev])].slice(0, 10)
    );
  }, []);

  return (
    <>
      <Text fw={700} ta="center" tt="capitalize">
        {item?.name} {item?.potency.toUpperCase()}
      </Text>

      <div className={classes.grid}>
        <div
          className={clsx(classes.cell, classes.leftTop, {
            [classes.active]: data.leftTop,
          })}
        >
          {data.leftTop}
        </div>
        <div
          className={clsx(classes.cell, classes.leftBottom, {
            [classes.active]: data.leftBottom,
          })}
        >
          {data.leftBottom}
        </div>
        <div
          className={clsx(classes.cell, classes.rightTop, {
            [classes.active]: data.rightTop,
          })}
        >
          {data.rightTop}
        </div>
        <div
          className={clsx(classes.cell, classes.rightMiddle, {
            [classes.active]: data.rightMiddle,
          })}
        >
          {data.rightMiddle}
        </div>
        <div
          className={clsx(classes.cell, classes.rightBottom, {
            [classes.active]: data.rightBottom,
          })}
        >
          {data.rightBottom}
        </div>
        <div
          className={clsx(classes.cell, classes.bottom, {
            [classes.active]: data.bottom,
          })}
        >
          {data.bottom}
        </div>
      </div>
    </>
  );
};

export default LocateModal;
