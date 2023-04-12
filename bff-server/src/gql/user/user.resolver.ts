import { container } from '../../ioc';
import { Dependencies } from '../../Dependencies';
import { UserService } from '../../services/interfaces/UserService';

const getUserService = () => (container.get<UserService>(Dependencies.UserService));

export const userResolvers = {
  Query: {
    user: async (_, { userId }, { requestContext }) => {
      return getUserService().getUserById(userId, requestContext);
    },
    users: async (_, { userIds }, { requestContext }) => {
      return getUserService().getUsersByIds(userIds, requestContext);
    }
  }
};
