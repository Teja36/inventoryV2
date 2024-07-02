import { count } from "drizzle-orm";
import { Request, Response } from "express";
import db from "../db/db_connect.js";
import { medicines, users } from "../db/schema.js";

type Accumulator = {
  [key: string]: number;
  count: number;
};

type GraphDataItem = {
  potency: string | null;
  count: number;
};

const getTimeSaved = (searchCount: number) => {
  searchCount += searchCount * 0.2;
  let res = "";
  let hours = Math.floor(searchCount / 60);
  let minutes = Math.round(searchCount % 60);

  if (hours > 0) {
    res += hours;
    res += hours < 2 ? "hr" : "hrs";
  }

  res += minutes;
  res += minutes < 2 ? "min" : "mins";

  return res;
};

export const getGraphData = async (req: Request, res: Response) => {
  if (!res.locals.session)
    return res.status(403).json({ error: "Access Denied!" });

  let graphData;

  try {
    graphData = await db
      .select({
        potency: medicines.potency,
        count: count(medicines.potency),
      })
      .from(medicines)
      .groupBy(medicines.potency);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" });
  }

  if (!graphData)
    return res.status(500).json({ error: "Something went wrong!" });

  const chart = graphData.reduce(
    (prev: Accumulator, { potency, count }: GraphDataItem) => {
      prev[potency as string] = count;
      return prev;
    },
    {} as Accumulator
  );

  return res.status(200).json(chart);
};

export const getDashboardData = async (req: Request, res: Response) => {
  if (!res.locals.session)
    return res.status(403).json({ error: "Access Denied!" });

  try {
    let [userCount] = await db.select({ count: count() }).from(users);
    let [medicineCount] = await db.select({ count: count() }).from(medicines);

    let searchCount = 1000;

    let timeSaved = getTimeSaved(searchCount);

    return res.status(200).json({
      userCount: userCount.count,
      medicineCount: medicineCount.count,
      searchCount,
      timeSaved,
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

export const getMedicineAutocompleteData = async (
  req: Request,
  res: Response
) => {
  if (!res.locals.session)
    return res.status(403).json({ error: "Access Denied!" });

  try {
    const distinctPotencies = await db
      .selectDistinct({ potency: medicines.potency })
      .from(medicines);

    const distinctBrands = await db
      .selectDistinct({ brand: medicines.brand })
      .from(medicines);

    const distinctSizes = await db
      .selectDistinct({ size: medicines.size })
      .from(medicines);

    const potencyList = distinctPotencies.map((val) => val.potency);

    const brandList = distinctBrands.map((val) => val.brand);

    const sizeList = distinctSizes.map((val) => val.size);

    return res.status(200).json({
      potency: potencyList,
      brand: brandList,
      size: sizeList,
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
};
