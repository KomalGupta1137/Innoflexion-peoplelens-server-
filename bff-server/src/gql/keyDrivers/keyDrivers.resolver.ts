import { container } from '../../ioc';
import { Dependencies } from '../../Dependencies';
import { KeyDriversService } from '../../services/interfaces/KeyDriversService';

const getKeyDriversService = () =>
  container.get<KeyDriversService>(Dependencies.KeyDriversService);

export const keyDriversResolvers = {
  Query: {
    keyDriversData: (_, { keyDriversInput }, { requestContext }) => {
      return getKeyDriversService().getKeyDriversData(
        new Date(keyDriversInput.startDate),
        new Date(keyDriversInput.endDate),
        keyDriversInput.productId,
        requestContext
      );
    },
  },
};
