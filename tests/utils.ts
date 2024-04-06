import { Collection } from "discord.js";
import { IRole } from "./mock-types";

function moveElementInArray<T>(
  array: T[],
  element: T,
  newIndex: number,
  offset = false,
): number {
  const index = array.indexOf(element);
  newIndex = (offset ? index : 0) + newIndex;
  if (newIndex > -1 && newIndex < array.length) {
    const removedElement = array.splice(index, 1)[0];
    array.splice(newIndex, 0, removedElement);
  }
  return array.indexOf(element);
}

export function setPosition(
  item: IRole,
  position: number,
  relative: boolean,
  sorted: Collection<string, IRole>,
) {
  let updatedItems = [...sorted.values()];
  moveElementInArray(updatedItems, item, position, relative);
  let changes = updatedItems.map((r, i) => ({ id: r.id, position: i }));
  return changes;
}

export function discordSort(collection: Collection<string, IRole>) {
  return collection.sorted(
    (a, b) => a.position - b.position || Number(BigInt(b.id) - BigInt(a.id)),
  );
}
