import { io } from "../index.js";
import { operators } from "../models/connection/connectionEvents.js";

export const informConnOperator = (agentIds, status) => {
  try {
    const matchingSocketIds = [];

    for (const { operator, agentsTeam } of operators) {
      for (const agentId of agentIds) {
        if (agentsTeam.includes(agentId)) {
          matchingSocketIds.push(operator);
        }
      }
    }

    if (matchingSocketIds.length > 0) {
      matchingSocketIds.forEach((operator) => {
        io.to(operator).emit("agentStatusUpdated",  agentIds.map(agent=>({[agent]:status})));
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};
