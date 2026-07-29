import * as TeamService from "../services/employee.service.js";
import ApiResponse from "../utils/ApiResponse.utils.js";

export const createTeamMemberController = async (req, res) => {
  const teamDetails = req.validated.body;
  const teamFiles = req.files || {};

  const result = await TeamService.createTeamMemberService({
    teamDetails,
    teamFiles,
  });

  return res.status(201).json(
    new ApiResponse({
      httpStatusCode: 201,
      message: result.message,
      data: result.data,
    })
  );
};

export const getAllTeamMembersController = async (req, res) => {
  const result = await TeamService.getAllTeamMembersService();

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const editTeamMemberController = async (req, res) => {
  const { teamMemberId } = req.validated.params;
  const teamDetails = req.validated.body;
  const teamFiles = req.files || {};

  const result = await TeamService.editTeamMemberService({
    teamMemberId,
    teamDetails,
    teamFiles,
  });

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const deleteTeamMemberByIdController = async (req, res) => {
  const { teamMemberId } = req.params;

  const result = await TeamService.deleteTeamMemberByIdService(teamMemberId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};
