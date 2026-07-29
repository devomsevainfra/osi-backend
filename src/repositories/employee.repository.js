import Employee from "../models/employee.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const createTeamMember = withMongoErrorHandling(async (teamDetails) => {
  return await Employee.create(teamDetails);
});

export const findTeamMemberById = withMongoErrorHandling(
  async (teamMemberId) => {
    return await Employee.findById(teamMemberId);
  }
);

export const findAllTeamMembers = withMongoErrorHandling(
  async (filter = {}) => {
    return await Employee.find(filter)
      .sort({ createdAt: -1 })
      .select({ __v: 0 });
  }
);

export const updateTeamMemberById = withMongoErrorHandling(
  async (teamMemberId, teamDetails) => {
    return await Employee.findByIdAndUpdate(
      teamMemberId,
      { $set: teamDetails },
      { new: true, runValidators: true }
    ).select({ __v: 0 });
  }
);

export const deleteTeamMemberById = withMongoErrorHandling(
  async (teamMemberId) => {
    return await Employee.findByIdAndDelete(teamMemberId);
  }
);
