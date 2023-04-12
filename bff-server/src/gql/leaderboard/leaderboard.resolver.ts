import { container } from '../../ioc';
import {
  LeaderBoardService,
  LeaderBoardData,
  RangeData,
} from '../../services/interfaces/LeaderBoardService';
import { Dependencies } from '../../Dependencies';
import { UserService } from '../../services/interfaces/UserService';
import { config } from 'node-config-ts';

const getLeaderBoardService = () =>
  container.get<LeaderBoardService>(Dependencies.LeaderBoardService);
const getUserService = () =>
  container.get<UserService>(Dependencies.UserService);

export const leaderBoardResolvers = {
  Query: {
    leaderBoard: (_, { dashboardInput, outComeType }, { requestContext }) => {
      let result: Promise<LeaderBoardData>;
      switch (outComeType) {
        case config.leaderBoardOutComes.outCome1:
          result = getLeaderBoardService().getQuotaAttainmentCounts(
            dashboardInput.startDate,
            dashboardInput.endDate,
            requestContext
          );
          break;
        case config.leaderBoardOutComes.outCome2:
          result = getLeaderBoardService().getWinRateCounts(
            dashboardInput.startDate,
            dashboardInput.endDate,
            requestContext
          );
          break;
        case config.leaderBoardOutComes.outCome3:
          result = getLeaderBoardService().getDealSizeCounts(
            dashboardInput.startDate,
            dashboardInput.endDate,
            requestContext
          );
          break;
        case config.leaderBoardOutComes.outCome4:
          result = getLeaderBoardService().getSalesCycleCounts(
            dashboardInput.startDate,
            dashboardInput.endDate,
            requestContext
          );
          break;
        default:
          break;
      }
      return result;
    },

    rangeData: (
      _,
      { dashboardInput, rangeNo, outComeType },
      { requestContext }
    ) => {
      let result: Promise<RangeData[]>;

      switch (outComeType) {
        case config.leaderBoardOutComes.outCome1:
          result = getLeaderBoardService().getQuotaAttainmentData(
            dashboardInput.startDate,
            dashboardInput.endDate,
            rangeNo,
            requestContext
          );
          break;
        case config.leaderBoardOutComes.outCome2:
          result = getLeaderBoardService().getWinRateData(
            dashboardInput.startDate,
            dashboardInput.endDate,
            rangeNo,
            requestContext
          );
          break;
        case config.leaderBoardOutComes.outCome3:
          result = getLeaderBoardService().getDealSizeData(
            dashboardInput.startDate,
            dashboardInput.endDate,
            rangeNo,
            requestContext
          );
          break;
        case config.leaderBoardOutComes.outCome4:
          result = getLeaderBoardService().getSalesCycleData(
            dashboardInput.startDate,
            dashboardInput.endDate,
            rangeNo,
            requestContext
          );
          break;
        default:
          break;
      }
      return result;
    },
    battleCard: (
      _,
      { dashboardInput, userId, outComeType, battleCardType },
      { requestContext }
    ) => {
          return  getLeaderBoardService().getBattleCards(
            dashboardInput.startDate,
            dashboardInput.endDate,
            outComeType,
            userId,
            battleCardType,
            requestContext
          );
    },
  },

  RangeData: {
    user: async ({ userId }, _, { requestContext }) => {
      return getUserService().getUserById(userId, requestContext);
    },
  },

  BattleCardOutput: {
    user: async ({ userId }, _, { requestContext }) => {
      return getUserService().getUserById(userId, requestContext);
    },
  },

};
