import { Role, RoleManager } from "discord.js";
import { colorRole } from "./constants";
const colorRoleName = await colorRole;

export async function integrityFix(
  roleManager: RoleManager,
): Promise<{ start: Role; end: Role }> {

  let start = roleManager.cache.find((role) => role.name === "<color>");
  let end = roleManager.cache.find((role) => role.name === "</color>");
  if (!start) {
    start = await roleManager.create({
      name: "<color>",
      color: 0x000000,
      reason: `Creating a color marker`,
    });
  }
  if (!end) {
    end = await roleManager.create({
      name: "</color>",
      color: 0x000000,
      reason: `Creating a color marker`,
    });
    await end.setPosition(start.position - 1);
  }

  const colorRoles = roleManager.cache.filter(
    (role) => role.name === colorRoleName,
  );
  const nonColorRoles = roleManager.cache.filter(
    (role) =>
      role.name !== colorRoleName &&
      role.name !== "<color>" &&
      role.name !== "</color>"
  );

  // outside bounds
  colorRoles.forEach(async (v) => {
    if (v.position > start.position || v.position < end.position) {
      await v.setPosition(end.position + 1);
    }
  });

  // inside bounds
  nonColorRoles.forEach(async (v) => {
    if (v.position < start.position && v.position > end.position) {
      await start.setPosition(0);
      await end.setPosition(start.position - 1);
      colorRoles.forEach(async (v) => {
        await v.setPosition(end.position + 1);
      });
    }
  });

  return { end, start };
}

export async function statusCheck(roleManager: RoleManager): Promise<string> {
  const start = roleManager.cache.find((role) => role.name === "<color>");
  const end = roleManager.cache.find((role) => role.name === "</color>");
  const colorRoles = roleManager.cache.filter(
    (role) => role.name === colorRoleName,
  );

  if (!start || !end) {
    console.log("Markers werent initialized correctly");
    return "Markers are not initialized correctly";
  }

  const nonColorRoles = roleManager.cache.filter(
    (role) =>
      role.name !== colorRoleName &&
      role.name !== "<color>" &&
      role.name !== "</color>",
  );

  if (
    colorRoles.some(
      (v) => v.position > start.position || v.position < end.position,
    )
  ) {
    console.log("Color roles outside of bounds");
    return "Color roles are outside of bounds";
  }

  if (
    nonColorRoles.some(
      (v) => v.position < start.position && v.position > end.position,
    )
  ) {
    console.log("Non color roles in bounds");
    return "Non-color roles are inside of bounds";
  }

  return "We in tip top condition :fire:";
}
