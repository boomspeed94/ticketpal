import { ContractModel } from '../models';
import { contractStore } from '../stores';

class ContractController {
  async getDefault(){
    // Get from db
    const res = await contractStore.getDefault();

    return res;
  }

  async getByAddress(address: string){
    // Get from db
    const res = await contractStore.getByAddress(address);

    return res;
  }
}

export const contractController = new ContractController();